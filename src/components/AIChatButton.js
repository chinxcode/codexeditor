import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import ChatBot from "./ChatBot";
import { FiCode } from "react-icons/fi";
import LoginModal from "../components/LoginModal";
import SignupModal from "../components/SignupModal";

const AIChatButton = ({ onCodeGenerated }) => {
    const { data: session } = useSession();
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

    const openLoginModal = () => {
        setIsLoginModalOpen(true);
        setIsSignupModalOpen(false);
    };

    const closeLoginModal = () => {
        setIsLoginModalOpen(false);
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

    const toggleChat = () => {
        if (!session) {
            // If not logged in, show login modal instead
            // signIn();
            openLoginModal();
        } else {
            setIsChatOpen(!isChatOpen);
        }
    };

    // Handle code generated from the AI
    const handleCodeGenerated = (code) => {
        if (onCodeGenerated) {
            onCodeGenerated(code);
        }
    };

    return (
        <>
            <button
                onClick={toggleChat}
                className="topbar-chat-button"
                title={session ? (isChatOpen ? "Close AI Assistant" : "Open AI Assistant") : "Login to use AI Assistant"}
            >
                <FiCode size={16} />
                <span>AI Assistant</span>
            </button>

            {session && isChatOpen && <ChatBot isOpen={isChatOpen} toggleChat={toggleChat} onCodeGenerated={handleCodeGenerated} />}

            <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} onSwitchToSignup={switchToSignup} />
            <SignupModal isOpen={isSignupModalOpen} onClose={closeSignupModal} onSwitchToLogin={switchToLogin} />
        </>
    );
};

export default AIChatButton;
