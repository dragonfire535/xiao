const Command = require('../../structures/Command');
const path = require('path');

module.exports = class dislikeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'dislike',
			group: 'single',
			memberName: 'dislike',
			description: 'Responds with a picture of dislike.',
			clientPermissions: ['ATTACH_FILES'],
			throttling: {
				usages: 1,
				duration: 5
			},
			credit: [
				{
					name: 'dislike Brand',
					url: 'https://www.dislike.com/',
					reason: 'Image'
				}
			]
		});
	}

	run(msg) {
		return msg.say({ files: [path.join(__dirname, '..', '..', 'assets', 'images', 'dislike.jpg')] });
	}
};
