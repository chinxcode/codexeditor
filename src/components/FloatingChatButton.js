import { useState } from "react";
import { useSession } from "next-auth/react";
import ChatBot from "./ChatBot";

const FloatingChatButton = () => {
    const { data: session } = useSession();
    const [isChatOpen, setIsChatOpen] = useState(false);

    const toggleChat = () => {
        setIsChatOpen(!isChatOpen);
    };

    // Only show the chat button for authenticated users
    if (!session) return null;

    return (
        <div className="floating-chat-container">
            {isChatOpen && <ChatBot isOpen={isChatOpen} toggleChat={toggleChat} />}
            <button onClick={toggleChat} className="floating-chat-button" aria-label={isChatOpen ? "Close chat" : "Open chat"}>
                {isChatOpen ? "×" : "💻"}
            </button>
        </div>
    );
};

export default FloatingChatButton;
