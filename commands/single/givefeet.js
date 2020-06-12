const Command = require('../../structures/Command');
const path = require('path');

module.exports = class givefeetCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'givefeet',
			group: 'single',
			memberName: 'givefeet',
			description: 'Responds with a picture of givefeet.',
			clientPermissions: ['ATTACH_FILES'],
			throttling: {
				usages: 1,
				duration: 20
			},
			credit: [
				{
					name: 'givefeet Brand',
					url: 'https://www.givefeet.com/',
					reason: 'Image'
				}
			]
		});
	}

	run(msg) {
		msg.say('give me your feet')
		return msg.say({ files: [path.join(__dirname, '..', '..', 'assets', 'images', 'givefeet.mov')] });
	}
};
