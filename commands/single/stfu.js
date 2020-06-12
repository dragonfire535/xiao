const Command = require('../../structures/Command');
const path = require('path');

module.exports = class STFUCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'stfu',
			group: 'single',
			memberName: 'stfu',
			description: 'tells somebody to stfu',
			clientPermissions: ['ATTACH_FILES']
		});
	}

	run(msg) {
		return msg.say({ files: [path.join(__dirname, '..', '..', 'assets', 'images', 'stfu.mp4')] });
	}
};
