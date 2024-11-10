const Command = require('../../framework/Command');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const request = require('node-superfetch');
const { stripIndents } = require('common-tags');
const { embedURL, cleanAnilistHTML, trimArray } = require('../../util/Util');
const logos = require('../../assets/json/logos');
const searchGraphQL = stripIndents`
	query ($search: String) {
		characters: Page (perPage: 1) {
			results: characters (search: $search) { id }
		}
	}
`;
const resultGraphQL = stripIndents`
	query ($id: Int!) {
		Character (id: $id) {
			id
			name {
				first
				last
			}
			image {
				large
				medium
			}
			description(asHtml: false)
			siteUrl
			media(page: 1, perPage: 25) {
				edges {
					node {
						title {
							english
							romaji
						}
						type
						siteUrl
					}
				}
			}
		}
	}
`;
const types = {
	ANIME: 'Anime',
	MANGA: 'Manga'
};

module.exports = class AnimeCharacterCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'anime-character',
			aliases: ['anilist-character', 'character', 'manga-character', 'manga-char', 'ani-char', 'char', 'anime-char'],
			group: 'search',
			description: 'Searches AniList for your query, getting character results.',
			clientPermissions: [PermissionFlagsBits.EmbedLinks],
			credit: [
				{
					name: 'AniList',
					url: 'https://anilist.co/',
					reason: 'API',
					reasonURL: 'https://anilist.gitbook.io/anilist-apiv2-docs/'
				}
			],
			args: [
				{
					key: 'query',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { query }) {
		const id = await this.search(query);
		if (!id) return msg.say('Could not find any results.');
		const character = await this.fetchCharacter(id);
		const embed = new EmbedBuilder()
			.setColor(0x02A9FF)
			.setAuthor({ name: 'AniList', iconURL: logos.anilist, url: 'https://anilist.co/' })
			.setURL(character.siteUrl)
			.setThumbnail(character.image.large || character.image.medium || null)
			.setTitle(`${character.name.first || ''}${character.name.last ? ` ${character.name.last}` : ''}`)
			.setDescription(character.description ? cleanAnilistHTML(character.description, false) : 'No description.')
			.addField('❯ Appearances', trimArray(character.media.edges.map(edge => {
				const title = edge.node.title.english || edge.node.title.romaji;
				return embedURL(`${title} (${types[edge.node.type]})`, edge.node.siteUrl);
			}), 5).join(', '));
		return msg.embed(embed);
	}

	async search(query) {
		const { body } = await request
			.post('https://graphql.anilist.co/')
			.set({ referer: 'nick is dum dum' })
			.send({
				variables: { search: query },
				query: searchGraphQL
			});
		if (!body.data.characters.results.length) return null;
		return body.data.characters.results[0].id;
	}

	async fetchCharacter(id) {
		const { body } = await request
			.post('https://graphql.anilist.co/')
			.set({ referer: 'nick is dum dum' })
			.send({
				variables: { id },
				query: resultGraphQL
			});
		return body.data.Character;
	}
};
