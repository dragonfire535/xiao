const { TOKEN, OWNER, PREFIX, INVITE } = process.env;
const path = require('path');
const { CommandoClient } = require('discord.js-commando');
const client = new CommandoClient({
    commandPrefix: PREFIX,
    owner: OWNER,
    invite: INVITE,
    disableEveryone: true
});
const { carbon, dBots } = require('./structures/Stats');

client.registry
    .registerDefaultTypes()
    .registerGroups([
        ['util', 'Utility'],
        ['user-info', 'User Info'],
        ['guild-info', 'Server Info'],
        ['moderation', 'Moderation'],
        ['random-res', 'Random Response'],
        ['random-img', 'Random Image'],
        ['image-edit', 'Image Manipulation'],
        ['avatar-edit', 'Avatar Manipulation'],
        ['text-edit', 'Text Manipulation'],
        ['num-edit', 'Number Manipulation'],
        ['search', 'Search'],
        ['games', 'Games'],
        ['random', 'Random/Other'],
        ['roleplay', 'Roleplay']
    ])
    .registerDefaultCommands({
        help: false,
        ping: false,
        prefix: false,
        commandState: false
    })
    .registerCommandsIn(path.join(__dirname, 'commands'));

client.on('ready', () => {
    console.log(`[READY] Shard ${client.shard.id} Logged in as ${client.user.tag} (${client.user.id})!`);
    client.user.setGame(`${PREFIX}help | Shard ${client.shard.id}`);
});

client.on('disconnect', (event) => {
    console.log(`[DISCONNECT] Shard ${client.shard.id} disconnected with Code ${event.code}.`);
    process.exit(0);
});

client.on('error', console.error);

client.on('warn', console.warn);

client.on('commandError', (command, err) => console.error(command.name, err));

client.on('guildMemberAdd', (member) => {
    const channel = member.guild.channels.find('name', 'member-log');
    if (!channel || !channel.permissionsFor(client.user).has('SEND_MESSAGES')) return;
    channel.send(`Welcome ${member.user.username}!`);
});

client.on('guildMemberRemove', (member) => {
    const channel = member.guild.channels.find('name', 'member-log');
    if (!channel || !channel.permissionsFor(client.user).has('SEND_MESSAGES')) return;
    channel.send(`Bye ${member.user.username}...`);
});

client.on('guildCreate', async (guild) => {
    console.log(`[GUILD] I have joined ${guild.name}! (${guild.id})`);
    const guilds = await client.shard.fetchClientValues('guilds.size');
    const count = guilds.reduce((prev, val) => prev + val, 0);
    carbon(count);
    dBots(count, client.user.id);
});

client.on('guildDelete', async (guild) => {
    console.log(`[GUILD] I have left ${guild.name}... (${guild.id})`);
    const guilds = await client.shard.fetchClientValues('guilds.size');
    const count = guilds.reduce((prev, val) => prev + val, 0);
    carbon(count);
    dBots(count, client.user.id);
});

client.login(TOKEN);

process.on('unhandledRejection', console.error);
