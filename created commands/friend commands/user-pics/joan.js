const Command = require('../../structures/Command');
const path = require('path');

module.exports = class joanCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'joan',
			group: 'user-pics',
			memberName: 'joan',
			description: 'Responds with a picture of joan.',
			clientPermissions: ['ATTACH_FILES'],
			throttling: {
				usages: 1,
				duration: 12
			},
			credit: [
				{
					name: 'joan Brand',
					url: 'https://www.joan.com/',
					reason: 'Image'
				}
			]
		});
	}

	run(msg) {
		return msg.say({ files: [path.join(__dirname, '..', '..', 'assets', 'images','users','joan.jpg')] });
	}
};
