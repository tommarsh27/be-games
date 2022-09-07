const { selectReviews } = require('../models/reviews_model')

exports.getReviews = (req, res, next) => {
    const {review_id} = req.params
    selectReviews(review_id).then((review)=>{
        res.status(200).send({review})
    })
    .catch(next)
}