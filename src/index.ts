import "dotenv/config";
import Discord, { MessageEmbed, Channel, TextChannel } from "discord.js";
const client = new Discord.Client({ partials: ["MESSAGE", "CHANNEL", "REACTION"] });

client.login(process.env.DISCORD_API_KEY).then(() => {
  console.log("Ready");
  
  client.on("messageReactionAdd", async (reaction, user) => {
    if (reaction.message.channel.id !== process.env.VERIFICATION_CHANNEL) return;
    if (!reaction.message.guild?.member(user.id)?.roles.cache.has(process.env.USER_ROLE!)) {
      console.log(`Verified ${user.username}#${user.discriminator}`);
      await reaction.message.guild?.member(user.id)?.roles.add(process.env.USER_ROLE!);
      await (await client.channels.fetch(process.env.LOGS_CHANNEL!) as TextChannel).send(`<@${user.id}> verified :white_check_mark:`)
    }

    if (reaction.partial) {
      try {
        await reaction.fetch();
      } catch (error) {
        console.error("Something went wrong when fetching the message: ", error);
        // Return as `reaction.message.author` may be undefined/null
        return;
      }
    }
  });
});
