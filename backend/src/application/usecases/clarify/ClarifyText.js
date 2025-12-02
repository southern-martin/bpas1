export class ClarifyText {
  constructor(clarifier) {
    this.clarifier = clarifier;
  }

  async execute(rawText) {
    if (!rawText) {
      const err = new Error("raw_text is required");
      err.status = 400;
      throw err;
    }
    return this.clarifier.clarify(rawText);
  }
}
