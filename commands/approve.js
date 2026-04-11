const { SlashCommandBuilder } = require('discord.js');
const { approvUser } = require('../modules/approvUser.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('approve')
		.setDescription('Approves a user to post blocked links.')
		.setDefaultMemberPermissions(0)
		.setDMPermission(false)
		.addUserOption((option) => option.setName('user').setDescription('The user to approve.').setRequired(true)),
	async execute(interaction) {
		approvUser(interaction.options.getUser('user').id);
		await interaction.reply({
			content: 'Approved ' + interaction.options.getUser('user').username + ' to post blocked links for 10 minutes.',
			ephemeral: true,
		});
	},
};
