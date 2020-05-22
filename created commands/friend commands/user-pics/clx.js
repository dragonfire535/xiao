const Command = require('../../structures/Command');
const path = require('path');

module.exports = class clxCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'clx',
			group: 'user-pics',
			memberName: 'clx',
			description: 'Responds with a picture of clx.',
			clientPermissions: ['ATTACH_FILES'],
			throttling: {
				usages: 1,
				duration: 12
			},
			credit: [
				{
					name: 'clx Brand',
					url: 'https://www.clx.com/',
					reason: 'Image'
				}
			]
		});
	}

	run(msg) {
		return msg.say({ files: [path.join(__dirname, '..', '..', 'assets', 'images','users','clx.jpg')] });
	}
};
