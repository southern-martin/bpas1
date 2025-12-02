export class AiCardController {
  constructor({ prefillCard }) {
    this.prefillCardUseCase = prefillCard;
  }

  prefillCard = async (req, res) => {
    try {
      const { text } = req.body;
      const result = await this.prefillCardUseCase.execute(text);
      res.json(result);
    } catch (err) {
      const status = err.status || 500;
      if (!err.status) console.error("AI prefill error:", err);
      res.status(status).json({ error: err.message || "AI prefill failed", raw: err.raw });
    }
  };
}
