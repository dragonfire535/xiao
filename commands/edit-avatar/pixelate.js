const Command = require('../../structures/Command');
const request = require('node-superfetch');

module.exports = class pixelateCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'pixelate',
			aliases: ['pixelate'],
			group: 'edit-avatar',
			memberName: 'pixelate',
			description: 'pixelates a users avatar',
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					key: 'user',
					prompt: 'What user would you like to pixelate',
					type: 'user',
					default: msg => msg.author
				}
			]
		});
	}

	async run(msg, { user }) {
			try {
				const { body } = await request.get(`https://api.alexflipnote.dev/filter/pixelate?image=${user.displayAvatarURL({ format: 'png', size: 1024})}`);
				return msg.say({ files: [{ attachment: body, name: `pixelate.png` }] });	
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
