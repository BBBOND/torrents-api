let express = require('express');
let router = express.Router();
let Torrent = require('../model/Torrent');
let MongoUtil = require('../utils/MongoUtil')

const getDocsByQueryWithRetry = async (query, page, size, retryTime) => {
  try {
    return await MongoUtil.findDocsByQuery(Torrent, query || {}, page, size);
  } catch(e) {
    if (retryTime > 0) {
      MongoUtil.connect();
      return await getDocsByQueryWithRetry(query, page, size, --retryTime);
    } else {
      return {
        code: 1,
        msg: e.message,
      }
    }
  }
};

/**
 * 按条件查询, 重试一次
 */
router.get('/search', async (req, res, next) => {
  console.log('---------------', req.query);
  let query = {
    name: `/${req.query.search || ''}/`,
  }
  let json = await getDocsByQueryWithRetry(query, req.query.page || 1, req.query.size || 10, 2);
  res.send(json);
  res.end();
});

/**
 * 获取种子总量
 */
router.get('/count', async (req, res, next) => {
  let json;
  try {
    let count = await MongoUtil.getCount(Torrent);
    json = {
      count
    };
  } catch(e) {
    console.log(e.message);
    json = {
      code: 2,
      msg: e.message,
    }
  }
  res.send(json);
  res.end();
})

module.exports = router;
