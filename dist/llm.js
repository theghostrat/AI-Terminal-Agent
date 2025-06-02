"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LLMClient = void 0;
const generative_ai_1 = require("@google/generative-ai"); // Import for Gemini
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // Load environment variables from .env file
class LLMClient {
    constructor() {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("GEMINI_API_KEY is not set in the .env file.");
        }
        this.genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
    }
    async determineNextStep(task, previousActionResult) {
        console.log(`LLM determining next step for task: "${task}"`);
        const model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-05-20" });
        let prompt = `You are an AI agent designed to help with software development tasks.
Your goal is to break down a complex task into a sequence of smaller, actionable steps.
For each step, you will determine the next logical action to take.
Your response should be a JSON object with 'type', 'description', and optional 'path', 'content', 'diff', 'command', or 'cwd' properties.

Action Types:
- 'READ_FILE': To read the content of a file. Requires 'path'.
- 'WRITE_FILE': To create or overwrite a file. Requires 'path' and 'content'.
- 'APPLY_DIFF': To apply a diff to a file. Requires 'path' and 'diff'.
- 'EXECUTE_COMMAND': To run a shell command. Requires 'command' and optional 'cwd'.
- 'COMPLETE': When the task is finished. No other properties needed.

Example for READ_FILE:
{ "type": "READ_FILE", "description": "Read the main application file", "path": "src/app.ts" }

Example for WRITE_FILE:
{ "type": "WRITE_FILE", "description": "Create a new utility file", "path": "src/utils/helpers.ts", "content": "export function greet() { return 'Hello'; }" }

Example for APPLY_DIFF:
{ "type": "APPLY_DIFF", "description": "Update a function in the main file", "path": "src/main.ts", "diff": "<<<<<<< SEARCH\\n:start_line:10\\n-------\\n  console.log('old');\\n=======\\n  console.log('new');\\n>>>>>>> REPLACE" }

Example for EXECUTE_COMMAND:
{ "type": "EXECUTE_COMMAND", "description": "Install dependencies", "command": "npm install" }

Example for COMPLETE:
{ "type": "COMPLETE", "description": "All tasks are done." }

Consider the overall task and the result of the previous action (if any) to determine the most appropriate next step.
Only use the 'COMPLETE' action type when the entire task is genuinely finished and no further actions are required.

`;
        if (previousActionResult) {
            prompt += `\nPrevious Action Result:\n\`\`\`\n${previousActionResult}\n\`\`\`\n`;
        }
        prompt += `\nTask: ${task}\n\nYour JSON response:`;
        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const responseContent = response.text();
            if (!responseContent) {
                throw new Error("LLM response was empty.");
            }
            // Extract JSON from markdown code block if present
            const jsonMatch = responseContent.match(/```json\n([\s\S]*?)\n```/);
            const rawJson = jsonMatch ? jsonMatch[1] : responseContent;
            const nextStep = JSON.parse(rawJson);
            return nextStep;
        }
        catch (error) {
            console.error("Error communicating with LLM:", error.message);
            // Fallback or error handling
            return {
                type: 'COMPLETE',
                description: `Failed to get next step from LLM: ${error.message}`
            };
        }
    }
}
exports.LLMClient = LLMClient;
