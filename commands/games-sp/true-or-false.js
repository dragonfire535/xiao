const Command = require('../../framework/Command');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { stripIndents } = require('common-tags');
const request = require('node-superfetch');
const difficulties = ['easy', 'medium', 'hard'];

module.exports = class TrueOrFalseCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'true-or-false',
			aliases: ['true-false', 'tf', 'quiz-boolean'],
			group: 'games-sp',
			description: 'Answer a true or false question.',
			details: `**Difficulties:** ${difficulties.join(', ')}`,
			credit: [
				{
					name: 'Open Trivia DB',
					url: 'https://opentdb.com/',
					reason: 'API',
					reasonURL: 'https://opentdb.com/api_config.php'
				}
			],
			args: [
				{
					key: 'difficulty',
					type: 'string',
					default: '',
					oneOf: difficulties,
					parse: difficulty => difficulty.toLowerCase()
				}
			]
		});
	}

	async run(msg, { difficulty }) {
		const { body } = await request
			.get('https://opentdb.com/api.php')
			.query({
				amount: 1,
				type: 'boolean',
				encode: 'url3986',
				difficulty
			});
		if (!body.results) return msg.reply('Oh no, a question could not be fetched. Try again later!');
		const correct = decodeURIComponent(body.results[0].correct_answer.toLowerCase());
		const correctBool = correct === 'true';
		const row = new ActionRowBuilder().addComponents(
			new ButtonBuilder().setCustomId('true').setStyle(ButtonStyle.Success).setLabel('True'),
			new ButtonBuilder().setCustomId('false').setStyle(ButtonStyle.Danger).setLabel('False')
		);
		const questionMsg = await msg.reply(stripIndents`
			**You have 15 seconds to answer this question.**
			${decodeURIComponent(body.results[0].question)}
		`, { components: [row] });
		try {
			const ans = await questionMsg.awaitMessageComponent({
				filter: res => res.user.id === msg.author.id,
				max: 1,
				time: 15000
			});
			const ansBool = ans.customId === 'true';
			if (correctBool !== ansBool) return ans.update({ content: `Nope, sorry, it's ${correctBool}.`, components: [] });
			return ans.update({ content: 'Nice job! 10/10! You deserve some cake!', components: [] });
		} catch {
			return questionMsg.edit({ content: `Sorry, time is up! It was ${correctBool}.`, components: [] });
		}
	}
};
