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
                    msg: 'data inserted',
                    user
                })
            })
            .catch((err) => {
                res.status(500).json({
                    msg: 'insert failed',
                    msg: err.message
                })
            });
    },

    getUsers: (req, res) => {
        User.find({})
            .then((users) => {
                res.status(200).json({
                    msg: 'data found',
                    users
                })
            })
            .catch((err) => {
                res.status(500).json({
                    msg: 'data not found',

                })
            });
    },

    signin: (req, res) => {
        User.findOne({ email: req.body.email })
            .then((user) => {
                if (user === null) {
                    res.status(401).json({
                        msg: 'username/password wrong',
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
                            msg: 'login succes',
                            token
                        })
                    } else {
                        res.status(401).json({
                            msg: 'username/password wrong',
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
                User.findOne({ email: result.data.email })
                    .then((user) => {
                        if (user === null) {
                            User.create(result.data)
                                .then((newUser) => {
                                    let token = jwt.sign(newUser, 'secret-key')
                                    res.status(200).json(token)
                                })
                                .catch((err) => {
                                    res.status(500).json(err)
                                });
                        } else {
                            var token = jwt.sign({
                                id: user.id,
                                name: user.name,
                                email: user.email
                            }, 'secret-key')

                            res.status(201).json({
                                msg: 'login succes',
                                token
                            })
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


};
