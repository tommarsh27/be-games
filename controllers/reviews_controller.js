const { updateReview, showReviews, selectReview, selectComments, addComment } = require('../models/reviews_model')

exports.getReviews = (req, res, next) => {
    console.log(req.query)
    const {category, sort_by, order} = req.query
    showReviews(category, sort_by, order).then((reviews) => {
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

exports.getCommentsByReview = (req, res, next) => {
    const {review_id} = req.params
    selectComments(review_id).then((comments)=>{
        res.status(200).send({comments})
    })
    .catch(next)
}

exports.postComment = (req, res, next) => {
    const {username, comment} = req.body
    const {review_id} = req.params
    const newComment = {
        username, comment, review_id
    }
    addComment(newComment).then((comment) => {
        res.status(201).send({comment})
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