const cooldowns = new Map();
const profileModel = require("../../database/models/profileSchema");
const config = require("../../configs/config.json");
const emoji = require("../../configs/emotes.json");

module.exports = async (Discord, client, message) => {
    const prefix = `>`;
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    let profileData;
    try {
        profileData = await profileModel.findOne({ userID: message.author.id });
        if (!profileData) {
            let profile = await profileModel.create({
                userID: message.author.id,
                serverID: message.guild.id,
                coins: 1000,
                bank: 0,
                bankFree: 1,
                bankBronze: 0,
                bankSilver: 0,
                bankGold: 0,
                bankPlatinum: 0,
                bankExotic: 0,

             });
             profile.save();
        }
    } catch(err) {
        console.log(err)
    }

    const args = message.content.slice(prefix.length).split(/ +/);
    const cmd = args.shift().toLowerCase();

    const command = client.commands.get(cmd) || client.commands.find(a => a.aliases && a.aliases.includes(cmd));

    const validPermissions = [
        "CREATE_INSTANT_INVITE",
        "KICK_MEMBERS",
        "BAN_MEMBERS",
        "ADMINISTRATOR",
        "MANAGE_CHANNELS",
        "MANAGE_GUILD",
        "ADD_REACTIONS",
        "VIEW_AUDIT_LOG",
        "PRIORITY_SPEAKER",
        "STREAM",
        "VIEW_CHANNEL",
        "SEND_MESSAGES",
        "SEND_TTS_MESSAGES",
        "MANAGE_MESSAGES",
        "EMBED_LINKS",
        "ATTACH_FILES",
        "READ_MESSAGE_HISTORY",
        "MENTION_EVERYONE",
        "USE_EXTERNAL_EMOJIS",
        "VIEW_GUILD_INSIGHTS",
        "CONNECT",
        "SPEAK",
        "MUTE_MEMBERS",
        "DEAFEN_MEMBERS",
        "MOVE_MEMBERS",
        "USE_VAD",
        "CHANGE_NICKNAME",
        "MANAGE_NICKNAMES",
        "MANAGE_ROLES",
        "MANAGE_WEBHOOKS",
        "MANAGE_EMOJIS",
      ]

      if(command.permissions.length) {
          let invalidPerms = []
          for (const perm of command.permissions) {
              if(!validPermissions.includes(perm)) {
                  return console.log(`Invalid Permissions ${perm}`);
              }
              if (!message.member.hasPermission(perm)) {
                  invalidPerms.push(perm);
                  break;
              }
          }
          if (invalidPerms.length) {
              message.channel.send(`Missing Permissions: \`${invalidPerms}\``);
          }
      }

      if (command.botPermissions.length) {
          let invalidPermsBot = []
          for (const permBot of command.botPermissions) {
              if (!validPermissions.includes(permBot)) {
                  return console.log(`Invalid Permissions ${permBot}`);
              }
              if (!message.guild.me.hasPermission(permBot)) {
                  invalidPermsBot.push(permBot);
                  break;
              }
          }
              if (invalidPermsBot.length) {
                  message.channel.send(`I am missing the required permissions: \`${invalidPermsBot}\``);
              }
          }

    if(!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    const current_time = Date.now()
    const time_stamps = cooldowns.get(command.name);
    const cooldown_amount = (command.cooldown) * 1000;

    if(time_stamps.has(message.author.id)){
        const expiration_time = time_stamps.get(message.author.id) + cooldown_amount;

        if(current_time < expiration_time){
            const time_left = (expiration_time - current_time) / 1000;
            const time_rounded = Math.round(time_left);

            return message.reply(`please! Cooldown! Wait for **${time_rounded}** seconds!`);
        }
    }

    time_stamps.set(message.author.id, current_time);
    setTimeout(() => time_stamps.delete(message.author.id), cooldown_amount);
     
    if (command.guildOnly && message.channel.type === 'dm') {
        return;
    }

    if (command.ownerOnly && message.author.id != '741529029307531325') {
        return;
    }

    if (command.args && !args.length) {
        var u = command.usage;
        var e = new Discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
        .setDescription(`Invalid Usage`)
        .addField('\u200b', `Correct Usage: \n\`${u}\``, false)
        .setColor(config.loseColor)
        .setTimestamp();
        message.channel.send(e);
    }

    if (command) {
        if (command.status === 'disabled') {
            if (command.name) return;
        } else {
            command.execute(client, message, args, cmd, Discord, profileData);
        }
    }

    // if (command) command.execute(client, message, args, Discord, profileData);
};

    // if (command) {
    //     const db = require("../../models/command");
    //     const check = await db.findOne({ Guild: message.guild.id })
    //     if (check) {
    //         if (check.Cmds.includes(command.name)) return message.reply(`huh`);
    //     } else {
    //         if (command.guildOnly && message.channel.type === 'dm') {
    //             return;
    //         }
        
    //         if (command.ownerOnly && message.author.id != '741529029307531325') {
    //             return;
    //         }
    //         command.execute(client, message, args, Discord, profileData);
    //     }
    // }