const consola = require("consola");
const { Client, Intents, Collection, MessageEmbed } = require("discord.js");
const path = require("path");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const fs = require("fs");
const Utils = require("./Utils");

class MyClient extends Client {
  constructor(token, dev_guild_id, client_id) {
    super({ intents: [new Intents(32767)] });

    this.token = token;
    this.guild_id = dev_guild_id;
    this.client_id = client_id;

    this.logger = consola;
    this.embeds = Utils;

    this.commands = new Collection();
    this.events = new Collection();
  }

  async connect() {
    /* Event Handler */

    const eventFolders = fs.readdirSync(
      path.resolve(__dirname, "..", "events")
    );

    for (const folder of eventFolders) {
      const eventFiles = fs
        .readdirSync(path.resolve(__dirname, "..", "events", `${folder}`))
        .filter((file) => file.endsWith(".js"));

      for (const file of eventFiles) {
        const event = require(`../events/${folder}/${file}`);
        if (event.once) {
          this.once(event.name, (...args) => event.execute(...args));
        } else {
          this.on(event.name, (...args) => event.execute(...args));
        }
      }
    }
    /* Command Handler */

    const commands = [];

    const commandFolders = fs.readdirSync(
      path.resolve(__dirname, "..", "commands")
    );

    for (const folder of commandFolders) {
      const commandFiles = fs
        .readdirSync(path.resolve(__dirname, "..", "commands", `${folder}`))
        .filter((file) => file.endsWith(".js"));

      for (const file of commandFiles) {
        const command = require(`../commands/${folder}/${file}`);
        this.commands.set(command.data.name, command);
        commands.push(command.data.toJSON());
        this.logger.log(
          `[COMMANDS] Successfully loaded the command ${command.data.name}`
        );
      }
    }

    const rest = new REST({ version: "9" }).setToken(this.token);
    (async () => {
      try {
        await rest.put(
          Routes.applicationGuildCommands(this.client_id, this.guild_id),
          { body: commands }
        );

        console.log("Commands successfully loaded.");
      } catch (err) {
        console.error(err);
      }
    })();

    this.on("interactionCreate", async (interaction) => {
      if (!interaction.isCommand()) return;

      if (interaction) {
        await interaction.deferReply();
        const command = this.commands.get(interaction.commandName);
        if (!command) return;

        try {
          await command.execute(interaction, this);
        } catch (err) {
          console.error(err);
          return interaction.reply({
            content: "There was an error whilst executing this command.",
            ephemeral: true,
          });
        }
      }
    });

    /* Login */
    this.login(this.token);
  }
}

module.exports = MyClient;
