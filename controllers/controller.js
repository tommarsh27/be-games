const {request} = require('../app')
const { selectCategories } = require('../models/model')

exports.getCategories = (req, res, next) => {
    selectCategories().then((treasures)=>{
        res.status(200).send({treasures})
    })
    .catch(next)
}