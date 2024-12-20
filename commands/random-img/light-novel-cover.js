const Command = require('../../framework/Command');
const request = require('node-superfetch');
const cheerio = require('cheerio');

module.exports = class LightNovelCoverCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'light-novel-cover',
			aliases: ['ln-cover'],
			group: 'random-img',
			description: 'Responds with a randomly generated Light Novel cover.',
			nsfw: true,
			credit: [
				{
					name: 'LN cover generator',
					url: 'https://salty-salty-studios.com/shiz/lncovers.php',
					reason: 'API'
				}
			]
		});
	}

	async run(msg) {
		const { text } = await request.get('https://salty-salty-studios.com/shiz/lncovers.php');
		const $ = cheerio.load(text);
		const cover = $('img').first();
		return msg.say(cover.attr('alt'), {
			files: [`https://salty-salty-studios.com/shiz/${cover.attr('src')}`]
		});
	}
};
