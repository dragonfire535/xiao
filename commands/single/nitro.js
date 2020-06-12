const Command = require('../../structures/Command');
const path = require('path');

module.exports = class NirtoCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'nitro',
			group: 'single',
			memberName: 'nitro',
			description: 'tells somebody to nitro',
			clientPermissions: ['ATTACH_FILES']
		});
	}

	run(msg) {
		return msg.say({ files: [path.join(__dirname, '..', '..', 'assets', 'images', 'nitro.png')] });
	}
};
