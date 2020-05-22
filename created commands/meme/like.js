const Command = require('../../structures/Command');
const path = require('path');

module.exports = class likeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'like',
			group: 'single',
			memberName: 'like',
			description: 'Responds with a picture of like.',
			clientPermissions: ['ATTACH_FILES'],
			throttling: {
				usages: 1,
				duration: 5
			},
			credit: [
				{
					name: 'like Brand',
					url: 'https://www.like.com/',
					reason: 'Image'
				}
			]
		});
	}

	run(msg) {
		return msg.say({ files: [path.join(__dirname, '..', '..', 'assets', 'images', 'like.jpg')] });
	}
};
