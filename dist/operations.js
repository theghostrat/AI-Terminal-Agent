"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readFile = readFile;
exports.writeFile = writeFile;
exports.applyDiff = applyDiff;
exports.executeCommand = executeCommand;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const child_process_1 = require("child_process");
const util_1 = require("util");
const diff = __importStar(require("diff"));
const execAsync = (0, util_1.promisify)(child_process_1.exec);
const readFileAsync = (0, util_1.promisify)(fs_1.default.readFile);
const writeFileAsync = (0, util_1.promisify)(fs_1.default.writeFile);
const mkdirAsync = (0, util_1.promisify)(fs_1.default.mkdir);
async function readFile(filePath) {
    try {
        return await readFileAsync(filePath, 'utf8');
    }
    catch (error) { // Explicitly type error as any
        throw new Error(`Error reading file: ${error.message}`);
    }
}
async function writeFile(filePath, content) {
    try {
        const dir = path_1.default.dirname(filePath);
        await mkdirAsync(dir, { recursive: true });
        await writeFileAsync(filePath, content, 'utf8');
        return;
    }
    catch (error) { // Explicitly type error as any
        throw new Error(`Error writing file: ${error.message}`);
    }
}
async function applyDiff(filePath, diffString) {
    try {
        const currentContent = await readFile(filePath);
        const patchedContent = diff.applyPatch(currentContent, diffString);
        if (patchedContent === false) {
            throw new Error('Failed to apply diff');
        }
        await writeFile(filePath, patchedContent);
        return;
    }
    catch (error) { // Explicitly type error as any
        throw new Error(`Error applying diff: ${error.message}`);
    }
}
async function executeCommand(command, cwd = process.cwd()) {
    try {
        const { stdout, stderr } = await execAsync(command, { cwd });
        if (stderr) {
            console.error('Command stderr:', stderr);
        }
        return stdout;
    }
    catch (error) { // Explicitly type error as any
        throw new Error(`Command failed: ${error.message}`);
    }
}
