const db = require('../db/connection')

exports.showReviews = () => {
    return db.query(`SELECT * FROM reviews`)
    .then(({rows}) => {
        return rows
    })
}

exports.selectReview = (review_id) => {
    return db.query(`SELECT reviews.*, COUNT(comments.review_id) AS comment_count FROM reviews LEFT JOIN comments ON reviews.review_id = comments.review_id WHERE reviews.review_id = $1 GROUP BY reviews.review_id`, [review_id])
    .then(({rows})=>{
        if(rows.length === 0) {
            return Promise.reject({
                status: 404,
                message: 'Not Found'
            })
        } else {
        rows[0].created_at = rows[0].created_at.toString()
        rows[0].comment_count = parseInt(rows[0].comment_count)
        return rows[0]
        }
    })
}

exports.updateReview = (row, inc_votes) => {
    if(isNaN(inc_votes)) {
        return Promise.reject({
            status: 400,
            message: 'Bad Request'
        })
    } else {
        const newVotes = row.votes + inc_votes
        return db.query(`UPDATE reviews SET votes = $1 WHERE review_id = $2 RETURNING *;`, [newVotes, row.review_id])
        .then(({rows})=>{
            rows[0].created_at = rows[0].created_at.toString()
            return rows[0]
        })
    }
}