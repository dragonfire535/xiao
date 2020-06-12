const Command = require('../../structures/Command');
const request = require('node-superfetch');

module.exports = class CommunistCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'communist',
			aliases: ['communist'],
			group: 'edit-avatar',
			memberName: 'communist',
			description: 'communists a users avatar',
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					key: 'user',
					prompt: 'What user would you like to communist',
					type: 'user',
					default: msg => msg.author
				}
			]
		});
	}

	async run(msg, { user }) {
			try {
				const { body } = await request.get(`https://api.alexflipnote.dev/filter/communist?image=${user.displayAvatarURL({ format: 'png', size: 1024})}`);
				return msg.say({ files: [{ attachment: body, name: `communist.png` }] });	
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
