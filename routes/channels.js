const express = require('express');
const router = express.Router();
const Arena = require('are.na');
const { paginatedChannelGet } = require('../lib/api');

router.get('/:id', async (req, res) => {
  if (!res.locals.definition) next(); // 404
  const arena = new Arena();
  const data = await paginatedChannelGet(arena, req.params.id);
  res.render('channel', data)
});

module.exports = router;
