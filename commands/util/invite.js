const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');

module.exports = class InviteCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'invite',
			group: 'util',
			memberName: 'invite',
			description: 'Responds with the bot\'s invite links.',
			guarded: true
		});
	}

	async run(msg) {
		return msg.say(stripIndents`
			Invite me using this link:
			https://discordapp.com/oauth2/authorize?client_id=691104127295422484&scope=bot&permissions=1849162961
		`);
	}
};
