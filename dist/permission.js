"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionHandler = void 0;
const inquirer_1 = __importDefault(require("inquirer"));
class PermissionHandler {
    constructor(autoApprove = false) {
        this.autoApprove = autoApprove;
    }
    async requestPermission(request) {
        if (this.autoApprove) {
            console.log(`Auto-approving action: ${request.description}`);
            return true;
        }
        const { type, description, details } = request;
        const message = this.formatRequestMessage(type, description, details);
        const { confirm } = await inquirer_1.default.prompt([{
                type: 'confirm',
                name: 'confirm',
                message: `${message}\nProceed with this action?`,
                default: false
            }]);
        return confirm;
    }
    formatRequestMessage(type, description, details) {
        let message = `Action: ${description}`;
        switch (type) {
            case 'READ_FILE':
                message += `\nFile Path: ${details.path}`;
                break;
            case 'WRITE_FILE':
                message += `\nFile Path: ${details.path}\nContent Length: ${details.contentLength} characters`;
                break;
            case 'APPLY_DIFF':
                message += `\nFile Path: ${details.path}\nDiff: ${details.diffSummary}`;
                break;
            case 'EXECUTE_COMMAND':
                message += `\nCommand: ${details.command}`;
                if (details.cwd)
                    message += `\nWorking Directory: ${details.cwd}`;
                break;
        }
        return message;
    }
}
exports.PermissionHandler = PermissionHandler;
