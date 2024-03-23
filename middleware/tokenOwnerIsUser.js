const bookStoreControl = async (req,res,next) => {
    if(req.userId.ownerOfToken == "user"){
        next()
    }else{
        res.status(401).send({message : "you are not a user go back"})
    }
}
module.exports = bookStoreControl