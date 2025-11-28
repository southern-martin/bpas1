import { bpasAI } from "./src/ai/bpasAI.js";

async function main() {
  const output = await bpasAI("clarify", "uh okay maybe tomorrow we fix the kitchen wire problem");
  console.log("Clarified:", output);
}

main();
