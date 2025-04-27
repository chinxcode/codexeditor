import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { FiCheck, FiX, FiEye } from "react-icons/fi";
import styles from "./CodeGenerationModal.module.css";

const CodeGenerationModal = ({ 
    isOpen, 
    onClose, 
    generatedCode, 
    onAccept, 
    isLoading 
}) => {
    const [previewOpen, setPreviewOpen] = useState(false);

    if (!isOpen) return null;

    const { html, css, js, fullResponse } = generatedCode || { html: "", css: "", js: "", fullResponse: "" };

    const handleAccept = () => {
        onAccept(generatedCode);
        onClose();
    };

    const togglePreview = () => {
        setPreviewOpen(!previewOpen);
    };

    const generatePreviewOutput = () => {
        return `
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Code Preview</title>
                    <style>${css}</style>
                </head>
                <body>
                    ${html}
                    <script>${js}</script>
                </body>
            </html>
        `;
    };

    const openPreview = () => {
        const output = generatePreviewOutput();
        const previewWindow = window.open("", "_blank");
        previewWindow.document.write(output);
        previewWindow.document.close();
    };

    // Custom renderer for code blocks
    const renderers = {
        code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const codeString = String(children).replace(/\n$/, '');
            
            if (!inline && match) {
                const language = match[1];
                
                return (
                    <div className={styles.codeBlockWrapper}>
                        <div className={styles.codeHeader}>
                            <span className={styles.codeLanguage}>{language}</span>
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

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <div className={styles.modalHeader}>
                    <h3>AI Generated Code</h3>
                    <div className={styles.modalControls}>
                        <button 
                            className={styles.previewButton} 
                            onClick={openPreview}
                            title="Preview in new window"
                        >
                            <FiEye size={16} />
                            <span>Preview</span>
                        </button>
                        <button 
                            className={styles.closeButton} 
                            onClick={onClose}
                            title="Close"
                        >
                            <FiX size={20} />
                        </button>
                    </div>
                </div>
                
                <div className={styles.modalContent}>
                    {isLoading ? (
                        <div className={styles.loadingContainer}>
                            <div className={styles.loader}></div>
                            <p>Generating code...</p>
                        </div>
                    ) : (
                        <>
                            <div className={styles.codePreview}>
                                <div className={styles.tabContainer}>
                                    <div className={styles.tab}>HTML</div>
                                    <div className={styles.tab}>CSS</div>
                                    <div className={styles.tab}>JavaScript</div>
                                </div>
                                <div className={styles.codeContainer}>
                                    <ReactMarkdown 
                                        className={styles.markdownContent} 
                                        components={renderers}
                                    >
                                        {`\`\`\`html\n${html}\n\`\`\`\n\n\`\`\`css\n${css}\n\`\`\`\n\n\`\`\`javascript\n${js}\n\`\`\``}
                                    </ReactMarkdown>
                                </div>
                            </div>
                            
                            <div className={styles.actionButtons}>
                                <button 
                                    className={styles.rejectButton} 
                                    onClick={onClose}
                                >
                                    <FiX size={16} />
                                    <span>Reject</span>
                                </button>
                                <button 
                                    className={styles.acceptButton} 
                                    onClick={handleAccept}
                                >
                                    <FiCheck size={16} />
                                    <span>Accept & Insert</span>
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CodeGenerationModal;
