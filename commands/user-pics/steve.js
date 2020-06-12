const Command = require('../../structures/Command');
const path = require('path');

module.exports = class steveCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'steve',
			group: 'user-pics',
			memberName: 'steve',
			description: 'Responds with a picture of steve.',
			clientPermissions: ['ATTACH_FILES'],
			throttling: {
				usages: 1,
				duration: 12
			},
			credit: [
				{
					name: 'steve Brand',
					url: 'https://www.steve.com/',
					reason: 'Image'
				}
			]
		});
	}

	run(msg) {
		msg.say("<@547212148716077075> it do really be like that")
		return msg.say({ files: [path.join(__dirname, '..', '..', 'assets', 'images','users','steve.png')] });
	}
};
