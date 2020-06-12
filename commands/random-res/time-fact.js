const Command = require('../../structures/Command');
const facts = require('../../assets/json/time-fact');

module.exports = class TimeFactCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'time-fact',
			aliases: ['oc-fact', 'bot-fact', 'easter-egg'],
			group: 'random-res',
			memberName: 'oc-fact',
			description: 'Responds with a random fact about OverClcok.'
		});
	}

	run(msg) {
		return msg.say(facts[Math.floor(Math.random() * facts.length)]);
	}
};
