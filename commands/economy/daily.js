const Command = require('../../structures/Command');
const path = require('path');
const { MessageEmbed } = require('discord.js');
const Eco = require("quick.eco")

module.exports = class dailyCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'daily',
			aliases: ['daily'],
			group: 'economy',
			memberName: 'daily',
			description: 'daily',
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
        let add = eco.daily(msg.author.id, 500);
        if (add.onCooldown) return msg.reply(`You already claimed your daily coins. Come back after ${add.time.days} days, ${add.time.hours} hours, ${add.time.minutes} minutes & ${add.time.seconds} seconds.`);
        else return msg.reply(`you claimed ${add.amount} as your daily coins and now you have total ${add.after} coins.`);
		}
};
