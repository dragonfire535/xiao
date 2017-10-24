const { Command } = require('discord.js-commando');
const { stripIndents } = require('common-tags');

module.exports = class HitWithShovelCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'hit-with-shovel',
			group: 'roleplay',
			memberName: 'hit-with-shovel',
			description: 'Hits a user with a shovel.',
			args: [
				{
					key: 'user',
					prompt: 'What user do you want to roleplay with?',
					type: 'user'
				}
			]
		});
	}

	run(msg, { user }) {
		return msg.say(stripIndents`
			_**${msg.author.username}** hits **${user.username}** with a shovel._
			https://i.imgur.com/XDIUq02.gif
		`);
	}
};
