const db = require('../db/connection')

exports.showReviews = async (category) => {

    
    let queryStr = `SELECT * FROM reviews`

    const queryVals = []
    if(category) {
        console.log(category, 'categ modl')
        if(!isNaN(category)) {
            return Promise.reject({ status: 400, message: 'Bad Request' })
        }
            const dbOutput = await db.query(
              'SELECT * FROM categories WHERE slug=$1;',
              [category]
            );
          
            if (dbOutput.rows.length === 0) {
                console.log(dbOutput.rows, 'dbOut')
              return Promise.reject({ status: 404, message: 'Not Found' });
            }

        queryStr += ` WHERE category=$1`
        queryVals.push(category)
    }
    queryStr += ` ORDER BY created_at DESC`
    return db.query(queryStr, queryVals)
    .then(({rows}) => {
        if (rows[0]) {
            rows[0].created_at = rows[0].created_at.toString()
        }
        return rows
        }
    )
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