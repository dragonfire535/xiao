const Command = require('../../structures/Command');
const path = require('path');
const { MessageEmbed } = require('discord.js');
const Eco = require("quick.eco")

module.exports = class workCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'work',
			aliases: ['work'],
			group: 'economy',
			memberName: 'work',
			description: 'work',
			clientPermissions: ['ATTACH_FILES'],
			guildOnly: true,
			credit: [
				{
					name: 'discord-economy',
					url: 'https://www.npmjs.com/package/discord-economy',
					reason: 'npm program and data storage'
				}
			]
		});
	}

	async run(msg) {
		const eco = new Eco.Manager();
        let add = eco.work(msg.author.id, 1000);
        if (add.onCooldown) return msg.reply(`You already worked. Come back after \`${add.time.minutes}\` minutes & \`${add.time.seconds}\` seconds.`);
        else return msg.reply(`you worked \`${add.amount}\` as a \`${add.workedAs}\` and earned \`${add.after}\` coins.`);
		}
};
