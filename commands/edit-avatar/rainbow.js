const Command = require('../../structures/Command');
const request = require('node-superfetch');

module.exports = class GayCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'rainbow',
			aliases: ['gay'],
			group: 'edit-avatar',
			memberName: 'gay',
			description: 'gays a users avatar',
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					key: 'user',
					prompt: 'What user would you like to gay',
					type: 'user',
					default: msg => msg.author
				}
			]
		});
	}

	async run(msg, { user }) {
			try {
				const { body } = await request.get(`https://api.alexflipnote.dev/filter/gay?image=${user.displayAvatarURL({ format: 'png', size: 1024})}`);
				return msg.say({ files: [{ attachment: body, name: `gay.png` }] });	
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
