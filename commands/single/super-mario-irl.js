const Command = require('../../structures/Command');
const path = require('path');

module.exports = class SuperMarioIRLCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'super-mario-irl',
			group: 'single',
			memberName: 'super-mario-irl',
			description: 'Responds with a picture of super-mario-irl.',
			clientPermissions: ['ATTACH_FILES'],
			throttling: {
				usages: 1,
				duration: 20
			},
			credit: [
				{
					name: '𝒯𝒽ℯℛℯ𝒶𝓁ℒ0𝓃3𝒲0𝓁𝒻𝓎#6666',
					reason: 'meme'
				}
			]
		});
	}

	run(msg) {
		msg.say('**SPAGHETT**')
		return msg.say({ files: [path.join(__dirname, '..', '..', 'assets', 'images', 'super-mario-irl.mp4')] });
	}
};
