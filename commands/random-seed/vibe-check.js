const Command = require('../../structures/Command');
const { MersenneTwister19937, integer } = require('random-js');
const texts = require('../../assets/json/vibe');

module.exports = class VibeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'vibe',
			aliases: ['vibe-check', 'check-vibe', 'check-vibes'],
			group: 'random-seed',
			memberName: 'vibe',
			description: 'Determines a user\'s vibe.',
			args: [
				{
					key: 'user',
					prompt: 'Which user do you want to determine the vibe of?',
					type: 'user',
					default: msg => msg.author
				}
			]
		});
	}

	run(msg, { user }) {
		const authorUser = user.id === msg.author.id;
		if (user.id === this.client.user.id) return msg.reply('My vibes are more powerful than you can image');
		if (this.client.isOwner(user)) {
			if (authorUser) return msg.reply('there vibes are more powerful than any human alive');
		}
		const random = MersenneTwister19937.seed(user.id);
		const vibe = integer(0, texts.length - 1)(random);
		return msg.reply(`${authorUser ? 'vibes are' : `${user.username} vibes are`} ${texts[vibe]}`);
	}
};
