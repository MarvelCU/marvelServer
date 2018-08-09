var isLogin = function (req, res, next) {
    var token = req.headers.token
    if(token){
        next()
    }else{
        res.status(400).json({
            msg: 'login failed'
        })
    }
  }

module.exports = isLogin