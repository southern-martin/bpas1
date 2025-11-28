// testAI.js
// Run: node testAI.js

import { bpasAI } from "./src/ai/bpasAI.js";

async function runTests() {
  console.log("BPAS AI Test Starting...\n");

  // Test Clarify
  const clarifyTest = await bpasAI(
    "clarify",
    "uh remind John about that thing for Friday maybe"
  );
  console.log("Clarify Output:", clarifyTest, "\n");

  // Test Summarize
  const summarizeTest = await bpasAI(
    "summarize",
    "We talked to Tim and he said the part may be late but he's not sure so he will check."
  );
  console.log("Summarize Output:", summarizeTest, "\n");

  // Test Prefill
  const prefillTest = await bpasAI(
    "prefill",
    "We need to finish the Johnson kitchen job by Monday and Sarah is waiting for the tile order."
  );
  console.log("Prefill Output:", prefillTest, "\n");

  console.log("BPAS AI Test Complete.");
}

runTests();
