import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import dbConnect from "../../../utils/dbConnect";
import User from "../../../models/User";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                await dbConnect();

                // Find user by email
                const user = await User.findOne({ email: credentials.email }).select("+password");

                if (!user) {
                    throw new Error("Invalid email or password");
                }

                // Check if password matches
                const isMatch = await user.comparePassword(credentials.password);

                if (!isMatch) {
                    throw new Error("Invalid email or password");
                }

                // Update last login time
                user.lastLogin = new Date();
                await user.save();

                return {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    image: user.avatar,
                };
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID || "",
            clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
            }
            return session;
        },
        async signIn({ user, account, profile }) {
            // Handle OAuth signin by creating or updating the user
            if (account.provider === "google" || account.provider === "github") {
                await dbConnect();

                try {
                    // Check if user exists
                    let dbUser = await User.findOne({ email: user.email });

                    if (!dbUser) {
                        // Create new user if they don't exist
                        dbUser = await User.create({
                            name: user.name,
                            email: user.email,
                            avatar: user.image,
                            // Create a random secure password for OAuth users
                            password: Math.random().toString(36).slice(-16) + Math.random().toString(36).slice(-16),
                        });
                    }

                    // Update OAuth user's info if they already exist
                    else if (!dbUser.avatar && user.image) {
                        dbUser.avatar = user.image;
                        await dbUser.save();
                    }

                    return true;
                } catch (error) {
                    console.error("OAuth sign in error:", error);
                    return false;
                }
            }
            return true;
        },
    },
    pages: {
        signIn: "/", // Custom sign-in page
        error: "/", // Error page
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === "development",
};

export default NextAuth(authOptions);
