const Command = require('../../structures/Command');
const path = require('path');

module.exports = class ToastCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'toast',
			group: 'single',
			memberName: 'toast',
			description: 'Posts a picture that truly defines modern art.',
			clientPermissions: ['ATTACH_FILES']
		});
	}

	run(msg) {
		return msg.say({ files: [path.join(__dirname, '..', '..', 'assets', 'images', 'toast.gif')] });
	}
};
