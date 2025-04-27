import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import ChatBot from "./ChatBot";
import { FiCode } from "react-icons/fi";

const AIChatButton = ({ onCodeGenerated }) => {
    const { data: session } = useSession();
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);

    const toggleChat = () => {
        if (!session) {
            // If not logged in, show login modal instead
            signIn();
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
        </>
    );
};

export default AIChatButton;
