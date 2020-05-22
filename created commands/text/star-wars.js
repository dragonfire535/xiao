const Command = require('../../structures/commands/AutoReply');

module.exports = class StarWarsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'star-wars',
			aliases: ['star-wars'],
			group: 'auto',
			memberName: 'star-wars',
			description: 'star wars',
			patterns: [/\b(star wars)\b/i,  /<:end:(.+)>/i],
			reply: true,
			credit: [
				{
					name: 'National Suicide Prevention Lifeline',
					url: 'https://suicidepreventionlifeline.org/',
					reason: 'Phone Number'
				}
			]
		});
	}

	generateText(fromPattern) {
		const text = 'https://twitter.com/abbygov/status/1257382521425334272';
		if (!fromPattern) return text;
		return `${text}`;
	}
};
