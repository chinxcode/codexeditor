# CodeXeditor - Interactive Code Editor with AI Assistance

CodeXeditor is a modern, web-based code editor for HTML, CSS, and JavaScript with real-time preview, AI-powered code assistance, and easy project sharing. Built with Next.js, MongoDB, and Google's Gemini AI, it provides a seamless environment for learning, experimenting, and building web projects.

## 🚀 Features

-   **Interactive Code Editor**: Write HTML, CSS, and JavaScript with syntax highlighting, auto-completion, and real-time error detection.
-   **Live Preview**: See your changes instantly with a real-time preview that updates as you type.
-   **AI-Powered Assistance**: Get intelligent code suggestions and answers to your programming questions directly within the editor.
-   **Project Management**: Create, organize, and manage multiple coding projects.
-   **Easy Sharing**: Share your projects with others using simple view-only or editable access links.
-   **User Authentication**: Secure account creation and login with email, GitHub, or Google.
-   **Responsive Design**: Works seamlessly across desktop and mobile devices.
-   **Auto-Save**: Never lose your work with automatic saving functionality.

## 🔍 How It Works

1. **Create a Project**: Start with a blank canvas and build your web project.
2. **Write Your Code**: Write HTML, CSS, and JavaScript with AI help when you need it.
3. **See Instant Preview**: View your changes in real-time as you code.
4. **Share Your Work**: Share your project with a simple link.

## 🛠️ Tech Stack

-   **Frontend**: Next.js, React, CSS Modules
-   **Backend**: Next.js API Routes
-   **Database**: MongoDB with Mongoose
-   **Authentication**: NextAuth.js with multiple providers (Email, GitHub, Google)
-   **AI Integration**: Google's Gemini AI for intelligent code assistance
-   **Deployment**: Vercel

## 🧑‍💻 For Developers

### Prerequisites

-   Node.js (v14+ recommended)
-   MongoDB instance (local or Atlas)
-   Google AI API key (for Gemini integration)

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# Gemini AI API
GOOGLE_AI_API_KEY=your_gemini_api_key
```

### Installation

1. Clone the repository:

    ```
    git clone https://github.com/chinxcode/code-editor.git
    cd code-editor
    ```

2. Install dependencies:

    ```
    npm install
    ```

3. Run the development server:

    ```
    npm run dev
    ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Project Structure

-   `/src/components`: React components
-   `/src/models`: MongoDB schema models
-   `/src/pages`: Next.js pages and API routes
-   `/src/service`: External API service integrations (Gemini)
-   `/src/styles`: CSS modules for styling
-   `/src/utils`: Utility functions

### Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📧 Contact

Connect with me on [LinkedIn](https://linkedin.com/in/sachinxcode)
For questions or feedback, please reach out to [sachinxcode@gmail.com](mailto:sachinxcode@gmail.com) or open an issue on GitHub.

---

Made with ❤️ by [Sachin Sharma](https://github.com/chinxcode)
