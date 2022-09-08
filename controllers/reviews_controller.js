const { updateReview } = require('../models/reviews_model')
const { selectReview } = require('../models/reviews_model')

exports.getReview = (req, res, next) => {
    const {review_id} = req.params
    selectReview(review_id).then((review)=>{
        res.status(200).send({review})
    })
    .catch(next)
}

exports.patchReview = (req, res, next) => {
    const {review_id} = req.params
    const {inc_votes} = req.body
    selectReview(review_id)
    .then((row) => {
        return updateReview(row, inc_votes)
    })
    .then((review)=>{
        res.status(200).send({review})
    })
    .catch(next)
}