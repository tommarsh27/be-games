const express = require('express')
const { getCategories } = require('../controllers/categories_controller')
const { getReview, patchReview } = require('../controllers/reviews_controller')
const { getUsers } = require('../controllers/users_controller')

const apiRouter = express.Router()

apiRouter.get('/categories', getCategories)

apiRouter.get('/reviews/:review_id', getReview)
apiRouter.patch('/reviews/:review_id', patchReview)

apiRouter.get('/users', getUsers)

module.exports = apiRouter