const Command = require('../../framework/Command');
const request = require('node-superfetch');
const cheerio = require('cheerio');

module.exports = class LolcatCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'lolcat',
			group: 'edit-text',
			description: 'Converts text to lolcat.',
			credit: [
				{
					name: 'speak lolcat',
					url: 'https://speaklolcat.com/',
					reason: 'Translation Data'
				}
			],
			args: [
				{
					key: 'from',
					label: 'text',
					type: 'string',
					max: 500
				}
			]
		});
	}

	async run(msg, { from }) {
		const { text } = await request
			.get('https://speaklolcat.com/')
			.query({ from });
		const $ = cheerio.load(text);
		const translated = $('textarea[id="to"]').first().text();
		return msg.say(translated);
	}
};
