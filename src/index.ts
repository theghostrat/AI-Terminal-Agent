import { AIAgent } from './agent';

async function main() {
  const agent = new AIAgent();
  await agent.run();
}

main().catch(console.error);