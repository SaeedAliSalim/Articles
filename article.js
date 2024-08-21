
const express = require('express')
const Article = require('../models/article')
const auth = require('../middleware/auth')
const router = express.Router()

router.post('/articles', auth, async (req, res) => {
    try {
        const article = new Article({ ...req.body, author: req.user._id })
        await article.save()
        res.status(201).send(article)
    } catch (e) {
        res.status(400).send(e.message)
    }
})


router.get('/articles', auth, async (req, res) => {
    try {
        const articles = await Article.find({})
        res.status(200).send(articles)
    } catch (e) {
        res.status(500).send(e.message)
    }
})


router.get('/articles/:id', auth, async (req, res) => {
    try {
        const article = await Article.findOne({ _id: req.params.id, author: req.user._id })
        if (!article) {
            return res.status(404).send('Article not found or you do not have permission to view it.')
        }
        res.send(article)
    } catch (e) {
        res.status(500).send(e.message)
    }
})


router.patch('/articles/:id', auth, async (req, res) => {
    try {
        const article = await Article.findOneAndUpdate(
            { _id: req.params.id, author: req.user._id },
            req.body,
            { new: true, runValidators: true }
        )
        if (!article) {
            return res.status(404).send('Article not found or you do not have permission to update it.')
        }
        res.send(article)
    } catch (e) {
        res.status(500).send(e.message)
    }
})


router.delete('/articles/:id', auth, async (req, res) => {
    try {
        const article = await Article.findOneAndDelete({ _id: req.params.id, author: req.user._id })
        if (!article) {
            return res.status(404).send('Article not found or you do not have permission to delete it.')
        }
        res.send(article)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

module.exports = router
