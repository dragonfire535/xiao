const Command = require('../../structures/Command');

module.exports = class WebCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'website',
			aliases: ['website', 'web'],
			group: 'website',
			memberName: 'https://www.timebotdiscord.xyz/',
			description: 'links to Times website https://www.timebotdiscord.xyz/'
		});
	}

	async run(msg) {
		try {
			msg.reply('https://www.timebotdiscord.xyz/');
			return null;
		} catch {
			return msg.reply('https://www.timebotdiscord.xyz/');
		}
	}
};
