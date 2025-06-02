import inquirer from 'inquirer';
import { readFile, writeFile, applyDiff, executeCommand } from './operations';
import { PermissionHandler } from './permission';
import { LLMClient, NextStep } from './llm'; // Import NextStep

export class AIAgent {
  private permissionHandler: PermissionHandler;
  private llmClient = new LLMClient();

  constructor() {
    // Allow auto-approve mode via environment variable or config
    const autoApprove = process.env.AUTO_APPROVE === 'true';
    this.permissionHandler = new PermissionHandler(autoApprove);
  }

  async run() {
    while (true) { // Keep running to accept new tasks
      console.log('\nAI Agent started. Describe your task:');
      const { task } = await inquirer.prompt([{
        type: 'input',
        name: 'task',
        message: 'Task description:'
      }]);

      if (!task) {
        console.log('No task provided. Exiting.');
        break;
      }

      let completed = false;
      let previousActionResult: string | undefined = undefined;

      while (!completed) {
        const nextStep: NextStep = await this.llmClient.determineNextStep(task, previousActionResult);
        
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
                result = await readFile(nextStep.path);
              } else {
                throw new Error('Path is required for READ_FILE');
              }
              break;
            case 'WRITE_FILE':
              if (nextStep.path && nextStep.content !== undefined) {
                result = await writeFile(nextStep.path, nextStep.content);
              } else {
                throw new Error('Path and content are required for WRITE_FILE');
              }
              break;
            case 'APPLY_DIFF':
              if (nextStep.path && nextStep.diff) {
                result = await applyDiff(nextStep.path, nextStep.diff);
              } else {
                throw new Error('Path and diff are required for APPLY_DIFF');
              }
              break;
            case 'EXECUTE_COMMAND':
              if (nextStep.command) {
                result = await executeCommand(nextStep.command, nextStep.cwd);
              } else {
                throw new Error('Command is required for EXECUTE_COMMAND');
              }
              break;
            default:
              throw new Error(`Unsupported action type: ${nextStep.type}`);
          }

          console.log('Action result:', result);
          previousActionResult = typeof result === 'string' ? result : undefined; // Store the result for the next iteration
        } catch (error: any) {
          console.error('Action failed:', error.message);
          previousActionResult = `ERROR: ${error.message}`; // Store error for LLM to consider
        }
      } // Closes while (!completed)
    } // Closes while (true)
  } // Closes async run()
} // Closes export class AIAgent