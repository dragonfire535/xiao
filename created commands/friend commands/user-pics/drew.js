const Command = require('../../structures/Command');
const path = require('path');

module.exports = class drewCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'drew',
			group: 'user-pics',
			memberName: 'drew',
			description: 'Responds with a picture of drew.',
			clientPermissions: ['ATTACH_FILES'],
			throttling: {
				usages: 1,
				duration: 12
			},
			credit: [
				{
					name: 'drew Brand',
					url: 'https://www.drew.com/',
					reason: 'Image'
				}
			]
		});
	}

	run(msg) {
		return msg.say({ files: [path.join(__dirname, '..', '..', 'assets', 'images','users','drew.jpg')] });
	}
};
