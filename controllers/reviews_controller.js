const { updateReview, showReviews, selectReview } = require('../models/reviews_model')

exports.getReviews = (req, res, next) => {
    console.log(req.query)
    const {category} = req.query
    showReviews(category).then((reviews) => {
        res.status(200).send({reviews})
    })
    .catch(next)
}

exports.getReviewById = (req, res, next) => {
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