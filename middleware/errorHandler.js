const errorHandler = (err,req,res,next) => {
    res.status(err.code).send({message : err})
}

module.exports = errorHandler