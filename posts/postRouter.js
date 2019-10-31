const express = require('express');

const postDb = require('./postDb')

const router = express.Router();

router.get('/', (req, res) => {
    postDb.get()
    .then(resp => {
        // console.log(resp)
        res.json(resp)
    })
    .catch(err => {
        // console.log(err)
        res.sendStatus(500)
    })
});

router.get('/:id', validatePostId, (req, res) => {
    res.json(req.post)
});

router.delete('/:id', validatePostId, (req, res) => {
    postDb.remove(req.post.id)
    .then(resp => {
        // console.log(resp)
        res.sendStatus(204)
    })
    .catch(err => {
        // console.log(err)
        res.sendStatus(500)
    })
});

router.put('/:id', validatePostId, validatePost, (req, res) => {
    postDb.update(req.post.id, {text: req.body.text})
    .then(resp => {
        // console.log(resp)
        postDb.getById(req.post.id)
        .then(resp => {
            res.json(resp)
        })
    })
    .catch(err => {
        // console.log(err)
        res.sendStatus(500)
    })
});

// custom middleware

function validatePostId(req, res, next) {
    const id = Number(req.params.id)

    postDb.getById(id)
    .then(resp => {
        // console.log(resp)
        if (resp) {
            req.post = resp
            next()
        }
        else res.status(400).json({message: "invalid post id"})
    })
    .catch(err => {
        // console.log(err)
        res.sendStatus(500)
    })
};

function validatePost(req, res, next) {
    if (!req.body) {
        res.status(400).json({message: "missing put data"})
        return
    }
   else if (!req.body.text) {
        res.status(400).json({message: "missing required text field"})
        return
    }
    next()
};

module.exports = router;