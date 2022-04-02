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
    console.log(req.body)
    Lesson.create({"name": req.body.name, "quota": req.body.quota})
    .then((lesson) => {
        console.log('lesson created');
        res.statusCode = 200;
        res.setHeader("Content-type", "application/json");
        res.json(lesson)
    }, (err) => next(err)).catch((err) => next(err))
})

module.exports = router