const Command = require('../../structures/Command');
const { MessageEmbed, version: djsVersion } = require('discord.js');
const { version: commandoVersion } = require('discord.js-commando');
const moment = require('moment');
require('moment-duration-format');
const { formatNumber, embedURL } = require('../../util/Util');
const { version, dependencies } = require('../../package');
const permissions = require('../../assets/json/permissions');
const { TIME_GITHUB_REPO_USERNAME, TIME_GITHUB_REPO_NAME } = process.env;
const source = TIME_GITHUB_REPO_NAME && TIME_GITHUB_REPO_USERNAME;

module.exports = class InfoCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'info',
			aliases: ['stats', 'uptime'],
			group: 'util',
			memberName: 'info',
			description: 'Responds with detailed bot information.',
			guarded: true,
			clientPermissions: ['EMBED_LINKS']
		});
	}

	async run(msg) {
		const repoURL = `https://github.com/${TIME_GITHUB_REPO_USERNAME}/${TIME_GITHUB_REPO_NAME}`;
		const embed = new MessageEmbed()
			.setColor(0x00AE86)
			.setFooter('©2017-2020 dragonfire535#8081')
			.addField('❯ Servers', formatNumber(this.client.guilds.cache.size), true)
			.addField('❯ Commands', formatNumber(this.client.registry.commands.size), true)
			.addField('❯ Shards', formatNumber(this.client.options.shardCount), true)
			.addField('❯ Home Server', embedURL('Join for Support', 'https://discord.gg/CMh6u3W'), true)
			.addField('❯ Invite', embedURL('Add Me', 'https://discordapp.com/oauth2/authorize?client_id=691104127295422484&scope=bot&permissions=1849162961'), true)
			.addField('❯ Top.gg', embedURL('check me out', 'https://top.gg/bot/691104127295422484'), true)
			.addField('❯ Source Code', source ? embedURL('GitHub', repoURL) : 'N/A', true)
			.addField('❯ Memory Usage', `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`, true)
			.addField('❯ Uptime', moment.duration(this.client.uptime).format('d:hh:mm:ss'), true)
			.addField('❯ Version', `v${version}`, true)
			.addField('❯ Node.js', process.version, true)
			.addField('❯ Discord.js', `v${djsVersion}`, true)
			.addField('❯ Commando', `v${commandoVersion}`, true)
			.addField('❯ Dependencies', Object.keys(dependencies).join(', '));
		return msg.embed(embed);
	}
};
