const express = require('express')
const { getCategories } = require('./controllers/controller')
const { getUsers } = require('./controllers/users_controller')


const app = express()

app.use(express.json())

app.get('/api/categories', getCategories)

app.get('/api/users', getUsers)

app.use((err, req, res, next) => {
    if(err.status && err.message) {
        res.status(err.status).send({msg: err.message})
    } else {
        next(err)
    }
})

app.use((err, req, res, next) => {
    console.log(err, '< unhandled error!')
    res.status(500).send({msg: 'internal server error'})
})

module.exports = app