const express = require('express')
const { getCategories } = require('./controllers/categories_controller')
const { getReviews } = require('./controllers/reviews_controller')
const { getUsers } = require('./controllers/users_controller')


const app = express()

app.get('/api/categories', getCategories)

app.get('/api/reviews/:review_id', getReviews)

app.get('/api/users', getUsers)

app.use((err, req, res, next) => {
    if(err.status && err.message) {
        res.status(err.status).send({msg: err.message})
    } else {
        next(err)
    }
})

app.use((err, req, res, next) => {
    if(err.code === '22P02') {
        res.status(400).send({msg: 'Bad Request'})
    } else {
        next(err)
    }
})

app.use((err, req, res, next) => {
    console.log(err, '< unhandled error!')
    res.status(500).send({msg: 'internal server error'})
})

module.exports = app