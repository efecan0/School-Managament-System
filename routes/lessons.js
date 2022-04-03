var express = require('express');
var router = express.Router();
var Lesson = require('../models/lessons')
var User = require('../models/user')
const authenticate = require('../authenticate');

router.route('/')
.get(authenticate.verifyUser, (req, res, next) => {
    Lesson.find({})
    .then((lesson) => {
        res.statusCode = 200;
        res.setHeader("Content-type", "application/json");
        res.json(lesson);
    }, (err) => next(err)).catch((err) => next(err))
}).post(authenticate.verifyUser, authenticate.verifyManager,(req, res, next) => {
    Lesson.create({"name": req.body.name, "quota": req.body.quota})
    .then((lesson) => {
        console.log('lesson created');
        res.statusCode = 200;
        res.setHeader("Content-type", "application/json");
        res.json(lesson)
    }, (err) => next(err)).catch((err) => next(err))
}).put(authenticate.verifyUser, authenticate.verifyManager,(req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation is not supported on /lessons")
}).delete(authenticate.verifyUser, authenticate.verifyManager,(req, res, next) => {
    res.statusCode = 403;
    res.end("DELETE operation is not supported on /lessons")
})

router.route('/:lesson')
.get(authenticate.verifyUser, (req, res, next) => {
    Lesson.find({name: req.params.lesson})
    .then((lesson) => {
        res.statusCode = 200;
        res.setHeader("Content-type", "application/json");
        res.json(lesson);
    }, (err) => next(err)).catch((err) => next(err))
}).post(authenticate.verifyUser, authenticate.verifyManager,(req, res, next) => {
    res.statusCode = 403;
    res.end("POST operation is not supported on /lessons/"+req.params.lesson)
}).put( authenticate.verifyUser, authenticate.verifyManager, async (req, res, next) => {
    var lesson = await Lesson.findOne({name: req.params.lesson});
    lesson.quota = req.body.quota;
    lesson.save()
    .then((lesson) => {
        console.log(req.params.lesson+'lesson has updated');
        res.statusCode = 200;
        res.setHeader("Content-type", "application/json");
        res.json(lesson)
    }, (err) => next(err)).catch((err) => next(err))
}).delete(authenticate.verifyUser, authenticate.verifyManager,(req, res, next) => {
    Lesson.findOneAndRemove({name: req.params.lesson})
    .then((reply) => {
        console.log('lesson deleted');
        res.setHeader('Content-type', 'application/json');
        res.send(reply);
    })
})

router.route('/apply/:lesson')
.get(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("GET operation is not supported on /lessons/apply/"+req.params.lesson);
}).post(authenticate.verifyUser, async (req, res, next) => {
    try{
        var lesson = await Lesson.findOne({name: req.params.lesson});
        var user = await User.findById(req.user._id);
        console.log(lesson.quota);
        console.log(lesson.user.length)
    if(lesson.quota > lesson.user.length){
        lesson.user.push(user);
    user.lessons.push(lesson) 
    var savedUser = await user.save();
    var savedLesson = await lesson.save()
    res.statusCode = 200;
    res.setHeader("Content-type", "application/json");
    res.json({success: true})
    }else{
        res.statusCode = 406;
        res.setHeader("Content-type", "application/json");
        res.json({message: "quota is full"})

    }
    }catch{
        err = new Error('something went wrong');
        err.status = 404;
        return next(err) 
    }
}).put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation is not supported on /lessons/apply/"+req.params.lesson);
}).delete(authenticate.verifyUser ,async (req, res, next) => {
    try{
        var lesson = await Lesson.findOne({name: req.params.lesson});
        var user = await User.findById(req.user._id);
        lesson.user.forEach((element, index) => {
            if(element._id.toString()==req.user._id.toString()){
                lesson.user.splice(index, 1);
            }
        })

        user.lessons.forEach((element, index) => {
            if(element.name == req.params.lesson){
                user.lessons.splice(index,1)
            }
        })

        await lesson.save()
        await user.save()
        res.statusCode = 200;
        res.setHeader("Content-type", "application/json");
        res.json({success: true})
    }catch{
        err = new Error("something went wrong");
        err.status = 404;
        return next(err)
    }
})


module.exports = router