var express = require('express');
var router = express.Router();
var Lesson = require('../models/lessons')

router.route('/')
.get((req, res, next) => {
    Lesson.find({})
    .then((lesson) => {
        res.statusCode = 200;
        res.setHeader("Content-type", "application/json");
        res.json(lesson);
    }, (err) => next(err)).catch((err) => next(err))
}).post((req, res, next) => {
    Lesson.create({"name": req.body.name, "quota": req.body.quota})
    .then((lesson) => {
        console.log('lesson created');
        res.statusCode = 200;
        res.setHeader("Content-type", "application/json");
        res.json(lesson)
    }, (err) => next(err)).catch((err) => next(err))
}).put((req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation is not supported on /lessons")
}).delete((req, res, next) => {
    res.statusCode = 403;
    res.end("DELETE operation is not supported on /lessons")
})

router.route('/:lesson')
.get((req, res, next) => {
    Lesson.find({name: req.params.lesson})
    .then((lesson) => {
        res.statusCode = 200;
        res.setHeader("Content-type", "application/json");
        res.json(lesson);
    }, (err) => next(err)).catch((err) => next(err))
}).post((req, res, next) => {
    res.statusCode = 403;
    res.end("POST operation is not supported on /lessons/"+req.params.lesson)
}).put( async (req, res, next) => {
    var lesson = await Lesson.findOne({name: req.params.lesson});
    lesson.quota = req.body.quota;
    lesson.save()
    .then((lesson) => {
        console.log(req.params.lesson+'lesson has updated');
        res.statusCode = 200;
        res.setHeader("Content-type", "application/json");
        res.json(lesson)
    })
})

module.exports = router