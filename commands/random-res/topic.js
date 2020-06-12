const Command = require('../../structures/Command');
const topics = require('../../assets/json/topic');

module.exports = class topicCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'topic',
			aliases: ['topic', "revive"],
			group: 'random-res',
			memberName: 'topic',
			description: 'says a topic',
			args: [
				{
					key: 'user',
					prompt: '@ somebody for topic?',
					type: 'user',
					default: msg => msg.author
				}
			]
		});
	}

	run(msg) {
		return msg.say(`${topics[Math.floor(Math.random() * topics.length)]}`);
	}
};
