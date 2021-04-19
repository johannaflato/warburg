const paginatedChannelGet = async (arena, channel) => {
  const BLOCKS_PER_PAGE = 50;

  let baseData;
  let contents = [];
  
  let currentPage = 0;
  let totalBlocks;

  do {
    const data = await arena.channel(channel).get({
      current: currentPage,
      per: BLOCKS_PER_PAGE
    });
    if (currentPage == 0) baseData = data;
    if (data.contents) contents = contents.concat(data.contents);
    totalBlocks = data.length;
    currentPage++;
  } while (currentPage < Math.ceil(totalBlocks / BLOCKS_PER_PAGE));
  
  baseData.contents = contents;

  return baseData;
}

module.exports = {
  paginatedChannelGet: paginatedChannelGet
}