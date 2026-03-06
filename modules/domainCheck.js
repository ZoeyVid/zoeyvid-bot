const { WebhookClient } = require('discord.js');
const { PermissionsBitField } = require('discord.js');
const dns = require('node:dns');
const { ifUserApproved } = require('./approvUser.js');

module.exports = {
	async checkMessageForDomains(message, config) {
		if (!message.guild || !message.member || message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
			return;
		}

		const teamServerClient = new WebhookClient({ id: config.log_webhook_id, token: config.log_webhook_token });
		if (message.content.toLowerCase().match(/discord[^\s]*gg|discord[^\s]*invite/g) != null) {
			message.delete();
			teamServerClient.send({
				content: message.author.username + ' hat folgende Nachricht gesendet (invite), welche automatisch gelöscht wurde ```\n' + message.content + '\n```',
			});
			message.author.send('Your message was deleted since it contained a discord invite. Your message: ```\n' + message.content + '\n```');
			message.member.timeout(60 * 60 * 1000, 'Automod - Timeout wegen Discord Invite - eine Stunde');
			return;
		}

		var urls = message.content
			.toLowerCase()
			.replace(/[.,]+/g, '.')
			.match(/([^\s:/@]+\.)+[^\s:/@]+/g);
		if (!urls) return;
		if (await ifUserApproved(message.author.id)) {
			message.react('✅');
			return;
		}

		for (var i = 0; i < urls.length; i++) {
			const options = {
				family: 0,
				hints: dns.ADDRCONFIG | dns.V4MAPPED,
			};
			console.log('Check URL ' + urls[i] + ' from ' + message.author.username);
			await dns.lookup(urls[i], options, (err, address) => {
				if (address == '0.0.0.0') {
					message.delete();
					teamServerClient.send({
						content: message.author.username + ' hat folgende Nachricht gesendet (' + urls[i] + '), welche automatisch gelöscht wurde ```\n' + message.content + '\n```',
					});
					message.author.send('Your message was deleted since it contains a blocked domain (' + urls[i] + '). This bot tends to overblock, so sorry if this was the case. Your message: ```\n' + message.content + '\n```');
					message.member.timeout(5 * 60 * 1000, 'Automod - Timeout wegen gespeerte Domain - 5min');
				}
			});
		}
	},
};
