const Command = require('../../framework/Command');
const request = require('node-superfetch');
const { decode: decodeHTML } = require('html-entities');
const { stripIndents } = require('common-tags');
const { verify, formatNumber } = require('../../util/Util');

module.exports = class WillYouPressTheButtonCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'will-you-press-the-button',
			aliases: ['press-the-button', 'button', 'wyptb', 'press-button'],
			group: 'games-sp',
			memberName: 'will-you-press-the-button',
			description: 'Responds with a random "Will You Press The Button?" dilemma.',
			credit: [
				{
					name: 'Will You Press The Button?',
					url: 'https://willyoupressthebutton.com/',
					reason: 'API'
				}
			]
		});
	}

	async run(msg) {
		const current = this.client.games.get(msg.channel.id);
		if (current) return msg.reply(`Please wait until the current game of \`${current.name}\` is finished.`);
		this.client.games.set(msg.channel.id, { name: this.name });
		try {
			const dilemma = await this.fetchDilemma();
			await msg.reply(stripIndents`
				**${decodeHTML(dilemma.txt1)}** but **${decodeHTML(dilemma.txt2)}**

				Will you press the button?
				_Respond with **[y]es** or **[n]o** to continue._
			`);
			const verification = await verify(msg.channel, msg.author);
			if (verification === 0) {
				this.client.games.delete(msg.channel.id);
				return msg.reply(stripIndents`
					No response? Too bad.
					Yes ${formatNumber(dilemma.yes)} - ${formatNumber(dilemma.no)} No
				`);
			}
			await this.postResponse(dilemma.id, verification);
			const totalVotes = dilemma.yes + dilemma.no;
			this.client.games.delete(msg.channel.id);
			return msg.reply(stripIndents`
				**${Math.round(((verification ? dilemma.yes : dilemma.no) / totalVotes) * 100)}%** of people agree!
				Yes ${formatNumber(dilemma.yes)} - ${formatNumber(dilemma.no)} No
			`);
		} catch (err) {
			this.client.games.delete(msg.channel.id);
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

	async fetchDilemma() {
		const { body } = await request.post('https://api2.willyoupressthebutton.com/api/v2/dilemma/');
		return body.dilemma;
	}

	async postResponse(id, bool) {
		try {
			const { body } = await request
				.post(`https://api2.willyoupressthebutton.com/api/v2/dilemma/${id}/${bool ? 'yes' : 'no'}`);
			return body.success;
		} catch {
			return null;
		}
	}
};
