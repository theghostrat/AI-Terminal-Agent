# AI-Terminal-Agent

An intelligent AI agent designed to automate and streamline software development tasks directly from your terminal. This agent leverages powerful Large Language Models (LLMs) to understand complex instructions, break them down into actionable steps, and execute them with user permission at each stage.

## ✨ Features

- **Iterative Task Execution**: The agent continuously processes tasks, adapting its next steps based on previous action results.
- **User Permission Control**: Every action (file read/write, command execution) requires explicit user approval, ensuring transparency and control.
- **File System Operations**:
    - Read any file type with proper encoding detection.
    - Create, modify, and delete files and directories.
    - Apply code changes using unified diff format for precise edits.
    - Browse project structure and search for files and content.
- **Terminal Command Execution**: Execute shell commands in a persistent terminal and capture their output for AI context.
- **LLM Integration**: Easily switch between different LLMs (e.g., OpenAI, Google Gemini, OpenRouter) for diverse capabilities.
- **Auto-Approve Mode**: For experienced users or automated workflows, an optional auto-approve mode can bypass manual confirmations.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (Node Package Manager)
- A GitHub account (for repository creation and pushing code)
- An API key for your chosen LLM (e.g., Google Gemini API Key)

### Installation

1. **Clone the repository (or download the project files):**
   ```bash
   git clone https://github.com/theghostrat/AI-Terminal-Agent.git
   cd AI-Terminal-Agent
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure your LLM API Key:**
   Create a `.env` file in the root of the project and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   *(If you prefer OpenAI or OpenRouter, adjust `src/llm.ts` accordingly and set `OPENAI_API_KEY` or `OPENROUTER_API_KEY` in your `.env` file.)*

### Usage

To start the AI agent in interactive mode (requires permission for each action):

### Global Installation (Command-Line Tool)

To install the `ai-agent` globally and use it as a command-line tool from any directory:

1.  **Install the tool globally:**
    Navigate to the project root directory and run:
    ```bash
    npm link
    # You might need to use 'sudo npm link' on some systems.
    ```

2.  **Set your GEMINI_API_KEY as a system-wide environment variable:**

    *   **For Bash/Zsh (add to `~/.bashrc`, `~/.zshrc`, or `~/.profile`):**
        ```bash
        echo 'export GEMINI_API_KEY="your_gemini_api_key_here"' >> ~/.bashrc
        source ~/.bashrc # Or ~/.zshrc, ~/.profile
        ```
        Replace `your_gemini_api_key_here` with your actual API key.

    *   **For Fish (add to `~/.config/fish/config.fish`):**
        ```fish
        set -Ux GEMINI_API_KEY "your_gemini_api_key_here"
        ```
        Replace `your_gemini_api_key_here` with your actual API key.

3.  **Run the `ai-agent` command:**
    You can now run the `ai-agent` command from any directory:
    ```bash
    ai-agent
    ```
    To start in auto-approve mode:
    ```bash
    AUTO_APPROVE=true ai-agent
    ```

```bash
npm start
```

To start the AI agent in auto-approve mode (actions are automatically approved):

```bash
AUTO_APPROVE=true npm start
```

Once started, the agent will prompt you to describe a task.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues, pull requests, or suggest improvements.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Contact

For questions or support, please open an issue on the GitHub repository.