import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as diff from 'diff';

const execAsync = promisify(exec);
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const mkdirAsync = promisify(fs.mkdir);

export async function readFile(filePath: string): Promise<string> {
  try {
    return await readFileAsync(filePath, 'utf8');
  } catch (error: any) { // Explicitly type error as any
    throw new Error(`Error reading file: ${error.message}`);
  }
}

export async function writeFile(filePath: string, content: string): Promise<void> {
  try {
    const dir = path.dirname(filePath);
    await mkdirAsync(dir, { recursive: true });
    await writeFileAsync(filePath, content, 'utf8');
    return;
  } catch (error: any) { // Explicitly type error as any
    throw new Error(`Error writing file: ${error.message}`);
  }
}

export async function applyDiff(filePath: string, diffString: string): Promise<void> {
  try {
    const currentContent = await readFile(filePath);
    const patchedContent = diff.applyPatch(currentContent, diffString);
    
    if (patchedContent === false) {
      throw new Error('Failed to apply diff');
    }
    
    await writeFile(filePath, patchedContent);
    return;
  } catch (error: any) { // Explicitly type error as any
    throw new Error(`Error applying diff: ${error.message}`);
  }
}

export async function executeCommand(command: string, cwd: string = process.cwd()): Promise<string> {
  try {
    const { stdout, stderr } = await execAsync(command, { cwd });
    if (stderr) {
      console.error('Command stderr:', stderr);
    }
    return stdout;
  } catch (error: any) { // Explicitly type error as any
    throw new Error(`Command failed: ${error.message}`);
  }
}