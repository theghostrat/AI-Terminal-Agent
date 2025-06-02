"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const agent_1 = require("./agent");
async function main() {
    const agent = new agent_1.AIAgent();
    await agent.run();
}
main().catch(console.error);
