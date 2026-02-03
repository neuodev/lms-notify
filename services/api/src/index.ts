import express from "express";
import { WhatsApp } from "@/lib/whatsapp/index.js";

const app = express();
app.use(express.json());

const wa = new WhatsApp();
await wa.withStore("memory");
wa.connect();

async function main() {
  app.get("/status", (_, res) => {
    if (wa.connection === "open") {
      return res.json({ authenticated: true });
    }

    res.json({
      authenticated: false,
      qr: wa.qr,
    });
  });

  app.post("/send-bulk", async (req, res) => {
    const { numbers, message } = req.body;

    if (wa.connection !== "open") {
      return res.status(401).json({ error: "WhatsApp not authenticated" });
    }

    const results = [];
    for (const number of numbers) {
      try {
        const jid = wa.asWhatsAppId(number);
        await wa.sendMessage(jid, { text: message });
        results.push({ number, status: "sent" });
      } catch (err) {
        if (err instanceof Error) {
          results.push({ number, status: "failed", error: err.message });
        } else {
          console.log(err);
          results.push({
            number,
            status: "failed",
            error: "Something wrong has happened",
          });
        }
      }
    }

    res.json({ results });
  });

  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
}

main().catch((error) => {
  console.error("Error:", error);
});
