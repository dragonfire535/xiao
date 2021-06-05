const Command = require('../../framework/Command');

module.exports = class TxtCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'txt',
			group: 'edit-text',
			memberName: 'txt',
			description: 'Generates a TXT file from the text you provide.',
			args: [
				{
					key: 'content',
					prompt: 'What content do you want to include in the TXT file?',
					type: 'string'
				}
			]
		});
	}

	run(msg, { content }) {
		return msg.say({ files: [{ attachment: Buffer.from(content), name: 'txt.txt' }] });
	}
};
