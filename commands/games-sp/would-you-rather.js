const Command = require('../../framework/Command');
const request = require('node-superfetch');
const { stripIndents } = require('common-tags');
const { formatNumber } = require('../../util/Util');
const choices = ['1', '2'];

module.exports = class WouldYouRatherCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'would-you-rather',
			aliases: ['wy-rather', 'wyr'],
			group: 'games-sp',
			memberName: 'would-you-rather',
			description: 'Responds with a random "Would you rather ...?" question.',
			credit: [
				{
					name: 'wouldurather.io',
					url: 'https://wouldurather.io',
					reason: 'API'
				}
			]
		});

		this.availableQuestions = null;
	}

	async run(msg) {
		const current = this.client.games.get(msg.channel.id);
		if (current) return msg.reply(`Please wait until the current game of \`${current.name}\` is finished.`);
		this.client.games.set(msg.channel.id, { name: this.name });
		try {
			if (!this.availableQuestions) await this.fetchAvailableQuestions();
			const data = await this.fetchRandomQuestion();
			await msg.say(stripIndents`
				Would you rather...
				**1.** ${data.option1}
				**2.** ${data.option2}

				_Respond with either **1** or **2** to continue._
			`);
			const filter = res => res.author.id === msg.author.id && choices.includes(res.content.toLowerCase());
			const msgs = await msg.channel.awaitMessages({
				filter,
				time: 30000,
				max: 1
			});
			if (!msgs.size) {
				this.client.games.delete(msg.channel.id);
				return msg.reply(stripIndents`
					No response? Too bad.
					${formatNumber(data.option1Votes)} - ${formatNumber(data.option2Votes)}
				`);
			}
			const option1 = msgs.first().content.toLowerCase() === '1';
			const totalVotes = Number.parseInt(data.option1Votes, 10) + Number.parseInt(data.option2Votes, 10);
			const numToUse = option1 ? Number.parseInt(data.option1Votes, 10) : Number.parseInt(data.option2Votes, 10);
			this.client.games.delete(msg.channel.id);
			return msg.reply(stripIndents`
				**${Math.round((numToUse / totalVotes) * 100)}%** of people agree!
				${formatNumber(data.option1Votes)} - ${formatNumber(data.option2Votes)}
			`);
		} catch (err) {
			this.client.games.delete(msg.channel.id);
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	async fetchAvailableQuestions() {
		const { body } = await request.get('https://wouldurather.io/api/availableQuestions');
		this.availableQuestions = body.question_array;
		return this.availableQuestions;
	}

	async fetchQuestion(id) {
		const { body } = await request
			.get('https://wouldurather.io/api/question')
			.query({ id });
		return body;
	}

	fetchRandomQuestion() {
		const id = this.availableQuestions[Math.floor(Math.random() * this.availableQuestions.length)];
		return this.fetchQuestion(id);
	}
};
