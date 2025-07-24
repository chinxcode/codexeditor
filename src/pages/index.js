import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import LoginModal from "../components/LoginModal";
import SignupModal from "../components/SignupModal";
import CreateProjectModal from "../components/CreateProjectModal";
import FeatureCard from "../components/FeatureCard";
import CodeEditorPreview from "../components/CodeEditorPreview";
import { FiCode, FiShare2, FiZap, FiLayers, FiMonitor, FiArrowRight, FiLogOut, FiGithub, FiLinkedin } from "react-icons/fi";

export default function Home() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const isAuthenticated = status === "authenticated";
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    console.log("Session data:", session); // Debug log
    console.log("Session status:", status); // Debug log
    console.log("Is authenticated:", isAuthenticated); // Debug log

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isMenuOpen && !event.target.closest(`.${styles.navLinks}`) && !event.target.closest(`.${styles.menuToggle}`)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isMenuOpen]);

    // Prevent scrolling when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isMenuOpen]);

    const startNewEditor = () => {
        // Always allow users to create projects, authenticated or not
        setIsCreateModalOpen(true);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const openLoginModal = () => {
        setIsLoginModalOpen(true);
        setIsSignupModalOpen(false);
        closeMenu();
    };

    const closeLoginModal = () => {
        setIsLoginModalOpen(false);
    };

    const openSignupModal = () => {
        setIsSignupModalOpen(true);
        setIsLoginModalOpen(false);
        closeMenu();
    };

    const closeSignupModal = () => {
        setIsSignupModalOpen(false);
    };

    const switchToSignup = () => {
        setIsLoginModalOpen(false);
        setIsSignupModalOpen(true);
    };

    const switchToLogin = () => {
        setIsSignupModalOpen(false);
        setIsLoginModalOpen(true);
    };

    const handleLogout = async () => {
        await signOut({ redirect: false });
        router.push("/");
    };

    const closeCreateProjectModal = () => {
        setIsCreateModalOpen(false);
    };

    const isSmallScreen = typeof window !== "undefined" && window.innerWidth < 790;

    const handleResize = () => {
        if (isMenuOpen && window.innerWidth >= 1124) {
            setIsMenuOpen(false);
        }
    };
    useEffect(() => {
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [isMenuOpen]);

    // Features data for our cards
    const features = [
        {
            icon: <FiCode size={32} />,
            title: "Interactive Code Editor",
            description: "Write HTML, CSS, and JavaScript with syntax highlighting, auto-completion, and real-time error detection.",
        },
        {
            icon: <FiZap size={32} />,
            title: "AI-Powered Assistance",
            description: "Get intelligent code suggestions and answers to your programming questions directly within the editor.",
        },
        {
            icon: <FiMonitor size={32} />,
            title: "Live Preview",
            description: "See your changes instantly with a real-time preview that updates as you type.",
        },
        {
            icon: <FiShare2 size={32} />,
            title: "Easy Sharing",
            description: "Share your projects with others using a simple link. Choose between view-only or editable access.",
        },
    ];

    return (
        <div className={styles.container}>
            <Head>
                <title>CodeXeditor - Interactive Code Editor with AI Assistance</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
                <meta
                    name="description"
                    content="CodeXeditor is a modern code editor for HTML, CSS, and JavaScript with real-time preview, AI-powered code help, and easy sharing features."
                />
                <meta name="keywords" content="code editor, HTML, CSS, JavaScript, AI, coding assistant, web development, programming" />
                <meta name="google-site-verification" content="8oBCVUQA3NnZBCFuNIIBnKJ4leLbHUKTwL7X9LXAA4E" />
                <meta name="author" content="Sachin Sharma" />
                <meta property="og:title" content="CodeXeditor - Interactive Code Editor with AI Assistance" />
                <meta
                    property="og:description"
                    content="Build web projects with real-time preview and AI assistance. Perfect for learning and experimenting with HTML, CSS, and JavaScript."
                />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://codexeditor.vercel.app" />
                <meta property="og:image" content="/og-image.png" />
                <meta name="twitter:card" content="summary_large_image" />
                <link rel="icon" href="/favicon.ico" />
                <link rel="canonical" href="https://codexeditor.vercel.app" />
                <script defer src="https://cloud.umami.is/script.js" data-website-id="d7e18806-3d6f-4107-a5ba-9d8d4ea50644"></script>
            </Head>

            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <Link href="https://codexeditor.vercel.app" className={styles.logo}>
                        <FiCode size={24} />
                        <h1>CodeXeditor</h1>
                    </Link>

                    <div className={`${styles.navLinks} ${isMenuOpen ? styles.active : ""}`}>
                        <Link href="#features">Features</Link>
                        <Link href="#workflow">How It Works</Link>
                        <Link href="https://github.com/chinxcode/codexeditor" target="_blank">
                            GitHub
                        </Link>
                        <Link href="#about">About</Link>
                        {isAuthenticated && isSmallScreen && (
                            <button className={`${styles.logoutButton} ${styles.mobileOnly}`} onClick={handleLogout}>
                                <FiLogOut size={16} />
                                <span>Log Out</span>
                            </button>
                        )}
                    </div>

                    <div className={styles.authButtons}>
                        {isAuthenticated ? (
                            <div className={styles.userMenu}>
                                <Link href="/dashboard" className={styles.dashboardLink}>
                                    <FiLayers size={16} />
                                    <span>Dashboard</span>
                                </Link>
                                {!isSmallScreen && (
                                    <>
                                        {" "}
                                        <div className={styles.userProfile}>
                                            {session.user.image ? (
                                                <img src={session.user.image} alt={session.user.name} className={styles.userAvatar} />
                                            ) : (
                                                <div className={styles.userInitials}>{session.user.name?.charAt(0) || "U"}</div>
                                            )}
                                            <span className={styles.userName}>{session.user.name}</span>
                                        </div>
                                        <button className={styles.logoutButton} onClick={handleLogout}>
                                            <FiLogOut size={16} />
                                            <span>Log Out</span>
                                        </button>{" "}
                                    </>
                                )}
                            </div>
                        ) : (
                            <>
                                <button className={styles.loginButton} onClick={openLoginModal}>
                                    Login
                                </button>
                                <button className={styles.signupButton} onClick={openSignupModal}>
                                    Sign Up
                                </button>
                            </>
                        )}
                    </div>

                    <button className={styles.menuToggle} onClick={toggleMenu} aria-label="Toggle menu">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </header>

            {/* Hero Section */}
            <section className={styles.heroSection}>
                <div className={styles.heroContent}>
                    <div className={styles.heroText}>
                        <h1 className={styles.heroTitle}>
                            Build web projects with <span className={styles.highlight}>AI assistance</span>
                        </h1>
                        <p className={styles.heroDescription}>
                            CodeXeditor is a modern code editor for HTML, CSS, and JavaScript with real-time preview, AI-powered code help,
                            and easy sharing.
                        </p>
                        <div className={styles.heroButtons}>
                            <button onClick={startNewEditor} className={styles.primaryButton}>
                                Start Coding <FiArrowRight size={16} />
                            </button>
                            <a href="#features" className={styles.secondaryButton}>
                                Explore Features
                            </a>
                        </div>
                    </div>
                    <div className={styles.heroImage}>
                        <CodeEditorPreview />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className={styles.featuresSection}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Features</h2>
                    <p className={styles.sectionSubtitle}>Everything you need for web development</p>
                </div>

                <div className={styles.features}>
                    {features.map((feature, index) => (
                        <FeatureCard key={index} icon={feature.icon} title={feature.title} description={feature.description} />
                    ))}
                </div>
            </section>

            {/* How It Works Section */}
            <section id="workflow" className={styles.workflowSection}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>How It Works</h2>
                    <p className={styles.sectionSubtitle}>Simple, intuitive workflow</p>
                </div>

                <div className={styles.workflowSteps}>
                    <div className={styles.workflowStep}>
                        <div className={styles.stepNumber}>1</div>
                        <div className={styles.stepContent}>
                            <h3>Create a Project</h3>
                            <p>Start with a blank canvas and build your web project.</p>
                        </div>
                    </div>

                    <div className={styles.workflowStep}>
                        <div className={styles.stepNumber}>2</div>
                        <div className={styles.stepContent}>
                            <h3>Write Your Code</h3>
                            <p>Write HTML, CSS, and JavaScript with AI help when you need it.</p>
                        </div>
                    </div>

                    <div className={styles.workflowStep}>
                        <div className={styles.stepNumber}>3</div>
                        <div className={styles.stepContent}>
                            <h3>See Instant Preview</h3>
                            <p>View your changes in real-time as you code.</p>
                        </div>
                    </div>

                    <div className={styles.workflowStep}>
                        <div className={styles.stepNumber}>4</div>
                        <div className={styles.stepContent}>
                            <h3>Share Your Work</h3>
                            <p>Share your project with a simple link.</p>
                        </div>
                    </div>
                </div>

                <div className={styles.workflowActions}>
                    <button className={styles.primaryButton} onClick={startNewEditor}>
                        Get Started <FiArrowRight size={16} />
                    </button>
                </div>
            </section>

            {/* About Project Section */}
            <section id="about" className={styles.aboutSection}>
                <div className={styles.aboutContent}>
                    <h2>About This Project</h2>
                    <p>
                        CodeXeditor is an open-source practice project built with Next.js, MongoDB, and Google's Gemini AI. It demonstrates
                        modern web development practices and provides a useful tool for learning and experimentation.
                    </p>
                    <div className={styles.techStack}>
                        <div className={styles.techItem}>Next.js</div>
                        <div className={styles.techItem}>MongoDB</div>
                        <div className={styles.techItem}>NextAuth.js</div>
                        <div className={styles.techItem}>Gemini AI</div>
                        <div className={styles.techItem}>React</div>
                    </div>
                    <div className={styles.socialLinks}>
                        <a
                            href="https://github.com/chinxcode/codexeditor"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.githubLink}
                        >
                            <FiGithub size={16} />
                            <span>View on GitHub</span>
                        </a>
                        <a
                            href="https://www.linkedin.com/in/sachinxcode/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.githubLink}
                        >
                            <FiLinkedin size={16} />
                            <span>Connect on LinkedIn</span>
                        </a>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className={styles.footer}>
                <div className={styles.footerContent}>
                    <Link href="https://codexeditor.vercel.app" className={styles.footerLogo}>
                        <FiCode size={20} />
                        <span>CodeXeditor</span>
                    </Link>
                    <p>
                        Made with ❤️ by{" "}
                        <a href="https://github.com/chinxcode" target="_blank" rel="noopener noreferrer">
                            Sachin Sharma
                        </a>
                    </p>
                </div>
            </footer>

            {/* Modals */}
            <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} onSwitchToSignup={switchToSignup} />
            <SignupModal isOpen={isSignupModalOpen} onClose={closeSignupModal} onSwitchToLogin={switchToLogin} />
            <CreateProjectModal isOpen={isCreateModalOpen} onClose={closeCreateProjectModal} />
        </div>
    );
}
