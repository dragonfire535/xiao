const Command = require('../../framework/Command');
const { decode: decodeHTML } = require('html-entities');

module.exports = class HtmlDecodeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'html-decode',
			aliases: ['decode-html'],
			group: 'edit-text',
			memberName: 'html-decode',
			description: 'Decodes HTML characters to regular characters.',
			args: [
				{
					key: 'text',
					prompt: 'What text would you like to decode?',
					type: 'string',
					validate: text => {
						if (decodeHTML(text).length < 2000) return true;
						return 'Invalid text, your text is too long.';
					}
				}
			]
		});
	}

	run(msg, { text }) {
		return msg.say(decodeHTML(text));
	}
};
