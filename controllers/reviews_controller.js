const { selectReviews } = require('../models/reviews_model')

exports.getReveiws = (req, res, next) => {
    const {review_id} = req.params
    selectReviews(review_id).then((reviews)=>{
        res.status(200).send({reviews})
    })
    .catch(next)
}