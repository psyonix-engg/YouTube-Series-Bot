const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("poooong")
    .setDescription(`Rreplies with pong.`),
  permissions: ["SEND_MESSAGES"],

  async execute(interaction) {
    await interaction.followUp(`Pong!`);
  },
};
