const { checkMessageForDomains } = require('../modules/domainCheck.js');

module.exports = {
	name: 'messageCreate',
	async execute(message, client, config) {
		if (!message.inGuild()) return;
		if (message.channelId === config.gh_feed) {
			message.crosspost();
		}
		if (message.channelId === config.auto_ban_channel) {
			if (!message.member.bannable) return;
			await message.member.dmChannel.send(`You have been banned from the ${message.guild.name} for posting in the Auto-Ban Channel.`);
			await message.member.ban({ deleteMessageSeconds: 60 * 60 * 24 * 7, reason: 'Auto-Ban: Posted in the Auto-Ban Channel' });
			console.log(`Banned ${message.author.tag} for posting in the Auto-Ban Channel.`);
			const teamServerClient = new WebhookClient({ id: config.log_webhook_id, token: config.log_webhook_token });
			teamServerClient.send({
				content: `${message.author.tag} was banned for posting in the Auto-Ban Channel. Message content: \`${message.content}\``,
			});
			return;
		}
		checkMessageForDomains(message, config);
	},
};
