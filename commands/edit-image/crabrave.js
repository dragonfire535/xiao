const Command = require('../../structures/Command');
const request = require('node-superfetch');

module.exports = class crabraveCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'crabrave',
			aliases: ['crabrave'],
			group: 'edit-avatar',
			memberName: 'crabrave',
			description: 'crabrave with text of your choice',
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					key: 'text',
					prompt: 'What would you like to say with crabrave',
					type: 'string',
				}
			]
		});
	}

	async run(msg, { text }) {
		try {
			msg.say('crabraveing...');	
			const { body } = await request
			.get(`https://imggen.epfforce.tech/api/crab?text=${text}`)
			.set({"Authorization": "0c41f905becd918933388bd9c59eb51f5c50ef800b1f45b561f0c24f4a03a57d"});
			return msg.say({ files: [{ attachment: body, name: `crabrave.mp4` }] });    
	} catch (err) {
		return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
	}
}
};
