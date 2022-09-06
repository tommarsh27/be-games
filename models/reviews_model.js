const db = require('../db/connection')

exports.selectReviews = (review_id) => {
    console.log(review_id, '< id in model')
    return db.query(`SELECT * FROM reviews WHERE review_id = $1`, [review_id])
    .then(({rows})=>{
        rows.forEach(row => row.created_at = row.created_at.toString())
        // console.log(rows[0].created_at, '< rows - model')
        return rows
    })
}