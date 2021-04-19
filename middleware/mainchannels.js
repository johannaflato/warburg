const Arena = require('are.na');
const { paginatedChannelGet } = require('../lib/api');

const { ARENA_CHANNEL_ID } = process.env;

module.exports = async (req, res, next) => {
  const arena = new Arena();
  const data = await paginatedChannelGet(arena, ARENA_CHANNEL_ID);
  // filter syn-site channel's blocks by the 'Channel' class
  const mainchannels = data.contents
    .filter(block => block.class == 'Channel');

  res.locals.mainchannels = mainchannels;
  next();
};
