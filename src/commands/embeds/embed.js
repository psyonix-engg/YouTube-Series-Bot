const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("embed")
    .setDescription("very cool embed!"),

  async execute(interaction, client) {
    await interaction.followUp({
      embeds: [
        client.embeds.simpleEmbed({
          title: "This is the title!",
          description: "This is the description!",
          color: "RANDOM",
          timestamp: new Date(),
          fields: [
            {
              name: "First Field!",
              value: "Put here the value!",
            },
          ],
        }),
      ],
    });
  },
};
