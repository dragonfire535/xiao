const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const request = require('node-superfetch');

module.exports = class SmashBrosCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'smash-bros',
			aliases: ['super-smash-bros', 'ssb', 'smash-fighter', 'smash-bros-fighter', 'smash'],
			group: 'search',
			memberName: 'smash-bros',
			description: 'Responds with data for a Super Smash Bros. fighter.',
			clientPermissions: ['EMBED_LINKS'],
			credit: [
				{
					name: 'Nintendo',
					url: 'https://www.nintendo.com/',
					reason: 'Original "Super Smash Bros." Game, Fighter Data',
					reasonURL: 'https://www.smashbros.com/en_US/index.html'
				}
			],
			args: [
				{
					key: 'query',
					prompt: 'What fighter would you like to get information for?',
					type: 'string'
				}
			]
		});

		this.cache = null;
	}

	async run(msg, { query }) {
		try {
			const fighters = await this.fetchFighters();
			const fighter = fighters.find(char => {
				const search = this.makeSlug(query).replace('_and_', '_&_');
				return search === char.slug || char.alias === search;
			});
			if (!fighter) return msg.say('Could not find any results.');
			const embed = new MessageEmbed()
				.setColor(fighter.color)
				.setTitle(fighter.name)
				.setURL(fighter.url)
				.setAuthor(
					'Super Smash Bros. Ultimate',
					'https://i.imgur.com/p407YZ5.jpg',
					'https://www.smashbros.com/en_US/index.html'
				)
				.setDescription(fighter.dlc ? '_DLC Fighter_' : '')
				.setImage(fighter.image)
				.setThumbnail(fighter.logoImage)
				.setFooter(`Fighter ${fighter.number}`, fighter.smallImage);
			return msg.embed(embed);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	async fetchFighters() {
		if (this.cache) return this.cache;
		const { body } = await request.get('https://www.smashbros.com/assets_v2/data/fighter.json');
		const fighters = [];
		for (const fighter of body.fighters) {
			const data = {
				name: fighter.displayName.en_US.replaceAll('<br>', ''),
				alias: this.makeAlias(fighter.displayName.en_US),
				number: fighter.displayNum.replace('\'', 'E'),
				id: fighter.id,
				url: `https://www.smashbros.com/en_US/fighter/${fighter.url}.html`,
				image: `https://www.smashbros.com/assets_v2/img/fighter/${fighter.file}/main.png`,
				smallImage: `https://www.smashbros.com/assets_v2/img/fighter/pict/${fighter.file}.png`,
				logoImage: `https://www.smashbros.com/assets_v2/img/fighter/logo/${fighter.series}_en.png`,
				series: fighter.series,
				color: fighter.color,
				dlc: Boolean(fighter.dlc),
				slug: this.makeSlug(fighter.displayName.en_US)
			};
			fighters.push(data);
		}
		this.cache = fighters;
		setTimeout(() => { this.cache = null; }, 8.64e+7);
		return this.cache;
	}

	makeSlug(name) {
		return name
			.replace(/\/.+/, '')
			.trim()
			.replaceAll('<br>', '')
			.replaceAll(' ', '_')
			.replace(/[^A-Z_&]/ig, '')
			.toLowerCase();
	}

	makeAlias(name) {
		const alias = name.match(/\/(.+)/, '');
		if (!alias) return null;
		return this.makeSlug(alias[1]);
	}
};