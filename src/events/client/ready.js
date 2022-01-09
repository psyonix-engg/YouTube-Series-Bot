module.exports = {
  name: "ready",
  once: true,
  execute(client) {
    client.logger.success(
      `Successfully logged into discord as ${client.user.tag}`
    );
  },
};
