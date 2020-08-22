// Load up the discord.js library
const Discord = require("discord.js");
const { version } = require("discord.js");
const moment = require("moment");
const m = require("moment-duration-format");
const os = require('os')
const cpuStat = require("cpu-stat")
const ms = require("ms")
const fs = require("fs")
require('http').createServer(function(request, response) {
 response.end("Hallo!");
}).listen(process.env.PORT);
// This is your client. Some people call it `bot`, some people call it `self`, 
// some might call it `cootchie`. Either way, when you see `client.something`, or `bot.something`,
// this is what we're refering to. Your client.
const client = new Discord.Client();
const request = require("request")

// Here we load the config.json file that contains our token and our prefix values. 
const config = require("./config.json");

let db = JSON.parse(fs.readFileSync("./database.json", "utf8"));
// config.token contains the bot's token
// config.prefix contains the message prefix.

client.on("ready", () => {
  // This event will run if the bot starts, and logs in, successfully.
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds. bot Name: ${client.user.tag}`); 
  // Example of changing the bot's playing game to something useful. `client.user` is what the
  // docs refer to as the "ClientUser".
let statuses = ["Mit geilo schmatiko Befehlen",`mit ${client.users.size} Usern`,"in "+client.guilds.size+" Servern","%help","Prefix: %",'25.5 ca. 20:00 UPDATE TAG!!']

setInterval(function() { 

let status = statuses [Math.floor(Math.random()*statuses.length)];

client.user.setPresence({ game: { name: status }, status: 'dnd' })

},3000)

 });
          client.on('guildMemberAdd', member => {
    // Send the message to a designated channel on a server:
    const channel = member.guild.channels.find('name', 'join-leave');
    // Do nothing if the channel wasn't found on this server
    if (!channel) return;
    // Send the message, mentioning the member
    channel.send(`Willkommen, ${member}`);
});
client.on('guildMemberRemove', member => {
    // Send the message to a designated channel on a server:
    const channel = member.guild.channels.find('name', 'join-leave');
    // Do nothing if the channel wasn't found on this server
    if (!channel) return;
    // Send the message, mentioning the member
    channel.send(`**${member.user.tag}** ist Gegangen! NEEIIIIIIIIIIIIIIIIINNNNNNNNN!!!!!!!!`);
});

client.on("guildCreate", guild => {
  // This event triggers when the bot joins a guild.
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
});

client.on("guildDelete", guild => {
  // this event triggers when the bot is removed from a guild.
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
});


client.on("message", async message => {
  // This event will run on every single message received, from any channel or DM.
  
  // It's good practice to ignore other bots. This also makes your bot ignore itself
  // and not get into a spam loop (we call that "botception").
  if(message.author.bot) return;
  
  // Also good practice to ignore any message that does not start with our prefix, 
  // which is set in the configuration file.
  if(message.content.indexOf(config.prefix) !== 0) return;
  
  // Here we separate our "command" name, and our "arguments" for the command. 
  // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
  // command = say
  // args = ["Is", "this", "the", "real", "life?"]
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  
  // Let's go with a few common example commands! Feel free to delete or change those.
  
     client.on("message", message => {
    if (message.author.bot) return; // ignore bots

    // if the user is not on db add the user and change his values to 0
    if (!db[message.author.id]) db[message.author.id] = {
        xp: 0,
        level: 0
      };
    db[message.author.id].xp++;
    let userInfo = db[message.author.id];
    if(userInfo.xp > 100) {
        userInfo.level++
        userInfo.xp = 0
     message.channel.send("HGW, du bist nun Level "+userInfo.level+"! "+message.author+"")
    }
      fs.writeFile("./database.json", JSON.stringify(db), (x) => {
        if (x) console.error(x)
      });
 
 })

      if(command === "rank") {
        let userInfo = db[message.author.id];
        let member = message.mentions.members.first();
        let embed = new Discord.RichEmbed()
        .setColor(0x4286f4)
        .addField("Level", userInfo.level)
        .addField("XP", userInfo.xp+" | 100")
        if(!member) return message.channel.send(embed)
        let memberInfo = db[member.id]
        let embed2 = new Discord.RichEmbed()
        .setColor(0x4286f4)
        .addField("Level", memberInfo.level)
        .addField("XP", memberInfo.xp+" | 100")
        message.channel.send(embed2)
    .catch(error => message.channel.send(error)
          
           )}    
    
  
  
   if(command === "ping") {
    // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
    // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
    const m = await message.channel.send("Ping?");
    m.edit(`Pong! Mein ping ist: ${m.createdTimestamp - message.createdTimestamp}ms. Bei mir hat die Discord Api ${Math.round(client.ping)}ms`);
  }
  
  if(command === "say") {
    // makes the bot say something and delete the message. As an example, it's open to anyone to use. 
    // To get the "message" itself we join the `args` back into a string with spaces: 
    const sayMessage = args.join(" ");
    // Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
    message.delete().catch(O_o=>{}); 
    // And we get the bot to say the thing: 
    message.channel.send(sayMessage);
  }
  
  if(command === "kick") {
    // This command must be limited to mods and admins. In this example we just hardcode the role names.
    // Please read on Array.some() to understand this bit: 
    // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/some?
    if(!message.member.permissions.has("KICK_MEMBERS"))
      return message.reply("Sorry, you don't have permissions to use this!");
    
    // Let's first check if we have a member and if we can kick them!
    // message.mentions.members is a collection of people that have been mentioned, as GuildMembers.
    // We can also support getting the member by ID, which would be args[0]
    let member = message.mentions.members.first() || message.guild.members.get(args[0]);
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if(!member.kickable) 
      return message.reply("I cannot kick this user! Do they have a higher role? Do I have kick permissions?");
    
    // slice(1) removes the first part, which here should be the user mention or ID
    // join(' ') takes all the various parts to make it a single string.
    let reason = args.slice(1).join(' ');
    if(!reason) reason = "No reason provided";
    
    // Now, time for a swift kick in the nuts!
    await member.kick(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
    message.reply(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);
    
    message.channel.send("https://media1.tenor.com/images/eaad1315b368d5aa1fea7f19bf6b47df/tenor.gif?itemid=8055436")

  }
  
  if(command === "ban") {
    // Most of this command is identical to kick, except that here we'll only let admins do it.
    // In the real world mods could ban too, but this is just an example, right? ;)
    if(!message.member.permissions.has("BAN_MEMBERS"))
      return message.reply("Sorry, you don't have permissions to use this!");
    
    let member = message.mentions.members.first();
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if(!member.bannable) 
      return message.reply("I cannot ban this user! Do they have a higher role? Do I have ban permissions?");

    let reason = args.slice(1).join(' ');
    if(!reason) reason = "No reason provided";
    
    await member.ban(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));
    message.reply(`${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`);
    
    message.channel.send("https://media1.tenor.com/images/7a9fe7f23548941c33b2ef1609c3d31c/tenor.gif?itemid=10045949")
  }
  
  if(command === "clear") {
    // This command removes all messages from all users in the channel, up to 100.
    
    // get the delete count, as an actual number.
    const deleteCount = parseInt(args[0], 10);
    
    // Ooooh nice, combined conditions. <3
    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");
    
    // So we get our messages, and delete them. Simple enough, right?
    const fetched = await message.channel.fetchMessages({limit: deleteCount});
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
    
    message.channel.send("https://media1.tenor.com/images/d79c82f556a950f1b131dd7c19bd74f8/tenor.gif?itemid=13878405")
  }
     if(command === "echo"){
        let msg = args.join(" ")
        if(!msg) return message.reply(`Nutzung: %echo (nachricht)`)
        message.channel.send(msg)
        message.delete()
        return
    }
      if(command === "softban"){
        if(!message.member.permissions.has("BAN_MEMBERS"))
          return message.channel.send("Du hast keine Rechte auf den Befehl!")
        try{
 
           let toban = message.mentions.members.first()
           let reason = args.slice(1).join(" ")
           if(!message.member.permissions.has("KICK_MEMBERS")){ message.reply("Du brauchst die KICK_MEMBERS Berechtigung!").then(msg => msg.delete(4000)); return; }
            if(!toban){message.reply("bitte markiere einen gültigen User").then(msg => msg.delete(4000)); return; }
            if(toban.permissions.has("BAN_MEMBERS")){message.reply("diesen User kann ich nicht für dich bannen.").then(msg => msg.delete(4000)); return; }
           if(!reason) reason = "Kein Grund angegeben."
           var reportch = message.guild.channels.find(ch => ch.name === "reports")
         
           toban.ban(1, reason).then(toban => {
                message.guild.unban(toban.user.id)
                message.reply("**"+toban.user.username+"** wurde soft - banned Grund: "+reason)
                if(reportch){
                let embed = new Discord.RichEmbed()
                .setTitle("~Softban~")
                .setColor("#ff0000")
                .addField("Softbanned Nutzer:", toban.user.username+" mit ID: " + toban.id)
                .addField("Softbanned von:", "<@"+message.author.id+">")
                .addField("Zeit:", message.createdAt.toString())
                .addField("Grund:", reason)
                .setFooter("softban")
                   reportch.send(embed)
                }
           })
       
       
 
        } catch (err){        
            message.respond("Upsi, hier ist ein Fehler aufgetreten! Bitte benachrichtige das Team für eine Behebung.");
            console.log("*" + command + " - Error! Stack:\n " + err.stack);    
        }
        return
    }
  
    if(command === "selbstzerstörung"){
        try{
            message.channel.send("Leite Selbstzerstörung ein in 5...💣").then(msg => {
                       
                  var msg = msg
                             
                   setTimeout(function(){
                   msg.edit("Leite Selbstzerstörung ein in 4...💣")
                   }, 1000)
                   
                   setTimeout(function(){
                   msg.edit("Leite Selbstzerstörung ein in 3...💣")
                   }, 2000)
                   
                   setTimeout(function(){
                   msg.edit("Leite Selbstzerstörung ein in 2...💣")
                   }, 3000)
                   
                   setTimeout(function(){
                   msg.edit("Leite Selbstzerstörung ein in 1...💣")
                   }, 4000)
                   
                   setTimeout(function(){
                   msg.edit("BOOOOOM!!! 💥💥💥")
                   }, 5000)
 
               
                var x = Math.floor((Math.random() * 2) + 1);
 
                if(x==1){
 
                    setTimeout(function(){
                       msg.edit("BOOOOOM!!! 💥💥💥\n\nHmmmm,")
                       }, 8000)
                   
                    setTimeout(function(){
                       msg.edit("BOOOOOM!!! 💥💥💥\n\nHmmmm, das hat irgendwie")
                       }, 10000)
 
                    setTimeout(function(){
                       msg.edit("BOOOOOM!!! 💥💥💥\n\nHmmmm, das hat irgendwie nicht so geklappt")
                       }, 11000)
 
                    setTimeout(function(){
                       msg.edit("BOOOOOM!!! 💥💥💥\n\nHmmmm, das hat irgendwie nicht so geklappt,")
                       }, 12000)
 
                    setTimeout(function(){
                       msg.edit("BOOOOOM!!! 💥💥💥\n\nHmmmm, das hat irgendwie nicht so geklappt, ich bin noch da...")
                       }, 13000)
                }else if(x==2){
                    setTimeout(function(){
                       msg.edit("BOOOOOM!!! 💥💥💥\n\nHmmmm,")
                       }, 8000)
                   
                    setTimeout(function(){
                       msg.edit("BOOOOOM!!! 💥💥💥\n\nHmmmm, im Kino")
                       }, 10000)
 
                    setTimeout(function(){
                       msg.edit("BOOOOOM!!! 💥💥💥\n\nHmmmm, im Kino kam das irgendwie")
                       }, 12000)
 
                    setTimeout(function(){
                       msg.edit("BOOOOOM!!! 💥💥💥\n\nHmmmm, im Kino kam das irgendwie cooler rüber...")
                       }, 13000)
                  
                  setTimeout(function(){
                    msg.edit("BOOOOOM!!! 💥💥💥\n\nHmmmm, im Kino kam das irgendwie cooler rüber... https://tenor.com/uDdW.gif")
                  },14000)
              
                }   
                 message.channel.send("https://media1.tenor.com/images/6e87720a1678f9ab3abce1f161fb30c7/tenor.gif?itemid=11966482")
            })      
               
               
        } catch (err){    
            message.respond("Upsi, hier ist ein Fehler aufgetreten! Bitte benachrichtige das Team für eine Behebung.");    
            console.log("*" + command + " - Error! Stack:\n " + err.stack);   
          
         
        }
        return
    }
      if(command === "connectedservers"){
        if(message.author.id === "543686308648714240" || message.author.id === "510104921887211533" || message.author.id === "427212136134213644" || message.author.id === "465059074959081482" || message.author.id === "265912060007677953"){
            var hembed = new Discord.RichEmbed()
           
            .setTitle("**Verbundene Server** (_" + client.guilds.size + " Server_)")
            .setThumbnail('https://goo.gl/images/RR1tkp')
            .setColor("#2E64FE");
           
            var guildids = client.guilds.keyArray();
            for(var i = 0; i < guildids.length; i = i + 1){
                var joinedat = new Date(client.guilds.get(guildids[i]).joinedTimestamp);
                hembed.addField("● " + client.guilds.get(guildids[i]).name, "  ○ Owner: " + client.guilds.get(guildids[i]).owner.user.username + "#" + client.guilds.get(guildids[i]).owner.user.discriminator + "\n  ○ Gejoined am: " + joinedat.getDate() + "." + (joinedat.getMonth() + 1) + "." + joinedat.getFullYear() + " um " + joinedat.getHours() + ":" + joinedat.getMinutes() + ":" + joinedat.getSeconds() + " Uhr");
            }
            message.channel.send(hembed);
        }
        return
    }
      if(command === "restart"){
        if(message.author.id === "543686308648714240" || message.author.id === "510104921887211533" || message.author.id === "427212136134213644" || message.author.id === "465059074959081482" || message.author.id === "265912060007677953"){
           
            console.log(message.author.name + " hat den Bot neugestartet!");
            client.user.setPresence({status: 'dnd', game:{name:'Loading Code..', type: 3}});
 
            let hembed = new Discord.RichEmbed()
               
            .setTitle("**RESTART**")
            .setThumbnail('https://infobot.lima-city.de/BotPictures/TAC_NETWORK/restart.gif')
            .setColor("#2E64FE")
            .addField("Bot startet neu!" , "Bitte warten...")
            message.channel.send(hembed).then(msg=> process.exit(1));
          
          message.channel.send("https://media1.tenor.com/images/0dc1fc221b67b8ba5e1102f4c246fd7d/tenor.gif?itemid=4771017")
        }
        return
    }
      if(command === "serverinfo"){
        try{
            var server= message.guild
 
            var textChannels = 0
           var  voiceChannels = 0
            var categoryChannels = 0
 
            for(channel in server.channels.array()){
                var channel = server.channels.array()[channel]
                if(channel.type == 'text') textChannels += 1
                if(channel.type == 'voice') voiceChannels += 1
                if(channel.type == 'category') categoryChannels += 1
            }
 
          var   online = 0
            var offline = 0
 
            for(member in server.members.array()){
              var   member = server.members.array()[member]
                if(!member.user)continue
                if(member.user.presence.status == 'offline'){
                    offline += 1
                }else{
                    online += 1
                }
            }
 
            var rolecount = 0
            roles = []
            for(role in server.roles.array()){
               var  role = server.roles.array()[role]
                rolecount += 1
                roles += `<@&${role.id}> `
            }
 
 
            var admins = ''
            for(member in server.members.array()){
                member = server.members.array()[member]
                try {
                    if(member.hasPermission('ADMINISTRATOR') && !member.user.bot){
                        admins += `<@${member.id}>\n`
                    }
                } catch (error) {
                    continue
                }
            }
 
            var createdAt = server.createdAt.getDate() + '/' + (server.createdAt.getMonth() + 1) + '/' + server.createdAt.getFullYear()
           
            var rolecounter = 0
            let rolelist = ''
            for(role in server.roles.array()){
                rolecounter += 1
                rolelist += `<@&${server.roles.array()[role].id}> `
            }
               message.guild.fetchBans()
            .then(bans => {
               let embed = new Discord.RichEmbed()
               .setColor("#28f57d")
               .setThumbnail(server.iconURL)
               .setAuthor(server.name, server.iconURL)
               .setFooter(`ID: ${server.id} | Erstellt: ${createdAt}`)
               .addField("Inhaber:", "<@"+message.guild.ownerID+">")
               .addField("Admins:", admins)
               .addField("Region:", server.region)
               .addField("TextKanäle:", textChannels.toString())
               .addField("SprachKanäle:", voiceChannels.toString())
               .addField("Kategorien:", categoryChannels.toString())
               .addField("Mitglieder:", (server.members.array().length).toString())
               .addField("Online:", online.toString())
               .addField("Offline:", offline.toString())
               .addField("Rollen:", rolecounter - 1)
               .addField("Bans:", bans.size)
                message.channel.send({embed})
            })
        } catch (err){    
            message.respond("Upsi, hier ist ein Fehler aufgetreten! Bitte benachrichtige das Team für eine Behebung.");  
            console.log("*" + command + " - Error! Stack:\n " + err.stack);  
        }return
   }
  if(command === "help"){
  var embed = new Discord.RichEmbed()
  .setTitle("Alle Befehle:")
  .addField("%serverinfo", "Server Infomationen💹")
  .addField("%selbstzerstörung", "Zerstöre Mich.💣")
  .addField("%softban","Softbanned ein User [dafür muss ein Channel namens Reports da sein]✖")
  .addField("%ban","Banne einen User [Permission: BAN_MEMBERS]⛔")
  .addField("%kick", "Kicke jemanden! [Permission: KICK_MEMBER]🚫")
  .addField("%ping", "Erfahre mein Ping!⏳")
  .addField("%entwickler","Zeigt meine Entwickler👥!")
  .addField("%change-log","Zeigt meinen gesamten Change Log🚩")
  .addField("%restart","Startet den Bot neu [Permission: BOT_ADMIN]🔒")
  .addField("%connectedservers","Zeigt die Server des Botes an [Permission: BOT_ADMIN]🔒")
  .addField("%userinfo","Zeigt dir die Userinfo an🚹")
  .addField("%weather", "Zeigt dir das Wetter an🔆")
  .addField("%invite","Invite mich zu deinen Server🆕")
  .addField('%trigger','TRIGGERED!!!!🚨')
  .addField('%billig','Ich bin billig💲')
  .addField('%fly','I belive i can fly🚀')
  .addField('%stats','Zeige die stats des botes (CPU ist verbuggt)')
  .addField("%8ball","Befrage die Kugel")
  .setThumbnail("https://media1.tenor.com/images/d29fdb002d144afda5d09efff7dd4714/tenor.gif?itemid=4702859")
  .setColor("RANDOM")
  message.channel.send(embed)
  }
  if(command === "change-log"){
    var embed = new Discord.RichEmbed()
    .setTitle("Alle Change Logs")
    .addField("Version: 1.0.0 Beta / Erster Öffentlicher Start", "Help Command, Ban Command, Kick Command, Softban Command, Say Command, Echo Command, Serverinfo Command, Selbstzerstörung Command, Ping Command, Restart Command")
    .addField("Version: 1.0.1 Beta","Entwickler Command, Witze / Fun Commands in Planung")
    .addField("Version 1.0.2 Beta", "Statuse Geändert, Userinfo Command hinzugefügt, Help Command editiert")
    .addField("Version 1.0.3 Early Acces","Invite Command hinzugefügt,Wetter Command hinzugefügt")
    .addField("Version 1.0.4","GIF's zu den Befehlen hinzugefügt")
    .setFooter("Change Log | by Tayron und McCookieHD")
    .setColor("GREEN")
    message.channel.send(embed)
    
    message.channel.send("https://media1.tenor.com/images/8967d0cb47a158f1a6b9e0d4639ac5d1/tenor.gif?itemid=9610015")
     }
  if(command === "entwickler"){
    var embed = new Discord.RichEmbed()
    .setTitle("Meine Fetten Entwickler")
    .addField("Entwickler:","[ㄒα¢]乇νιℓㄒαуяση#2233 und м¢¢σσкιє卄∂ | ¢няιѕ ツ#0742 und UltimatumGamer#4693")
    .addField("Co-Entwickler:","Professor Varox#3625")
    .setColor("RED")
    message.channel.send(embed)
    }



if(command === 'userinfo'){
const moment = require('moment');
message.delete()
let user = message.mentions.users.first() || client.users.get(args[0]) || message.author;
let member = message.guild.member(user);
moment.locale('de');
const joinDiscord = moment(user.createdAt).format('llll');
const joinServer = moment(user.joinedAt).format('llll');
const tick = client.emojis.find(emoji => emoji.name === "dcbt");
const cross = client.emojis.find(emoji => emoji.name === "dcbx");
if(user.presence.status === 'online') {st = 'Online'}
if(user.presence.status === 'dnd') {var st = 'Bitte Nicht Stören'} 
if(user.presence.status === 'idle') {var st = 'Abwesend'}
if(user.presence.status === 'offline') {var st = 'Offline'}  
if(user.bot == true) {var bo = tick}
if(user.bot == false) {var bo = cross}

rl = member.roles.map(roles => `${roles.name}`).join(` \`\`||\`\` `)
if(rl.length> 500){ var rl = "Zu viele Rollen um sie hier anzuzeigen."}


    let embed = new Discord.RichEmbed()
        .setAuthor(`${message.guild.name}`, message.guild.iconURL)
        .setColor(`RANDOM`)
        .setThumbnail(`${user.displayAvatarURL}`)
        .setTitle('__**User - Info**__')
        .addField('**Name**', user.username+'#'+user.discriminator, true)
        .addField('**ID**', user.id, true)
        .addField('**Status**', st, true)
        .addField("**Spiel**", `${user.presence.game ? user.presence.game.name : '-'}`, true)
        .addField('**Nickname**', `${member.nickname !== null ? `${member.nickname}` : '-'}`, true)
        .addField("**Bot**", `${bo}`, true)
        .addField('**Beigetreten am**', `${moment.utc(user.joinedAt).format('dddd, Do MMMM YYYY')}`,true)
        .addField('**Erstellt am**', `${moment.utc(user.createdAt).format('dddd, Do MMMM YYYY')}`,true)
        .addField("**Rollen**", `${rl} (${member.roles.size})`,true)
        .setFooter(`Angefragt von: ${message.author.username}`, message.author.displayAvatarURL)
        .setTimestamp();

    message.channel.send({ embed: embed });
  
  message.channel.send("https://media1.tenor.com/images/5ee174df2f751a6a69e6819ec731bfec/tenor.gif?itemid=14144276")


 };
  if(command === "invite"){
    var embed = new Discord.RichEmbed()
    .setTitle("Invite")
    .addField("Invite mich", "Um mich zu inviten drücke [Hier](https://discordapp.com/oauth2/authorize?client_id=576803002841825314&scope=bot&permissions=0)!")
    message.channel.send(embed)
    
    message.channel.send("https://media1.tenor.com/images/9fb6989e2257777f6edb4fcf2984fcca/tenor.gif?itemid=5275330")
    
    
                        }
  //Um diesen CMD zu nutzen bitte erstmal "npm install request" eingeben in die Console und oben noch "const request = require("request")" in den Code hinzufügen
if(command === "stats"){

var bot = client
    let cpuLol;
    cpuStat.usagePercent(function(err, percent, seconds) {
        if (err) {
            return console.log(err);
        }
        const duration = moment.duration(bot.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
        const embedStats = new Discord.RichEmbed()
            .setTitle("**__= STATISTIKEN =__**")
            .setColor("RANDOM")
            .addField("• Bot Owner", `[**The Coder Crew**](https://glitch.com)`)
            .addField("• Uptime ", `${duration}`, true)
            .addField("• Users", `${bot.users.size.toLocaleString()}`, true)
            .addField("• Servers", `${bot.guilds.size.toLocaleString()}`, true)
            .addField("• Channels ", `${bot.channels.size.toLocaleString()}`, true)
            .addField("• Discord.js", `v${version}`, true)
            .addField("• Node", `${process.version}`, true)
            .addField("• Mem Benutzung", `\`\`\`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} / ${(os.totalmem() / 1024 / 1024).toFixed(2)} MB\`\`\``, true)
            .addField("• CPU", `\`\`\`md\n${os.cpus().map(i => `${i.model}`)[0]}\`\`\``)
            .addField("• CPU Benutzung", `\`${percent.toFixed(2)}%\``, true)
            .addField("• Arch", `\`${os.arch()}\``, true)
            .addField("• Plattform", `\`\`${os.platform()}\`\``, true)
            .addField("API Latency", `${Math.round(bot.ping)}ms`)  
            .setTimestamp()
            .setFooter(bot.user.username, bot.user.displayAvatarURL)
            .setThumbnail(bot.user.displayAvatarURL)
            
         
        message.channel.send(embedStats)
    });}




    if(command === "wetter"){
        try{
 
            if(!args[0]){ message.reply('Bitte gib eine Stadt an');return;}
 
            let apiKey = '71afa79e8bd5513a690c807da7d09a15';
            let city = args.join(' ')
            let url = 'http://api.openweathermap.org/data/2.5/weather?q='+city+'&lang=de&units=imperial&appid=' +apiKey
 
            request(url, function (err, response, body) {
                if(err){
                    console.log('error:', err);
                } else {
                    let weather = JSON.parse(body)
                    if(!weather.main)return message.reply("für diese Angabe sind keine Infos verfügbar.")
                    let msg = "It's ${weather.main.temp} degrees in ${weather.name}!";
 
 
 
                    let temperature_min = Math.round((weather.main.temp_min - 32) / 1.8).toString()
                    let temperature_max = Math.round((weather.main.temp_max - 32) / 1.8).toString()
                    let temperature = Math.round((weather.main.temp - 32) / 1.8).toString()
                    let windspeed = (Math.round(weather.wind.speed * 1.609344)).toString()
 
                    let iconurl = "http://openweathermap.org/img/w/" + weather.weather[0].icon + ".png";
 
                    embed = new Discord.RichEmbed()
                    embed.setTitle("Wetter für: " + weather.name + ", " + weather.sys.country)
                    embed.setColor(0x33bbff)
                    embed.setThumbnail(iconurl)
                    embed.addField('Wetterlage: ', weather.weather[0].description)
                    embed.addField("Aktuelle Temperatur: ", temperature + "°C")
                    embed.addField("Temperatur Min/Max:", "Min: " + temperature_min + "°C\nMax: " + temperature_max + "°C")
                    embed.addField('Windgeschwindigkeit:', windspeed + 'Km/h')
                    embed.addField('Luftfeuchtigkeit: ', weather.main.humidity + "%")
                    embed.setFooter("Powered by: OpenWeatherMap", "https://alternative.me/icons/openweathermap.jpg")
 
 
                    message.channel.send(embed)
                }
            });
        } catch (err){
            message.respond("Upsi, hier ist ein Fehler aufgetreten! Bitte benachrichtige das Team für eine Behebung.");
            console.log("*" + command + " - Error! Stack:\n " + err.stack);  
        }
        return
    }
 if(command === 'trigger'){
    var embed = new Discord.RichEmbed()
     .setTitle("🚨:warning:🚨")
     .addField("error.detected", "Your life is now destroyed")
     .setColor('RED')
     message.channel.send(embed)
   message.channel.send('https://tenor.com/view/dog-trigger-triggered-gif-12729162')
 }
 if(command === 'billig'){
   var embed = new Discord.RichEmbed()
   .setTitle('Billig💲')
   .addField(' ich Bin billig')
   .setColor('GREEN')
   .setFooter('💲💲💲💲💲💲💲💲💲')
   message.channel.send(embed)
   
   message.channel.send('https://tenor.com/view/tourette-jan-gewitter-im-kopf-billig-ich-bin-billig-gif-13954294')
   
 }
if(command === 'fly'){
  var embed = new Discord.RichEmbed()
  .setTitle('Fly')
  .setDescription('I belive i can Fly')
  .setFooter('🚀🚀🚀🚀🚀')
  .setColor('RANDOM')
  .setImage('https://tenor.com/view/lol-baby-cute-toddler-funny-gif-11493121')
  message.channel.send(embed)
}
if(command === '13'){
  var embed = new Discord.RichEmbed()
  .setTitle('Artikel 13')
  .setDescription('F€CK Artikel 13')
  .setFooter('🚫🚫🚫🚫🚫')
  message.channel.send(embed)
  message.channel.send('` https://tenor.com/view/article13-artikel13-axel-voss-meme-memes-gif-13078634')
}
  if(command === "8ball") {
    if(!args[2]) return message.reply("Error:  Bitte stell mir nur Ja/Nein Fragen!");
    let replies = ["Ja!", "Nein!", "Keine Ahnung!", "Frag mich später erneut!", "Das sage ich jetzt besser nicht!", "Vermutlich!", "Stell mir bitte einfachere Fragen.",
                   "Das kann ich so jetzt nicht genau sagen!", "So viel steht fest!", "Das ist eindeutig der Fall!", "Meine Quellen verneinen dies!", "Ohne jeden Zweifel!",
                   "Konzentriere dich und frag noch mal!", "Meine Antwort lautet: Nein", "Das kann ich jetzt nicht so genau bestätigen!", "Stell mir bitte eine andere Frage!"] 
    let result = Math.floor((Math.random() * replies.length))
    let question = args.slice(0).join(" ");

    let ballembed = new Discord.RichEmbed()
    .setTitle("8Ball")
    .addField("Frage:", question)
    .addField("Antwort:", replies[result])
    .setColor("#00c1cc")
    message.channel.send(ballembed)
  }
   if(command === 'ssp'){
         var test = args[0]
    if(!test) return message.channel.send(`Du musst \`%ssp <stein|papier|schere>\` machen.`)

    var choice = test.toLowerCase();
    if (choice == "papier" || choice == "p") {
      message.channel.send(`Du hast *${args[0].toUpperCase()}* genommen.`)
      var numb = Math.floor(Math.random() * 100);
      if (numb <= 50) {
        var choice2 = "papier";
      } else if (numb > 50) {
        var choice2 = "stein";
      } else {
        var choice2 = "schere";
      }
      if (choice2 == "schere") {
        var response = "Ich nehme **Schere**! :v: Ich habe Gewonnen!"
      } else if (choice2 == "papier") {
        var response = "Ich nehme **Papier**! :hand_splayed: Unentschieden!"
      } else {
        var response = "Ich nehme **Stein**! :punch: Du hast gewonnen!"
      }
      message.channel.send(response);
    } else if (choice == "stein" || choice == "st") {
      message.channel.send(`Du hast *${args[0].toUpperCase()}* genommen.`)
      var numb = Math.floor(Math.random() * 100);
      if (numb <= 50) {
        var choice2 = "papier";
      } else if (numb > 50) {
        var choice2 = "stein";
      } else {
        var choice2 = "schere";
      }
      if (choice2 == "papier") {
        var response = "Ich nehme **Papier**! :hand_splayed: Ich habe gewonnen!"
      } else if (choice2 == "stein") {
        var response = "Ich nehme **Stein**! :punch: Unentschieden!"
      } else {
        var response = "Ich nehme **Schere**! :v: Du hast gewonnen!"
      }
      message.channel.send(response);
    } else if (choice == "schere" || choice == "sc") {
      message.channel.send(`Du hast *${args[0].toUpperCase()}* genommen.`)
      var numb = Math.floor(Math.random() * 100);
      if (numb <= 50) {
        var choice2 = "papier";
      } else if (numb > 50) {
        var choice2 = "stein";
      } else {
        var choice2 = "schere";
      }
      if (choice2 == "stein") {
        var response = "Ich nehme **Papier**! :hand_splayed: Du hast gewonnen!"
      } else if (choice2 == "schere") {
        var response = "Ich nehme **Schere**! :v: Unentschieden!"
      } else {
        var response = "Ich nehme **Stein**! :punch: Ich habe gewonnen!"
      }
      message.channel.send(response);
    } else {
        message.channel.send(`Du musst \`%ssp <stein|papier|schere>\` machen.`)
    }
 }
  
  
  if(command === 'erfolg'){


message.channel.send(new Discord.RichEmbed()
                  .setColor(1435)
                  .setImage("https://www.minecraftskinstealer.com/achievement/a.php?i=7&h=Erfolg+erzielt%21&t=" + args.join('+')));
} 
  
   if(command === "idee"){
    let msg = args.join(" ")
    if(!msg)
      return message.channel.send("Bitte schreibe eine Idee!")
    var embed = new Discord.RichEmbed()
    .setTitle("Neue Idee :bulb:")
    .setDescription(`${args.join(" ")}`)
    .setFooter("Name: " + `${message.author.tag}` + "                                            ID: " + `${message.author.id}` )
    .setColor("GREEN")
    client.channels.get("581944246567698452").send(embed)
    message.channel.send("Danke, für deine Idee! :pencil: \n Sie wurde bei uns gespeichert! :bulb: ")
    message.delete();
    }
   if(command === "patch"){
    var patch = new Discord.RichEmbed()
    .setTitle("**Last Patch**")
    .addField("Version *(BETA)*", "```0.10.1```")
    .addField("Patch:   *0.11.0*", "**%patch** Command published!")
    .addField("BugFixes: *0.11.* [0]", "/No/")
    .setFooter("[.patch] | by HerukanBOT")
    .setColor("BLACK")
    message.channel.send(patch)
   }
})
client.login(config.token);
    