const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder().setName('ping').setDescription('Sends a ping to the bot and returns the latency.'),
	async execute(interaction, client) {
		await interaction.reply({
			content: 'Pong! **' + client.ws.ping + 'ms**',
			ephemeral: true,
		});
	},
};
