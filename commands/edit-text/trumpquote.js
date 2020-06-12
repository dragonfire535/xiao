const Command = require('../../structures/Command');
const Quote = require('../../assets/json/trumpquote.json');

module.exports = class TrumpQuoteCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'trumpquote',
			aliases: ['trumpquote', 'trump-quote'],
			group: 'edit-text',
			memberName: 'trumpquote',
			description: 'Sends a Donald Trump Quote',
		});
	}

	run(msg) {
		return msg.say('*' + Quote[Math.floor(Math.random() * Quote.length)] + '*' + " - Donald J. Trump");
	}
};
