const { MessageEmbed } = require("discord.js");

class Utils {
  /**
   * @param {import('discord.js').MessageEmbedOptions} options
   */
  static simpleEmbed(options) {
    return new MessageEmbed({
      ...options,
    });
  }
}

module.exports = Utils;
