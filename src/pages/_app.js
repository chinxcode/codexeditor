import "../styles/globals.css";
import "../styles/chatbot.css";
import { SessionProvider } from "next-auth/react";
import { Analytics } from "@vercel/analytics/react";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
    return (
        <SessionProvider session={session}>
            <Component {...pageProps} />
            <Analytics />
        </SessionProvider>
    );
}

export default MyApp;
