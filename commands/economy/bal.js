const Command = require('../../structures/Command');
const path = require('path');
const { MessageEmbed } = require('discord.js');
const Eco = require("quick.eco")

module.exports = class balCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'bal',
			aliases: ['bal'],
			group: 'economy',
			memberName: 'bal',
			description: 'bal',
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
        let money = eco.fetchMoney(msg.author.id);
        return msg.channel.send(`<@${money.user}> has ${money.amount} coins.`); 
		}
};
