import express from "express";
import { WhatsApp } from "@/lib/whatsapp/index.js";

const app = express();
app.use(express.json());

async function main() {
  const wa = new WhatsApp();
  await wa.withStore("file");
  wa.connect();

  app.post("/msg", async (req, res) => {
    await wa.sendMessage(wa.asWhatsAppId("01552832217"), {
      text: req.body.message?.toString() || "Hello, World!",
    });
    res.sendStatus(200);
  });

  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
}

main().catch((error) => {
  console.error("Error:", error);
});
