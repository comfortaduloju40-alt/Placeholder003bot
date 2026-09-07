/**
 * Placeholder Telegram Bot
 *
 * A minimal skeleton bot: runs in webhook mode, responds to /start,
 * exposes /health for Railway's health check. Built to be extended
 * later — add new commands with bot.onText(/pattern/, handler).
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

const app = express();
app.use(express.json());

const bot = new TelegramBot(BOT_TOKEN, { webHook: true });

const webhookPath = `/webhook/${BOT_TOKEN}`;
const fullWebhookUrl = `${WEBHOOK_URL.replace(/\/$/, "")}${webhookPath}`;

bot.setWebHook(fullWebhookUrl)
  .then(() => console.log(`Webhook set to ${fullWebhookUrl}`))
  .catch((err) => console.error("Failed to set webhook:", err.message));

app.post(webhookPath, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// --- Commands ---
// Add new bot.onText(...) handlers below as this bot grows.

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    "👋 This bot is under construction. Check back soon!"
  );
});

bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "This is a placeholder bot. No features yet.");
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
