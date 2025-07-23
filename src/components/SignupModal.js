import { useState } from "react";
import axios from "axios";
import { signIn } from "next-auth/react";
import { FiX, FiMail, FiLock, FiUser } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import styles from "../styles/Modal.module.css";

export default function SignupModal({ isOpen, onClose, onSwitchToLogin }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const handleGoogleSignIn = async () => {
        setGoogleLoading(true);
        setError("");
        try {
            await signIn("google", {
                callbackUrl: window.location.href,
            });
        } catch (error) {
            console.error("Google sign in error:", error);
            setError("Failed to sign in with Google");
            setGoogleLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        // Basic validation
        if (password !== confirmPassword) {
            setError("Passwords don't match");
            setIsLoading(false);
            return;
        }

        try {
            // Register the user
            await axios.post("/api/auth/register", {
                name,
                email,
                password,
                confirmPassword,
            });

            // Auto login after successful registration
            const result = await signIn("credentials", {
                redirect: false,
                email,
                password,
            });

            if (result.error) {
                setError("Error signing in after registration");
                setIsLoading(false);
            } else {
                // Successful registration and login
                onClose();
            }
        } catch (error) {
            if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else {
                setError("An error occurred during registration. Please try again.");
            }
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h3>Sign Up</h3>
                    <button className={styles.closeButton} onClick={onClose}>
                        <FiX size={20} />
                    </button>
                </div>
                <div className={styles.modalContent}>
                    <button
                        className={styles.googleButton}
                        onClick={handleGoogleSignIn}
                        disabled={googleLoading || isLoading}
                        type="button"
                    >
                        <FcGoogle size={20} />
                        {googleLoading ? "Signing in..." : "Continue with Google"}
                    </button>

                    <div className={styles.divider}>
                        <span>or</span>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {error && <div className={styles.errorMessage}>{error}</div>}

                        <div className={styles.formGroup}>
                            <label htmlFor="name">Name</label>
                            <div className={styles.inputWithIcon}>
                                <FiUser className={styles.inputIcon} />
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter your name"
                                    required
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="email">Email</label>
                            <div className={styles.inputWithIcon}>
                                <FiMail className={styles.inputIcon} />
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="password">Password</label>
                            <div className={styles.inputWithIcon}>
                                <FiLock className={styles.inputIcon} />
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Create a password"
                                    required
                                    minLength="8"
                                />
                            </div>
                            <small className={styles.passwordHint}>Password must be at least 8 characters long</small>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <div className={styles.inputWithIcon}>
                                <FiLock className={styles.inputIcon} />
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm your password"
                                    required
                                    minLength="8"
                                />
                            </div>
                        </div>

                        <button type="submit" className={styles.submitButton} disabled={isLoading}>
                            {isLoading ? "Creating account..." : "Sign Up"}
                        </button>
                    </form>

                    <div className={styles.modalFooter}>
                        <p>
                            Already have an account?{" "}
                            <button className={styles.switchButton} onClick={onSwitchToLogin}>
                                Log In
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
