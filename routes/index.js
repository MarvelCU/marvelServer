var express = require('express');
var router = express.Router();
const isLogin = require('../midlewares/isLogin');
const { insertUser, getUsers, signin, signinfb, wiki} = require('../controllers/index');
/* GET home page. */
router.post('/', insertUser)
      .get('/',isLogin, getUsers)
      .post('/signin',signin)
      .post('/signin/facebook', signinfb)
      .get('/wiki', wiki)

module.exports = router;
