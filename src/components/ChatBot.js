import { useState, useEffect, useRef } from "react";
import { createChatSession, sendMessage } from "../service/gemini";
import ReactMarkdown from "react-markdown";
import { FiCopy, FiCheck } from "react-icons/fi";

const ChatBot = ({ isOpen, toggleChat }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [chatSession, setChatSession] = useState(null);
    const [sessionId, setSessionId] = useState(null);
    const messagesEndRef = useRef(null);
    
    // Copy button state for code blocks
    const [copiedCode, setCopiedCode] = useState(null);

    // Initialize from sessionStorage or create new chat
    useEffect(() => {
        const loadExistingSession = () => {
            try {
                const storedSessionId = sessionStorage.getItem('chatSessionId');
                const storedMessages = JSON.parse(sessionStorage.getItem('chatMessages') || '[]');
                
                if (storedMessages.length > 0) {
                    setMessages(storedMessages);
                    setSessionId(storedSessionId);
                    // We'll recreate the session on first message if needed
                    return true;
                }
            } catch (error) {
                console.error("Error loading chat from session storage:", error);
            }
            return false;
        };
        
        const initChat = async () => {
            // Try to load existing session first
            if (loadExistingSession()) return;
            
            try {
                // Create a coding-focused initial prompt with HTML/CSS/JS focus
                const codingPrompt = `You are CodeX Assistant, a specialized AI designed to help with programming and development tasks only.
                
- Focus exclusively on coding, programming, and technical questions
- Provide clear, concise code examples when relevant
- Prioritize HTML, CSS, and JavaScript examples and solutions
- Explain technical concepts in a straightforward manner
- Do not respond to non-programming related questions
- Use markdown formatting for code blocks and explanations
- Always specify the language in code blocks (e.g. \`\`\`html, \`\`\`css, \`\`\`javascript)
- If a question is not related to software development, politely redirect to coding topics`;

                const chat = await createChatSession(codingPrompt);
                const newSessionId = 'chat_' + Date.now();
                setChatSession(chat);
                setSessionId(newSessionId);
                
                const initialMessages = [
                    {
                        role: "bot",
                        content:
                            "👋 I'm your coding assistant. Ask me about HTML, CSS, JavaScript, or any programming questions. I'll only respond to software development-related topics.",
                    },
                ];
                
                setMessages(initialMessages);
                
                // Save to sessionStorage
                sessionStorage.setItem('chatSessionId', newSessionId);
                sessionStorage.setItem('chatMessages', JSON.stringify(initialMessages));
            } catch (error) {
                console.error("Error initializing chat:", error);
            }
        };

        if (isOpen) {
            initChat();
        }
    }, [isOpen]);

    // Auto-scroll to bottom of messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);
    
    // Save messages to sessionStorage when they change
    useEffect(() => {
        if (messages.length > 0) {
            sessionStorage.setItem('chatMessages', JSON.stringify(messages));
        }
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = input.trim();
        setInput("");
        
        // Update messages with user input
        const updatedMessages = [...messages, { role: "user", content: userMessage }];
        setMessages(updatedMessages);
        sessionStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
        
        setIsLoading(true);

        try {
            // If we don't have an active session, create one
            if (!chatSession) {
                const codingPrompt = `You are CodeX Assistant, a specialized AI designed to help with programming and development tasks only.
                
- Focus exclusively on coding, programming, and technical questions
- Provide clear, concise code examples when relevant
- Prioritize HTML, CSS, and JavaScript examples and solutions
- Explain technical concepts in a straightforward manner
- Do not respond to non-programming related questions
- Use markdown formatting for code blocks and explanations
- Always specify the language in code blocks (e.g. \`\`\`html, \`\`\`css, \`\`\`javascript)
- If a question is not related to software development, politely redirect to coding topics

User message history:
${messages.map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`).join('\n')}`;

                const newChat = await createChatSession(codingPrompt);
                setChatSession(newChat);
                
                // Now send the actual message
                const botResponse = await sendMessage(newChat, userMessage);
                const finalMessages = [...updatedMessages, { role: "bot", content: botResponse }];
                setMessages(finalMessages);
                sessionStorage.setItem('chatMessages', JSON.stringify(finalMessages));
            } else {
                // Use existing session
                const botResponse = await sendMessage(chatSession, userMessage);
                const finalMessages = [...updatedMessages, { role: "bot", content: botResponse }];
                setMessages(finalMessages);
                sessionStorage.setItem('chatMessages', JSON.stringify(finalMessages));
            }
        } catch (error) {
            console.error("Error sending message:", error);
            const errorMessages = [
                ...updatedMessages,
                {
                    role: "bot",
                    content: "Sorry, I encountered an error. Please try again with your coding question.",
                },
            ];
            setMessages(errorMessages);
            sessionStorage.setItem('chatMessages', JSON.stringify(errorMessages));
        } finally {
            setIsLoading(false);
        }
    };
    
    const copyToClipboard = (text, index) => {
        navigator.clipboard.writeText(text);
        setCopiedCode(index);
        setTimeout(() => setCopiedCode(null), 2000);
    };
    
    // Custom renderer for code blocks to add copy button
    const renderers = {
        code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const codeString = String(children).replace(/\n$/, '');
            
            if (!inline && match) {
                const language = match[1];
                const codeId = `code-${props.key || Math.random().toString(36).substring(7)}`;
                
                return (
                    <div className="code-block-wrapper">
                        <div className="code-header">
                            <span className="code-language">{language}</span>
                            <button 
                                className="copy-button" 
                                onClick={() => copyToClipboard(codeString, codeId)}
                                aria-label="Copy code"
                            >
                                {copiedCode === codeId ? <FiCheck size={14} /> : <FiCopy size={14} />}
                                {copiedCode === codeId ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                        <pre className={className} {...props}>
                            <code>{children}</code>
                        </pre>
                    </div>
                );
            }
            
            return inline ? (
                <code className={className} {...props}>
                    {children}
                </code>
            ) : (
                <pre className={className} {...props}>
                    <code>{children}</code>
                </pre>
            );
        }
    };

    if (!isOpen) return null;

    return (
        <div className="chatbot-container">
            <div className="chatbot-header">
                <h3>CodeX Code Assistant</h3>
                <button onClick={toggleChat} className="close-button">
                    ×
                </button>
            </div>
            <div className="messages-container">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.role}`}>
                        {msg.role === "bot" ? (
                            <ReactMarkdown 
                                className="markdown-content" 
                                components={renderers}
                            >
                                {msg.content}
                            </ReactMarkdown>
                        ) : (
                            msg.content
                        )}
                    </div>
                ))}
                {isLoading && <div className="message bot loading">Coding response...</div>}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="input-container">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask me a coding question..."
                    disabled={isLoading}
                />
                <button type="submit" disabled={isLoading || !input.trim()}>
                    Send
                </button>
            </form>
        </div>
    );
};

export default ChatBot;
