const Command = require('../../structures/Command');

module.exports = class createCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'create',
			aliases: ['create'],
			group: 'edit-text',
			memberName: 'create',
			description: 'st.create "name" "image link for icon" "message".',
			details: 'Only the bot owner(s) may use this command.',
			clientPermissions: ['MANAGE_MESSAGES'],
			args: [
				{
					key: 'user',
					prompt: 'What would you like your creations name to be',
					type: 'string'
				},
				{
					key: 'icon',
					prompt: 'What icon would you like your creation to have',
					type: 'image'
				},
				{
					key: 'content',
					prompt: 'What text should your creation say?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { content, user, icon }) {
		const formats = ['png'];
		if (user.avatar) formats.push('jpg', 'webp');
		const format = user.avatar && user.avatar.startsWith('a_') ? 'gif' : 'png';
		if (format === 'gif') formats.push('gif');
		try {
			if (msg.guild && msg.deletable) await msg.delete();
			msg.channel.createWebhook(`Creation by ${msg.author.username} of ${user}`, `${icon}`)
			.then(webhook => webhook.edit(`Creation by ${msg.author.username} of ${user}`, `${icon}`))
			.then(webhook => webhook.send(content, {
				username: `${user}`,
				avatarURL: `${icon}`,
			}))
			console.log(`${msg.author.username} made a creation: ${user} with the avatar ${icon} and said "${content}" `)
			
			return null;
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
