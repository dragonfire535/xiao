const Command = require('../../framework/Command');
const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');
const cheerio = require('cheerio');
const { list, firstUpperCase } = require('../../util/Util');
const signs = require('../../assets/json/horoscope');

module.exports = class HoroscopeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'horoscope',
			group: 'events',
			memberName: 'horoscope',
			description: 'Responds with today\'s horoscope for a specific Zodiac sign.',
			details: `**Signs:** ${signs.join(', ')}`,
			clientPermissions: ['EMBED_LINKS'],
			credit: [
				{
					name: 'astrology.TV',
					url: 'https://astrology.tv/',
					reason: 'Horoscope Data',
					reasonURL: 'https://astrology.tv/horoscope/daily/'
				}
			],
			args: [
				{
					key: 'sign',
					prompt: `Which sign would you like to get the horoscope for? Either ${list(signs, 'or')}.`,
					type: 'string',
					oneOf: signs,
					parse: sign => sign.toLowerCase()
				}
			]
		});
	}

	async run(msg, { sign }) {
		try {
			const horoscope = await this.fetchHoroscope(sign);
			const embed = new MessageEmbed()
				.setColor(0x9797FF)
				.setTitle(`Horoscope for ${firstUpperCase(sign)}...`)
				.setURL(`https://astrology.tv/horoscope/signs/${sign}/`)
				.setFooter('© Kelli Fox, The Astrologer')
				.setThumbnail(this.getImageURL(sign))
				.setTimestamp()
				.setDescription(horoscope);
			return msg.embed(embed);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	async fetchHoroscope(sign) {
		const { text } = await request.get(`https://astrology.tv/horoscope/signs/${sign}/`);
		const $ = cheerio.load(text);
		return $('div[class="ct-text-block day-tabs-content_horoscope"]').eq(1).text();
	}

	getImageURL(sign) {
		return `https://astrology.tv/wp-content/uploads/2019/07/astrology_tv_${sign}_cover-768x768.jpg`;
	}
};
