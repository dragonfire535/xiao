const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');
const emote = require('../../assets/json/random-emote');

module.exports = class RandomEmoteCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'random-emote',
			aliases: ['random-emoji'],
			group: 'random-res',
			memberName: 'random-emote',
			description: 'sends a random emoji',
			credit: [
				{
					name: 'Mattel',
					url: 'https://www.mattel.com/en-us',
					reason: 'Original Concept',
					reasonURL: 'https://www.mattelgames.com/games/en-us/kids/magic-random-emote'
				}
			],
		});
	}

	run(msg) {
		return msg.say(emote[Math.floor(Math.random() * emote.length)]);
	}
};
