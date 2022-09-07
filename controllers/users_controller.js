const {request} = require('../app')
const { selectUsers } = require('../models/users_model')

exports.getUsers = (req, res, next) => {
    selectUsers().then((users)=>{
        res.status(200).send({users})
    })
    .catch(next)
}