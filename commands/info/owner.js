const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class OwnerCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'owner',
			aliases: ['owner'],
			group: 'info',
			memberName: 'owner',
			description: 'who is my owner?',
		});
	}

	run(msg) {
		const embed = new MessageEmbed()
		.setColor(0xFF4500)
		.setAuthor(`Time`, `https://i.imgur.com/ZANhZWR.png`, 'https://timebotdiscord.xyz')
		.setURL('https://timebotdiscord.xyz')
		.addFields(
			{ name: 'Owner/Developer ❯', value: 'Overtime#7858' },
			{ name: 'Dev Server ❯', value: 'https://discord.gg/CMh6u3W', inline: true },
			{ name: 'Years in Development ❯', value: '1 to 2 years', inline: true }
		)
	return msg.embed(embed);
	}
};