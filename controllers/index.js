const User = require('../models/user');
const axios = require('axios');
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);
var jwt = require('jsonwebtoken');

module.exports = {
    insertUser: (req, res) => {
        const { name, email, password } = req.body
        var hash = bcrypt.hashSync(password, salt);
        User.create({
            name: name,
            email: email,
            password: hash
        })
            .then((user) => {
                res.status(201).json({
                    msg: 'Data inserted',
                    user
                })
            })
            .catch((err) => {
                res.status(500).json({
                    msg: 'Data insert failed',
                    msg: err.message
                })
            });
    },

    getUsers: (req, res) => {
        User.find({})
            .then((users) => {
                res.status(200).json({
                    msg: 'Data found',
                    users
                })
            })
            .catch((err) => {
                res.status(500).json({
                    msg: 'Data not found',

                })
            });
    },

    signin: (req, res) => {
        User.findOne({ email: req.body.email })
            .then((user) => {
                if (user === null) {
                    res.status(401).json({
                        msg: 'Username/Password incorrect',
                        user
                    })
                } else {

                    let login = bcrypt.compareSync(req.body.password, user.password)
                    if (login) {

                        var token = jwt.sign({
                            id: user.id,
                            name: user.name,
                            email: user.email,
                        }, 'secret-key')

                        console.log(token);
                        res.status(201).json({
                            msg: 'Login success',
                            token
                        })
                    } else {
                        res.status(401).json({
                            msg: 'Username/Password incorrect',
                            data
                        })
                    }
                }
            })
            .catch((err) => {
                res.status(500).json(err)
            });
    },

    signinfb: (req, res) => {
        let fb = req.body
        let url_user_info = `https://graph.facebook.com/me?fields=id,name,email&access_token=${fb.fb.accessToken}`
        axios.get(url_user_info)
            .then((result) => {
               User.find({ email: result.data.email })
               .then((user) => {
                   if(user.length === 0){
                       User.create(result.data)
                       .then(userData => {
                           let token = jwt.sign(userData, 'marvel')
                           res.status(200).json(token)
                       })
                       .catch(err => {
                           res.status(500).json(err)
                       })
                   } else {
                       
                    let token = jwt.sign({id: user[0]._id, name: user[0].name, email: user[0].email}, 'marvel')
                    res.status(200).json(token)
                   }
                   
               })
               .catch((err) => {
                   res.status(500).json(err)
               });
               
            })
            .catch((err) => {
                res.status(500).json(err)
            });

    },

    wiki: (req,res) => {
        axios.get(`https://en.wikipedia.org/w/api.php?action=opensearch&search=${req.query.name}&limit=5&format=json`)
        .then(result => {
            res.status(200).json(result.data)
        })
        .catch(err => {
            res.status(500).json(err)
        })
    }

};
