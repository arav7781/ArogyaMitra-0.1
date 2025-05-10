import Groq from "groq-sdk"

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { conversation } = req.body
    try {
      const messages = [
        {
          role: "system",
          content: "You are a helpful assistant that summarizes conversations. Please provide a concise summary of the following conversation:",
        },
        {
          role: "user",
          content: conversation,
        },
      ]

      const chatCompletion = await groq.chat.completions.create({
        messages,
        model: "llama-3.3-70b-versatile",
        temperature: 0.5,
        max_completion_tokens: 1024,
        top_p: 1,
        stop: null,
        stream: false,
      })

      const summary = chatCompletion.choices[0]?.message?.content || ""
      res.status(200).json({ summary })
    } catch (error) {
      console.error("Error generating summary:", error)
      res.status(500).json({ error: "Failed to generate summary" })
    }
  } else {
    res.setHeader("Allow", ["POST"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}