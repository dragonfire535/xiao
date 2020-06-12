const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class VoteCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'vote',
			aliases: ['vote'],
			group: 'single',
			memberName: 'vote',
			description: 'vote',
		});
	}

	run(msg) {
		const embed = new MessageEmbed()
		.setColor(0xFF4500)
		.setTitle('Vote on Top.gg for Time')
		.setAuthor(`Time`, `https://i.imgur.com/ZANhZWR.png`, 'https://timebotdiscord.xyz')
		.setDescription('https://top.gg/bot/691104127295422484')
	return msg.embed(embed);
	}
};