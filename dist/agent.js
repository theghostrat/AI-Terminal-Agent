"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIAgent = void 0;
const inquirer_1 = __importDefault(require("inquirer"));
const operations_1 = require("./operations");
const permission_1 = require("./permission");
const llm_1 = require("./llm"); // Import NextStep
class AIAgent {
    constructor() {
        this.llmClient = new llm_1.LLMClient();
        // Allow auto-approve mode via environment variable or config
        const autoApprove = process.env.AUTO_APPROVE === 'true';
        this.permissionHandler = new permission_1.PermissionHandler(autoApprove);
    }
    async run() {
        while (true) { // Keep running to accept new tasks
            console.log('\nAI Agent started. Describe your task:');
            const { task } = await inquirer_1.default.prompt([{
                    type: 'input',
                    name: 'task',
                    message: 'Task description:'
                }]);
            if (!task) {
                console.log('No task provided. Exiting.');
                break;
            }
            let completed = false;
            let previousActionResult = undefined;
            while (!completed) {
                const nextStep = await this.llmClient.determineNextStep(task, previousActionResult);
                if (nextStep.type === 'COMPLETE') {
                    console.log('Task completed successfully!');
                    completed = true;
                    continue;
                }
                const permission = await this.permissionHandler.requestPermission({
                    type: nextStep.type,
                    description: nextStep.description,
                    details: nextStep // Pass the entire nextStep as details
                });
                if (!permission) {
                    console.log('Action cancelled by user.');
                    continue;
                }
                try {
                    let result;
                    switch (nextStep.type) {
                        case 'READ_FILE':
                            if (nextStep.path) {
                                result = await (0, operations_1.readFile)(nextStep.path);
                            }
                            else {
                                throw new Error('Path is required for READ_FILE');
                            }
                            break;
                        case 'WRITE_FILE':
                            if (nextStep.path && nextStep.content !== undefined) {
                                result = await (0, operations_1.writeFile)(nextStep.path, nextStep.content);
                            }
                            else {
                                throw new Error('Path and content are required for WRITE_FILE');
                            }
                            break;
                        case 'APPLY_DIFF':
                            if (nextStep.path && nextStep.diff) {
                                result = await (0, operations_1.applyDiff)(nextStep.path, nextStep.diff);
                            }
                            else {
                                throw new Error('Path and diff are required for APPLY_DIFF');
                            }
                            break;
                        case 'EXECUTE_COMMAND':
                            if (nextStep.command) {
                                result = await (0, operations_1.executeCommand)(nextStep.command, nextStep.cwd);
                            }
                            else {
                                throw new Error('Command is required for EXECUTE_COMMAND');
                            }
                            break;
                        default:
                            throw new Error(`Unsupported action type: ${nextStep.type}`);
                    }
                    console.log('Action result:', result);
                    previousActionResult = typeof result === 'string' ? result : undefined; // Store the result for the next iteration
                }
                catch (error) {
                    console.error('Action failed:', error.message);
                    previousActionResult = `ERROR: ${error.message}`; // Store error for LLM to consider
                }
            } // Closes while (!completed)
        } // Closes while (true)
    } // Closes async run()
} // Closes export class AIAgent
exports.AIAgent = AIAgent;
