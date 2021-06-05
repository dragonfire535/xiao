const Command = require('../../framework/Command');
const request = require('node-superfetch');
const { MessageEmbed } = require('discord.js');
const { shorten } = require('../../util/Util');
const { GOV_KEY } = process.env;

module.exports = class ApodCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'apod',
			aliases: ['astronomy-picture-of-the-day'],
			group: 'events',
			memberName: 'apod',
			description: 'Responds with today\'s Astronomy Picture of the Day.',
			clientPermissions: ['EMBED_LINKS'],
			credit: [
				{
					name: 'NASA',
					url: 'https://www.nasa.gov/',
					reason: 'APOD API',
					reasonURL: 'https://api.nasa.gov/'
				}
			]
		});
	}

	async run(msg) {
		try {
			const { body } = await request
				.get('https://api.nasa.gov/planetary/apod')
				.query({ api_key: GOV_KEY });
			const embed = new MessageEmbed()
				.setTitle(body.title)
				.setDescription(shorten(body.explanation))
				.setColor(0x2E528E)
				.setAuthor(
					'Astronomy Picture of the Day',
					'https://i.imgur.com/Wh8jY9c.png',
					'https://apod.nasa.gov/apod/astropix.html'
				)
				.setImage(body.media_type === 'image' ? body.url : null)
				.setURL(body.url)
				.setFooter(`Image Credits: ${body.copyright ? body.copyright.replaceAll('\n', '/') : 'Public Domain'}`)
				.setTimestamp();
			return msg.embed(embed);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
