import { Clarifier } from "../../domain/services/Clarifier.js";
import { bpasAI } from "../../ai/bpasAI.js";

export class BpasClarifier extends Clarifier {
  async clarify(rawText) {
    return bpasAI("clarify", rawText);
  }
}
