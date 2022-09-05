const {request} = require('../app')
const { selectCategories } = require('../models/model')

exports.getCategories = (req, res, next) => {
    selectCategories().then((categories)=>{
        // console.log({categories})
        res.status(200).send({categories})
    })
    .catch(next)
}