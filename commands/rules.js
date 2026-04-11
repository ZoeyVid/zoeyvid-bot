const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder().setName('rules').setDescription('The rules of the server.'),
	async execute(interaction, client, config) {
		var regeln = await client.guilds.cache.get(config.guild).channels.cache.get(config.role_channel).messages.fetch(config.role_message);
		await interaction.reply({
			content: String(regeln),
			ephemeral: true,
		});
	},
};
