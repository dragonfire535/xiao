const Command = require('../../framework/Command');
const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');
const types = ['random', 'today'];

module.exports = class XKCDCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'xkcd',
			aliases: ['kcd'],
			group: 'search',
			memberName: 'xkcd',
			description: 'Responds with an XKCD comic, either today\'s, a random one, or a specific one.',
			clientPermissions: ['EMBED_LINKS'],
			credit: [
				{
					name: 'xkcd',
					url: 'https://xkcd.com/',
					reason: 'API',
					reasonURL: 'https://xkcd.com/json.html'
				}
			],
			args: [
				{
					key: 'query',
					prompt: 'Please enter either a specific comic number, today, or random.',
					type: 'string',
					default: 'today',
					validate: query => {
						if (types.includes(query.toLowerCase())) return true;
						const num = Number.parseInt(query, 10);
						if (!Number.isNaN(num) && num > 1) return true;
						return `Invalid query, please enter either today, random, or a specific comic number.`;
					},
					parse: query => query.toLowerCase()
				}
			]
		});
	}

	async run(msg, { query }) {
		try {
			const current = await request.get('https://xkcd.com/info.0.json');
			if (query === 'today') {
				const embed = new MessageEmbed()
					.setTitle(`${current.body.num} - ${current.body.title}`)
					.setColor(0x9797FF)
					.setURL(`https://xkcd.com/${current.body.num}`)
					.setImage(current.body.img)
					.setFooter(current.body.alt);
				return msg.embed(embed);
			}
			if (query === 'random') {
				const random = Math.floor(Math.random() * current.body.num) + 1;
				const { body } = await request.get(`https://xkcd.com/${random}/info.0.json`);
				const embed = new MessageEmbed()
					.setTitle(`${body.num} - ${body.title}`)
					.setColor(0x9797FF)
					.setURL(`https://xkcd.com/${body.num}`)
					.setImage(body.img)
					.setFooter(body.alt);
				return msg.embed(embed);
			}
			const choice = Number.parseInt(query, 10);
			if (current.body.num < choice) return msg.say('Could not find any results.');
			const { body } = await request.get(`https://xkcd.com/${choice}/info.0.json`);
			const embed = new MessageEmbed()
				.setTitle(`${body.num} - ${body.title}`)
				.setColor(0x9797FF)
				.setURL(`https://xkcd.com/${body.num}`)
				.setImage(body.img)
				.setFooter(body.alt);
			return msg.embed(embed);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
