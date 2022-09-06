const { selectReviews } = require('../models/reviews_model')

exports.getReveiws = (req, res, next) => {
    const {review_id} = req.params
    // console.log(review_id, '< id in cont')
    selectReviews(review_id).then((reviews)=>{
        // console.log(reviews, '< reviews - cont')
        res.status(200).send({reviews})
    })
    .catch(next)
}