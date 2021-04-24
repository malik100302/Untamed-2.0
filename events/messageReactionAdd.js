const roleChange = require('../utils/roleChange');

module.exports = async (client, distube, reaction, user) => {
  if (!client.ready) return;

  if (user.bot) return;

  if (!reaction.message.guild) return;

  const config = client.guildConfig[reaction.message.guild.id];
  if (!config) return;

  if (config.shoprole === reaction.message.id) {
    const shop = require('../constants/roles');
    const shopArr = Object.keys(shop);
    const targetKey = shopArr.find((key) => {
      if (shop[key].emoji === reaction.emoji.name) return true;
      return false;
    });
    const target = shop[targetKey];
    if (target) {
      const userdata = await client.db.userdata.findOne({ id: user.id });
      if (userdata) {
        if (userdata.coins > target.cost) {
          roleChange.add(reaction.message.guild.members.cache.get(user.id), target.name);
          client.db.userdata.updateOne({ id: user.id }, {
            $inc: {
              coins: target.cost * -1,
            },
          });
          user.send(`You have successfully bought ${target.name} role!`);
        } else {
          user.send('You don\'t have enough coins!');
        }
      }
      reaction.users.remove(user.id);
    }
  }
};
