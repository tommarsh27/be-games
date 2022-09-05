const db = require('../db/connection')

exports.selectCategories = () => {
    return db.query(queryStr, queryValues)
    .then(({rows})=>{
        return rows
    })
}