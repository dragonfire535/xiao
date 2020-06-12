const Command = require('../../structures/Command');
const path = require('path');

module.exports = class swagCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'swag',
			group: 'user-pics',
			memberName: 'swag',
			description: 'Responds with a picture of swag.',
			clientPermissions: ['ATTACH_FILES'],
			throttling: {
				usages: 1,
				duration: 12
			},
			credit: [
				{
					name: 'swag Brand',
					url: 'https://www.swag.com/',
					reason: 'Image'
				}
			]
		});
	}

	run(msg) {
		msg.say("<@423972584686616576> bruh oof")
		return msg.say({ files: [path.join(__dirname, '..', '..', 'assets', 'images','users','swag.jpg')] });
	}
};
