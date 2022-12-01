const express = require('express')
const apiRouter = require('./routers/api.router')
const cors = require('cors');

const app = express()

app.use(cors());

app.use(express.json())

app.use('/api', apiRouter)

app.get('/', (req, res) => {
    res.status(200).send({msg: 'app online'})
})

app.all('/*', (req, res, next) => {
    res.status(404).send({msg: 'Path Not Found'})
})

app.use((err, req, res, next) => {
    if(err.status && err.message) {
        res.status(err.status).send({msg: err.message})
    } else {
        next(err)
    }
})

app.use((err, req, res, next) => {
    const errorCodes = ['22P02', '23502']
    if(errorCodes.includes(err.code)) {
        res.status(400).send({msg: 'Bad Request'})
    } else {
        next(err)
    }
})

app.use((err, req, res, next) => {
    if(err.code === '23503') {
        res.status(404).send({msg: 'Not Found'})
    } else {
        next(err)
    }
})

app.use((err, req, res, next) => {
    console.log(err, '< unhandled error!')
    res.status(500).send({msg: 'internal server error'})
})

module.exports = app