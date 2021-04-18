var Discord = require("discord.js");
var client = new Discord.Client();
var config = require('../config.json');

var prefix = config.prefix;

client.commands = new Discord.Collection();
client.events = new Discord.Collection();

['command_handler', 'event_handler'].forEach(handler => {
  require(`./handlers/${handler}`)(client, Discord)
})

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity(config.activity, { type: config.activityType }).catch(console.error);
});

client.login(config.botToken);
