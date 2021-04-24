module.exports = async (client, config, reaction) => {
  if (config.ticketsOpen[reaction.message.channel.id] === reaction.message.id) {
    delete config.ticketsOpen[reaction.message.channel.id];
    client.db.config.updateOne({ id: config.id }, {
      $set: {
        ticketsOpen: config.ticketsOpen,
      },
    });
    reaction.message.channel.delete();
  }
};
