const express = require('express');

const userDb = require('./userDb')
const postDb = require('../posts/postDb')

const router = express.Router();

router.post('/', validateUser, (req, res) => {
    userDb.insert({name: req.body.name})
    .then(resp => {
        // console.log(resp)
        res.status(201).json(resp)
    })
    .catch(err => {
        // console.log(err)
        res.sendStatus(500)
    })
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
    const text = req.body.text
    const user_id = req.user.id
    
    postDb.insert({text, user_id})
    .then(resp => {
        // console.log(resp)
        res.status(201).json(resp)
    })
    .catch(err => {
        // console.log(err)
        res.sendStatus(500)
    })
});

router.get('/', (req, res) => {
    userDb.get()
    .then(resp => {
        // console.log(resp)
        res.json(resp)
    })
    .catch(err => {
        // console.log(err)
        res.sendStatus(500)
    })
});

router.get('/:id', validateUserId, (req, res) => {
    res.json(req.user)
});

router.get('/:id/posts', validateUserId, (req, res) => {
    userDb.getUserPosts(req.user.id)
    .then(resp => {
        // console.log(resp)
        res.json(resp)
    })
    .catch(err => {
        // console.log(err)
        res.sendStatus(500)
    })
});

router.delete('/:id', validateUserId, (req, res) => {
    userDb.remove(req.user.id)
    .then(resp => {
        // console.log(resp)
        res.sendStatus(204)
    })
    .catch(err => {
        // console.log(err)
        res.sendStatus(500)
    })
});

router.put('/:id', validateUserId, validateUser, (req, res) => {
    userDb.update(req.user.id, {name: req.body.name})
    .then(resp => {
        // console.log(resp)
        userDb.getById(req.user.id)
        .then(resp => {
            res.json(resp)
        })
    })
    .catch(err => {
        // console.log(err)
        res.sendStatus(500)
    })
});

//custom middleware

function validateUserId(req, res, next) {
    const id = Number(req.params.id)
    userDb.getById(id)
    .then(resp => {
        // console.log(resp)
        if (resp) {
            req.user = resp
            next()
        }
        else res.status(400).json({message: "invalid user id"})
    })
    .catch(err => {
        // console.log(err)
        res.sendStatus(500)
    })
};

function validateUser(req, res, next) {
    if (!req.body) {
        res.status(400).json({message: "missing user data"})
    
    }
    else if (!req.body.name) {
        res.status(400).json({message: "missing required name field"})
        return
    }
    next()
};

function validatePost(req, res, next) {
    if (!req.body) {
        res.status(400).json({message: "missing post data"})
        return
    }
    if (!req.body.text) {
        res.status(400).json({message: "missing required text field"})
        return
    }
    next()
};

module.exports = router;