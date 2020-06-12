const Command = require('../../structures/Command');
const { MersenneTwister19937, integer } = require('random-js');
const texts = require('../../assets/json/feet');

module.exports = class feetCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'feet',
			aliases: ['feet', 'feets', 'rate-feet', 'ratefeet'],
			group: 'random-seed',
			memberName: 'feet',
			description: 'Determines a user\'s feet quality.',
			credit: [
				{
					name: 'iCrawl',
					url: 'https://github.com/iCrawl',
					reason: 'Code, Concept',
					reasonURL: 'https://github.com/iCrawl/Tohru/blob/master/src/commands/fun/feets.js'
				}
			],
			args: [
				{
					key: 'user',
					prompt: 'Which user do you want to determine the feet quality of?',
					type: 'user',
					default: msg => msg.author
				}
			]
		});
	}

	run(msg, { user }) {
		if (user.id === this.client.user.id) return msg.reply('Me? I think I have the best feet around!');
		const random = MersenneTwister19937.seed(user.id);
		const quality = integer(0, texts.length - 1)(random);
		return msg.reply(`${user.id === msg.author.id ? 'ur' : `${user.username}'s`} feet are ${texts[quality]}`);
	}
};
