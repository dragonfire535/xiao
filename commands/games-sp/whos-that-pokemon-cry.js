const Command = require('../../framework/Command');
const { PermissionFlagsBits } = require('discord.js');
const { reactIfAble } = require('../../util/Util');

module.exports = class WhosThatPokemonCryCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'whos-that-pokemon-cry',
			aliases: ['who-pokemon-cry', 'whos-that-pokémon-cry', 'who-pokémon-cry', 'who-pkmn-cry'],
			group: 'games-sp',
			description: 'Guess who that Pokémon is, based on their cry.',
			throttling: {
				usages: 2,
				duration: 10
			},
			guildOnly: true,
			userPermissions: [PermissionFlagsBits.Connect, PermissionFlagsBits.Speak],
			clientPermissions: [PermissionFlagsBits.AttachFiles],
			game: true,
			credit: [
				{
					name: 'Pokémon',
					url: 'https://www.pokemon.com/us/',
					reason: 'Images, Original Game'
				},
				{
					name: 'PokéAPI',
					url: 'https://pokeapi.co/',
					reason: 'API'
				},
				{
					name: 'Serebii.net',
					url: 'https://www.serebii.net/index2.shtml',
					reason: 'Images'
				},
				{
					name: 'u/CaptainRako',
					url: 'https://www.reddit.com/user/CaptainRako/',
					reason: 'Background Image',
					reasonURL: 'https://www.reddit.com/r/pokemon/comments/420xiv/whos_that_pokemon_1920x1080_hd_template_i_just/'
				},
				{
					name: 'DaFont',
					url: 'https://www.dafont.com/',
					reason: 'Pokemon Solid Font',
					reasonURL: 'https://www.dafont.com/pokemon.font'
				},
				{
					name: 'The Sounds Resource',
					url: 'https://www.sounds-resource.com/',
					reason: 'Cry Sound Effects (Gen 1-7)',
					reasonURL: 'https://www.sounds-resource.com/3ds/pokemonultrasunultramoon/'
				},
				{
					name: 'The Sounds Resource',
					url: 'https://www.sounds-resource.com/',
					reason: 'Cry Sound Effects (Gen 8-9)',
					reasonURL: 'https://www.sounds-resource.com/nintendo_switch/pokemonswordshield/'
				},
				{
					name: 'Pokémon Showdown',
					url: 'https://play.pokemonshowdown.com/',
					reason: 'Cry Sound Effects (Meltan and Melmetal, Legends: Arceus)',
					reasonURL: 'https://play.pokemonshowdown.com/audio/cries/'
				}
			],
			args: [
				{
					key: 'pokemon',
					type: 'integer',
					max: client.pokemon.pokemonCountWithCry,
					min: 0,
					default: () => Math.floor(Math.random() * (client.pokemon.pokemonCountWithCry + 1))
				}
			]
		});
	}

	async run(msg, { pokemon }) {
		const connection = this.client.dispatchers.get(msg.guild.id);
		if (!connection) {
			const usage = this.client.registry.commands.get('join').usage();
			return msg.reply(`I am not in a voice channel. Use ${usage} to fix that!`);
		}
		if (!connection.canPlay) return msg.reply('I am already playing audio in this server.');
		const data = await this.client.pokemon.fetch(pokemon.toString());
		const names = data.names.map(name => name.name.toLowerCase());
		const attachment = await this.client.registry.commands.get('whos-that-pokemon').createImage(data, false);
		connection.play(data.cry);
		await reactIfAble(msg, this.client.user, '🔉');
		await msg.reply('**You have 15 seconds, who\'s that Pokémon?**');
		const msgs = await msg.channel.awaitMessages({
			filter: res => res.author.id === msg.author.id,
			max: 1,
			time: 15000
		});
		connection.play(data.cry);
		if (!msgs.size) return msg.reply(`Time! It's **${data.name}**!`, { files: [attachment] });
		const guess = msgs.first().content.toLowerCase();
		const slug = this.client.pokemon.makeSlug(guess);
		if (!names.includes(guess) && data.slug !== slug) {
			return msg.reply(`Nope! It's **${data.name}**!`, { files: [attachment] });
		}
		return msg.reply(`Nice! It's **${data.name}**!`, { files: [attachment] });
	}
};
