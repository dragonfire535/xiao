const Command = require('../../framework/Command');
const { default: Kuroshiro } = require('kuroshiro');
const KuromojiAnalyzer = require('kuroshiro-analyzer-kuromoji');

module.exports = class RomajiCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'romaji',
			aliases: ['romajify', 'hepburn'],
			group: 'edit-text',
			description: 'Converts Japanese text to Romaji.',
			args: [
				{
					key: 'text',
					type: 'string',
					max: 500,
					validate: text => Kuroshiro.Util.hasJapanese(text)
				}
			]
		});

		this.analyzer = new Kuroshiro();
		this.inited = false;
	}

	async run(msg, { text }) {
		if (!this.inited) {
			await this.analyzer.init(new KuromojiAnalyzer());
			this.inited = true;
		}
		const result = await this.analyzer.convert(text, { to: 'romaji' });
		return msg.say(result);
	}
};
