require("dotenv").config();

const MyClient = require("./structures/Client");

const client = new MyClient(
  process.env.BOT_TOKEN,
  process.env.DEV_GUILD_ID,
  process.env.CLIENT_ID
);

client.connect();
