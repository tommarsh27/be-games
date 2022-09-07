const db = require('../db/connection')

exports.selectReview = (review_id) => {
    return db.query(`SELECT * FROM reviews WHERE review_id = $1`, [review_id])
    .then(({rows})=>{
        if(rows.length === 0) {
            return Promise.reject({
                status: 404,
                message: 'Not Found'
            })
        } else {
        rows[0].created_at = rows[0].created_at.toString()
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
        console.log(newVotes, 'nvs', row.review_id, 'revid')
        return db.query(`UPDATE reviews SET votes = $1 WHERE review_id = $2 RETURNING *;`, [newVotes, row.review_id])
        .then(({rows})=>{
            rows[0].created_at = rows[0].created_at.toString()
            console.log(rows)
            return row[0]
        })
    }
}