export class ClarifyController {
  constructor({ clarifyText }) {
    this.clarifyTextUseCase = clarifyText;
  }

  handleClarify = async (req, res) => {
    try {
      const { raw_text } = req.body;
      const clarified = await this.clarifyTextUseCase.execute(raw_text);
      res.json({ clarified_text: clarified });
    } catch (err) {
      const status = err.status || 500;
      if (!err.status) console.error("Clarify error:", err);
      res.status(status).json({ error: err.message || "Clarify failed" });
    }
  };
}
