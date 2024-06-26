const Command = require('../../framework/Command');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { formatNumber } = require('../../util/Util');
const { promisify } = require('util');
const exec = promisify(require('child_process').execFile);
const path = require('path');

module.exports = class ClocCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'cloc',
			group: 'util-public',
			description: 'Responds with the bot\'s code line count.',
			guarded: true,
			clientPermissions: [PermissionFlagsBits.EmbedLinks]
		});

		this.cache = null;
	}

	async run(msg) {
		const cloc = await this.cloc();
		const embed = new EmbedBuilder()
			.setColor(0x00AE86)
			.setFooter({ text: `${cloc.header.cloc_url} ${cloc.header.cloc_version}` })
			.addField(`❯ JS (${formatNumber(cloc.JavaScript.nFiles)})`, formatNumber(cloc.JavaScript.code), true)
			.addField(`❯ JSON (${formatNumber(cloc.JSON.nFiles)})`, formatNumber(cloc.JSON.code), true)
			.addField(`❯ MD (${formatNumber(cloc.Markdown.nFiles)})`, formatNumber(cloc.Markdown.code), true)
			.addField(`❯ Total (${formatNumber(cloc.SUM.nFiles)})`, formatNumber(cloc.SUM.code), true);
		return msg.embed(embed);
	}

	async cloc() {
		if (this.cache) return this.cache;
		const { stdout, stderr } = await exec(
			path.join(__dirname, '..', '..', 'node_modules', '.bin', 'cloc'),
			[
				'--json',
				'--exclude-dir=node_modules',
				path.join(__dirname, '..', '..')
			]
		);
		if (stderr) throw new Error(stderr.trim());
		this.cache = JSON.parse(stdout.trim());
		return this.cache;
	}
};
