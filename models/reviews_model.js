const db = require('../db/connection')

exports.selectReviews = (review_id) => {
    return db.query(`SELECT * FROM reviews WHERE review_id = $1`, [review_id])
    .then(({rows})=>{
        if(rows.length === 0) {
            return Promise.reject({
                status: 404,
                message: 'Not Found'
            })
        } else {
        rows.forEach(row => row.created_at = row.created_at.toString())
        return rows
        }
    })
}