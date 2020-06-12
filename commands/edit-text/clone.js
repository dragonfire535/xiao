const Command = require('../../structures/Command');

module.exports = class CloneCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'clone',
			aliases: ['clone'],
			group: 'edit-text',
			memberName: 'clone',
			description: 'Posts a message to the webhook defined in the bot owner\'s `process.env`.',
			details: 'Only the bot owner(s) may use this command.',
			clientPermissions: ['MANAGE_MESSAGES'],
			args: [
				{
					key: 'user',
					prompt: 'What user would you like the webhook to clone',
					type: 'user'
				},
				{
					key: 'content',
					prompt: 'What text would you like the webhook to say?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, { content, user }) {
		const formats = ['png'];
		if (user.avatar) formats.push('jpg', 'webp');
		const format = user.avatar && user.avatar.startsWith('a_') ? 'gif' : 'png';
		if (format === 'gif') formats.push('gif');
		try {
			if (msg.guild && msg.deletable) await msg.delete();
<<<<<<< HEAD
			msg.channel.createWebhook(`Clone of ${user.username} by ${msg.author.username}`, `${user.displayAvatarURL}`)
			.then(webhook => webhook.edit(`Clone of ${user.username} by ${msg.author.username}`, `${user.displayAvatarURL}`))
			.then(webhook => webhook.send(content, {
				username: `${user.username}`,
				avatarURL: `${(user.displayAvatarURL({ format, size: 2048 }))}`,
			}))
			console.log(`${msg.author.username} Cloned ${user.username} and said "${content}" `)
			
=======
			msg.channel.createWebhook(`Clone of ${user.username} by ${msg.author.username}`)
				.then(webhook => webhook.edit(`Clone of ${user.username} by ${msg.author.username}`))
				.then(webhook => webhook.send(content, {
					username: `${user.username}`,
					avatarURL: `${user.displayAvatarURL({ format, size: 2048 })}`
				}));
			console.log(`${msg.author.username} Cloned ${user.username} and said "${content}" `);
>>>>>>> 1d0572bb7f29e4de364d42b4843e9202645f8afb
			return null;
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};
