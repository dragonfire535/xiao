const Discord = require('discord.js');
const commando = require('discord.js-commando');
const config = require('./config.json');
const clevusers = require('./clevusers.json');
const bot = new commando.Client({
    commandPrefix: config.prefix,
    unknownCommandResponse: false,
    owner: config.owner
});
const Cleverbot = require('cleverbot-node');
const cleverbot = new Cleverbot;
cleverbot.configure({botapi: config.clevkey});

bot.registry.registerGroup('fun', 'Fun');
bot.registry.registerGroup('randomimage', 'Random Image');
bot.registry.registerGroup('randomsong', 'Random Song');
bot.registry.registerGroup('roleplay', 'Roleplay');
bot.registry.registerGroup('info', 'Information');
bot.registry.registerGroup('moderation', 'Moderation');
bot.registry.registerDefaults();
bot.registry.registerCommandsIn(__dirname + "/commands");

bot.on('message', (message) => {
    if(message.author.bot) return;
    if(message.content.startsWith(config.prefix + 'servers')) {
        if(message.author.id !== config.owner) return;
        console.log(bot.guilds.array().length + " Servers: " + bot.guilds.map(g => g.name + " (" + g.id + ")").join(", "));
        message.reply("Sent the information to the console!");
    }
    if(message.content.startsWith(config.prefix + "leave")) {
        if(message.author.id !== config.owner) return;
        message.reply("Reminder: To leave a server, eval `this.client.guilds.get(<ID>).leave();`");
    }
    if(message.content.includes("(╯°□°）╯︵ ┻━┻")) {
        if(message.guild.id !== "252317073814978561") return;
        message.reply("Calm down!   ┬─┬ ノ( ゜-゜ノ)");
    }
    if (message.content.startsWith("<@" + bot.user.id + ">")){
        if(message.guild.id === "252317073814978561") {
            if(message.author.id === clevusers.allowed[message.author.id]) {
                if(message.channel.type === 'dm') return;
                let cleverMessage = message.content.replace("<@" + bot.user.id + ">", "");
                message.channel.startTyping();
                cleverbot.write(cleverMessage, function (response) {
                    message.reply(response.output);
                    message.channel.stopTyping();
                });
            } else {
                message.reply(":x: Error! You are either not verified for Cleverbot, or banned from it. Please check #rules for a link to the forum to sign-up for Cleverbot.");
            }
        }
    }
});

bot.on('guildMemberAdd', member => {
    if(member.guild.id !== "252317073814978561") return;
    member.addRole(member.guild.roles.find('name', 'Members'));
    let username = member.user.username;
    member.guild.defaultChannel.send('Welcome ' + username + '!');
});

bot.on('guildMemberRemove', member => {
    if(member.guild.id !== "252317073814978561") return;
    let username = member.user.username;
    member.guild.defaultChannel.send('Bye ' + username + '...');
});

bot.on('guildCreate', guild => {
    console.log("I have joined the guild: " + guild.name + " (" + guild.id + ")...");
});

bot.on('guildDelete', guild => {
    console.log("I have left the guild: " + guild.name + " (" + guild.id + ")...");
});

bot.on('ready', () => {
    let games = ["with a cardboard box", "with Rem", "with my cat", "in the fridge", "in " + bot.guilds.array().length + " servers", "with dragonfire535", "at the Inn", "with your heart", "with a knife", "with a murderous cow", ";help | dragonfire535", "with Cleverbot", "like a pirate", "with all my games", "against Miki", "with " + bot.users.array().length + "users"];
    bot.user.setGame(games[Math.floor(Math.random() * 16)]);
    bot.setInterval(()=>{bot.user.setGame(games[Math.floor(Math.random() * 16)]);}, 300000);
    console.log('Logged in!');
    console.log(bot.guilds.array().length + " Servers: " + bot.guilds.map(g => g.name + " (" + g.id + ")").join(", "));
});

bot.login(config.token);