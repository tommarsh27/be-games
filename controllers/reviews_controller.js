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
    console.log(inc_votes, '< incvotes cont')
    selectReview(review_id)
    .then((row) => {
        return updateReview(row, inc_votes)
    })
    .then((review)=>{
        console.log(review, '< newRow')
        res.status(200).send({review})
    })
    .catch(next)
}