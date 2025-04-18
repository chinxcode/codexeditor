import { useState } from "react";
import { useSession } from "next-auth/react";
import ChatBot from "./ChatBot";
import { FiCode } from "react-icons/fi";

const AIChatButton = () => {
    const { data: session } = useSession();
    const [isChatOpen, setIsChatOpen] = useState(false);

    const toggleChat = () => {
        setIsChatOpen(!isChatOpen);
    };

    // Only show the chat button for authenticated users
    if (!session) return null;

    return (
        <>
            <button onClick={toggleChat} className="topbar-chat-button" title={isChatOpen ? "Close AI Assistant" : "Open AI Assistant"}>
                <FiCode size={16} />
                <span>AI Assistant</span>
            </button>

            {isChatOpen && <ChatBot isOpen={isChatOpen} toggleChat={toggleChat} />}
        </>
    );
};

export default AIChatButton;
