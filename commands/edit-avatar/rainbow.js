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
				const { body } = await request
				.get(`https://imggen.epfforce.tech/api/gay?avatar1=${user.displayAvatarURL({ format: 'png', size: 1024})}`)
				.set({"Authorization": "0c41f905becd918933388bd9c59eb51f5c50ef800b1f45b561f0c24f4a03a57d"});
				return msg.say({ files: [{ attachment: body, name: `gay.png` }] });	
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
