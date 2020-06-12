const Command = require('../../structures/Command');
const path = require('path');
const { MessageEmbed } = require('discord.js');
const Eco = require("quick.eco")

module.exports = class begCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'beg',
			aliases: ['beg'],
			group: 'economy',
			memberName: 'beg',
			description: 'beg',
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
        let add = eco.beg(msg.author.id, 4);
        if (add.onCooldown) return msg.reply(`You already beged. Come back after \`${add.time.minutes}\` minutes & \`${add.time.seconds}\` seconds.`);
        else return msg.reply(`you beged \`${add.amount}\` as a \`${add.begedAs}\` and earned \`${add.after}\` coins.`);
		}
};
