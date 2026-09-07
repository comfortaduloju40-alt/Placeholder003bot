/**
 * Placeholder Telegram bot.
 *
 * Runs in webhook mode via Express, same pattern as the other bots in
 * this series. Currently just responds to /start — add real commands
 * and logic here as the bot's purpose gets defined.
 */

require("dotenv").config();
const express = require("express");
const TelegramBot = require("node-telegram-bot-api");

const BOT_TOKEN = process.env.BOT_TOKEN;
const WEBHOOK_URL = process.env.WEBHOOK_URL;
const PORT = process.env.PORT || 8000;

if (!BOT_TOKEN) {
  console.error("Missing BOT_TOKEN environment variable.");
  process.exit(1);
}
if (!WEBHOOK_URL) {
  console.error("Missing WEBHOOK_URL environment variable.");
  process.exit(1);
}

const bot = new TelegramBot(BOT_TOKEN, { webHook: true });
const app = express();
app.use(express.json());

const webhookPath = `/webhook/${BOT_TOKEN}`;

bot.setWebHook(`${WEBHOOK_URL}${webhookPath}`)
  .then(() => console.log(`Webhook set to ${WEBHOOK_URL}${webhookPath}`))
  .catch((err) => console.error("Failed to set webhook:", err.message));

app.post(webhookPath, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    "👋 Hi! This bot is still under construction — check back soon."
  );
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
