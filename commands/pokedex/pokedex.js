const Command = require('../../framework/Command');
const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');
const { arrayEquals, reactIfAble } = require('../../util/Util');
const { MEGA_EVOLVE_EMOJI_NAME, MEGA_EVOLVE_EMOJI_ID } = process.env;
const genGames = [null, 'rb', 'gs', 'rs', 'dp', 'bw', 'xy', 'sm', 'ss', 'sv'];
const games = {
	rb: 'Red/Blue',
	gs: 'Gold/Silver',
	rs: 'Ruby/Sapphire',
	dp: 'Diamond/Pearl',
	bw: 'Black/White',
	xy: 'X/Y',
	sm: 'Sun/Moon',
	ss: 'Sword/Shield',
	sv: 'Scarlet/Violet'
};

module.exports = class PokedexCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'pokedex',
			aliases: ['pokemon', 'pokémon', 'pokédex', 'pkmn'],
			group: 'pokedex',
			memberName: 'pokedex',
			description: 'Searches the Pokédex for a Pokémon.',
			clientPermissions: ['EMBED_LINKS'],
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
					name: 'The Sounds Resource',
					url: 'https://www.sounds-resource.com/',
					reason: 'Cry Sound Effects (Gen 1-7)',
					reasonURL: 'https://www.sounds-resource.com/3ds/pokemonultrasunultramoon/'
				},
				{
					name: 'The Sounds Resource',
					url: 'https://www.sounds-resource.com/',
					reason: 'Cry Sound Effects (Gen 8)',
					reasonURL: 'https://www.sounds-resource.com/nintendo_switch/pokemonswordshield/'
				},
				{
					name: 'Pokémon Showdown',
					url: 'https://play.pokemonshowdown.com/',
					reason: 'Cry Sound Effects (Meltan and Melmetal)',
					reasonURL: 'https://play.pokemonshowdown.com/audio/cries/'
				}
			],
			args: [
				{
					key: 'pokemon',
					prompt: 'What Pokémon would you like to get information on?',
					type: 'pokemon'
				}
			]
		});
	}

	async run(msg, { pokemon }) {
		try {
			if (!pokemon.gameDataCached) await pokemon.fetchGameData();
			const defaultVariety = pokemon.varieties.find(variety => variety.default);
			const typesShown = pokemon.varieties.filter(variety => {
				if (variety.default) return true;
				return !arrayEquals(defaultVariety.types, variety.types);
			});
			const feet = Math.floor(pokemon.height / 12);
			const evoChain = pokemon.chain.data.map(pkmn => {
				if (Array.isArray(pkmn)) {
					return pkmn.map(pkmn2 => {
						const found = this.client.pokemon.get(pkmn2);
						if (found.id === pokemon.id) return `**${found.name}**`;
						return found.name;
					}).join('/');
				}
				const found = this.client.pokemon.get(pkmn);
				if (found.id === pokemon.id) return `**${found.name}**`;
				return found.name;
			}).join(' -> ');
			const embed = new MessageEmbed()
				.setColor(0xED1C24)
				.setAuthor(`#${pokemon.displayID} - ${pokemon.name}`, pokemon.boxImageURL, pokemon.serebiiURL)
				.setDescription(stripIndents`
					**${pokemon.genus}**
					${pokemon.entries.length ? pokemon.entries[Math.floor(Math.random() * pokemon.entries.length)] : 'No data.'}
				`)
				.setThumbnail(pokemon.spriteImageURL)
				.addField('❯ Introduced In', games[genGames[pokemon.generation]], true)
				.addField('❯ Height', `${feet}'${Math.floor(pokemon.height) - (feet * 12)}"`, true)
				.addField('❯ Weight', `${pokemon.weight} lbs.`, true)
				.addField('❯ Types', typesShown.map(variety => {
					const showParens = variety.name && typesShown.length > 1;
					return `${variety.types.join('/')}${showParens ? ` (${variety.name})` : ''}`;
				}).join('\n'))
				.addField('❯ Evolution Chain', `${evoChain}${pokemon.mega ? ` -> ${this.megaEvolveEmoji}` : ''}`)
				.addField('❯ Held Items', pokemon.heldItems.length
					? pokemon.heldItems.map(item => `${item.data.name} (${item.rarity}%)`).join('\n')
					: 'None')
				.addField('❯ Gender Rate', pokemon.genderRate.genderless
					? 'Genderless'
					: `♂️ ${pokemon.genderRate.male}% ♀️ ${pokemon.genderRate.female}%`);
			if (msg.guild && pokemon.cry) {
				const connection = msg.guild ? this.client.dispatchers.get(msg.guild.id) : null;
				if (connection) {
					connection.play(pokemon.cry);
					await reactIfAble(msg, this.client.user, '🔉');
				}
			}
			return msg.embed(embed);
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	get megaEvolveEmoji() {
		return MEGA_EVOLVE_EMOJI_ID && MEGA_EVOLVE_EMOJI_NAME
			? `<:${MEGA_EVOLVE_EMOJI_NAME}:${MEGA_EVOLVE_EMOJI_ID}>`
			: '';
	}
};
