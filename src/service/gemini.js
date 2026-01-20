import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!API_KEY) {
    console.warn("Warning: NEXT_PUBLIC_GEMINI_API_KEY is not defined. AI features will not work properly.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// Function to create a new chat session with coding-specific context
export const createChatSession = async (initialPrompt) => {
    try {
        const codingSystemPrompt = `You are CodeX Assistant - a specialized AI coding assistant.

GUIDELINES:
- Focus exclusively on programming and technical questions
- Always use markdown formatting for code (with language specified)
- Provide concise, accurate answers with code examples when helpful
- Offer explanations of coding concepts in simple terms
- Prioritize modern best practices
- Concentrate especially on HTML, CSS, and JavaScript solutions
- Provide practical, runnable code examples whenever possible
- If a non-programming question is asked, politely redirect to coding topics
- For debugging, ask for relevant code and context if not provided

CAPABILITIES:
- HTML, CSS, JavaScript expertise (primary focus)
- Responsive web design techniques
- Modern web development patterns
- UI/UX implementation advice
- Code explanation
- Debugging assistance
- Best practices recommendations
- Front-end framework guidance (React, Vue, etc.)
- Code generation for specific tasks

LIMITATIONS:
- Cannot execute code
- Cannot access databases or external systems
- Cannot access user repositories
- Cannot handle non-programming related questions`;

        const systemInstruction = initialPrompt || codingSystemPrompt;

        const chat = ai.chats.create({
            model: "gemini-3-flash-preview",
            config: {
                systemInstruction: systemInstruction,
                temperature: 1.0,
            },
            history: [
                {
                    role: "user",
                    parts: [{ text: "Hello" }],
                },
                {
                    role: "model",
                    parts: [
                        {
                            text: "I'm ready to help with your coding and development questions. What programming problem can I assist you with today?",
                        },
                    ],
                },
            ],
        });

        return chat;
    } catch (error) {
        console.error("Error creating chat session:", error);
        throw error;
    }
};

// Function to send a message to an existing chat session
export const sendMessage = async (chatSession, message) => {
    try {
        // If the message doesn't appear to be coding-related, add a reminder
        let enhancedMessage = message;
        if (!isCodingRelated(message)) {
            enhancedMessage = `${message}\n\nNote: Please remember I'm a coding assistant and can only help with programming and development topics.`;
        }

        const result = await chatSession.sendMessage({ message: enhancedMessage });
        return result.text;
    } catch (error) {
        console.error("Error sending message:", error);
        throw error;
    }
};

// Function for one-off prompts without maintaining a session
export const generateResponse = async (prompt) => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: {
                temperature: 1.0, // Keeping default temperature as recommended by Gemini API docs
            },
        });
        return response.text;
    } catch (error) {
        console.error("Error generating response:", error);
        throw error;
    }
};

// Helper function to check if a message appears to be coding related
function isCodingRelated(message) {
    const codingKeywords = [
        "code",
        "programming",
        "function",
        "variable",
        "class",
        "object",
        "method",
        "javascript",
        "python",
        "java",
        "c#",
        "ruby",
        "php",
        "typescript",
        "html",
        "css",
        "api",
        "backend",
        "frontend",
        "fullstack",
        "database",
        "sql",
        "mongodb",
        "react",
        "vue",
        "angular",
        "node",
        "express",
        "django",
        "flask",
        "spring",
        "error",
        "bug",
        "debug",
        "fix",
        "issue",
        "problem",
        "solution",
        "algorithm",
        "data structure",
        "array",
        "string",
        "object",
        "json",
        "git",
        "github",
        "version control",
        "deploy",
        "server",
        "client",
        "compile",
        "runtime",
        "syntax",
        "semantic",
        "framework",
        "library",
        "async",
        "promise",
        "callback",
        "function",
        "loop",
        "conditional",
        "rest",
        "graphql",
        "websocket",
        "http",
        "request",
        "response",
    ];

    const lowerCaseMessage = message.toLowerCase();
    return codingKeywords.some((keyword) => lowerCaseMessage.includes(keyword));
}

// Function to generate HTML, CSS, and JS code based on a prompt
export const generateCode = async (prompt) => {
    try {
        // Enhance the prompt to ensure we get structured code output
        const enhancedPrompt = `
Generate HTML, CSS, and JavaScript code based on the following request:
"${prompt}"

Please provide the code in the following format:
\`\`\`html
<!-- HTML code here -->
\`\`\`

\`\`\`css
/* CSS code here */
\`\`\`

\`\`\`javascript
// JavaScript code here
\`\`\`

Make sure the code is complete, functional, and follows best practices. The HTML, CSS, and JavaScript should work together to create the requested feature or design.
`;

        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: enhancedPrompt,
            config: {
                temperature: 1.0, // Keeping default temperature as recommended by Gemini API docs
            },
        });

        const responseText = response.text;

        // Parse the response to extract HTML, CSS, and JS code
        const htmlMatch = responseText.match(/```html\s*([\s\S]*?)\s*```/);
        const cssMatch = responseText.match(/```css\s*([\s\S]*?)\s*```/);
        const jsMatch = responseText.match(/```javascript\s*([\s\S]*?)\s*```/);

        return {
            html: htmlMatch ? htmlMatch[1].trim() : "",
            css: cssMatch ? cssMatch[1].trim() : "",
            js: jsMatch ? jsMatch[1].trim() : "",
            fullResponse: responseText,
        };
    } catch (error) {
        console.error("Error generating code:", error);
        throw error;
    }
};

// Function to determine if a message is a question or a code generation request
export const isCodeGenerationRequest = (message) => {
    const generationPhrases = [
        "create",
        "generate",
        "make",
        "build",
        "develop",
        "code",
        "implement",
        "write code",
        "write html",
        "write css",
        "write javascript",
        "create a website",
        "create a page",
        "build a component",
        "create a function",
        "make a button",
        "generate a form",
        "create a layout",
        "build a navbar",
        "make a slider",
        "create a gallery",
        "implement a feature",
    ];

    const lowerCaseMessage = message.toLowerCase();
    return generationPhrases.some((phrase) => lowerCaseMessage.includes(phrase));
};

export default {
    createChatSession,
    sendMessage,
    generateResponse,
    generateCode,
    isCodeGenerationRequest,
};
