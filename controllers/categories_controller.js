const { selectCategories } = require('../models/categories_model')

exports.getCategories = (req, res, next) => {
    selectCategories().then((categories)=>{
        res.status(200).send({categories})
    })
    .catch(next)
}