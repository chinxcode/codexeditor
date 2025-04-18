import { useState } from "react";
import { signIn } from "next-auth/react";
import { FiX, FiMail, FiLock } from "react-icons/fi";
import styles from "../styles/Modal.module.css";

export default function LoginModal({ isOpen, onClose, onSwitchToSignup }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const result = await signIn("credentials", {
                redirect: false,
                email,
                password,
            });

            if (result.error) {
                setError(result.error);
                setIsLoading(false);
            } else {
                // Successful login, modal will be closed by parent component
                onClose();
                // Force page refresh to update session state
                window.location.reload();
            }
        } catch (error) {
            setError("An error occurred. Please try again.");
            console.error("Login error:", error);
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h3>Log In</h3>
                    <button className={styles.closeButton} onClick={onClose}>
                        <FiX size={20} />
                    </button>
                </div>
                <div className={styles.modalContent}>
                    <form onSubmit={handleSubmit}>
                        {error && <div className={styles.errorMessage}>{error}</div>}

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
                                    placeholder="Enter your password"
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className={styles.submitButton} disabled={isLoading}>
                            {isLoading ? "Logging in..." : "Log In"}
                        </button>
                    </form>

                    <div className={styles.modalFooter}>
                        <p>
                            Don't have an account?{" "}
                            <button className={styles.switchButton} onClick={onSwitchToSignup}>
                                Sign Up
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
