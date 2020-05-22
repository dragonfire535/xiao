const Command = require('../../structures/Command');
const path = require('path');

module.exports = class JohnCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'john',
			group: 'user-pics',
			memberName: 'john',
			description: 'Responds with a picture of john.',
			clientPermissions: ['ATTACH_FILES'],
			throttling: {
				usages: 1,
				duration: 12
			},
			credit: [
				{
					name: 'john Brand',
					url: 'https://www.john.com/',
					reason: 'Image'
				}
			]
		});
	}

	run(msg) {
		return msg.say({ files: [path.join(__dirname, '..', '..', 'assets', 'images','users','john.png')] });
	}
};
