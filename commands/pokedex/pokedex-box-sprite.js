const Command = require('../../framework/Command');

module.exports = class PokedexBoxSpriteCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'pokedex-box-sprite',
			aliases: [
				'pokemon-box-sprite',
				'pokémon-box-sprite',
				'pokédex-box-sprite',
				'pkmn-box-sprite',
				'pokedex-box-image',
				'pokedex-box-image',
				'pokémon-box-image',
				'pokemon-box-image',
				'pokédex-box-image',
				'pkmn-box-image',
				'pokedex-box-img',
				'pokémon-box-img',
				'pokemon-box-img',
				'pokédex-box-img',
				'pkmn-box-img',
				'pokedex-box',
				'pokemon-box',
				'pokémon-box',
				'pokédex-box',
				'pkmn-box'
			],
			group: 'pokedex',
			memberName: 'pokedex-box-sprite',
			description: 'Responds with the box sprite of a Pokémon.',
			clientPermissions: ['ATTACH_FILES'],
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
					name: 'Pokémon Showdown',
					url: 'https://play.pokemonshowdown.com/',
					reason: 'Box Sprite Sheet',
					reasonURL: 'https://play.pokemonshowdown.com/sprites/'
				}
			],
			args: [
				{
					key: 'pokemon',
					prompt: 'What Pokémon would you like to get the box sprite of?',
					type: 'pokemon'
				}
			]
		});
	}

	async run(msg, { pokemon }) {
		try {
			return msg.say(`#${pokemon.displayID} - ${pokemon.name}`, {
				files: [{
					attachment: await pokemon.generateBoxImage(),
					name: 'box.png'
				}]
			});
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};