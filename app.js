require("dotenv").config();
const { Bot, session } = require("grammy");
const { conversations, createConversation } = require("@grammyjs/conversations");
const mongoose = require("mongoose");

const bot = new Bot(process.env.API_TOKEN);

const {upload, uploadConversation} = require("./controllers/upload.controller");




bot.command("start", require("./controllers/start.controller"));
bot.on("inline_query", require("./controllers/inlinequery.controller"));
// Install the session plugin.
bot.use(session({
    initial() {
      // return empty object for now
      return {};
    },
  }));
  
// Install the conversations plugin.
bot.use(conversations());
bot.use(createConversation(uploadConversation));
bot.command("upload", upload);



bot.api.setMyCommands([
    { command: "start", description: "boshlash" },
    { command: "upload", description: "rasm yuklash" }
]);



async function main() {
    await mongoose.connect(process.env.MONGO_URL);
    bot.start();
    console.log("Bot started");
}

main();
