const bookStoreControl = async (req,res,next) => {
        if(req.userId.ownerOfToken == "bookStore"){
            next()
        }else{
            res.status(401).send({message : "you are not a bookstore go back"})
        }
}
 
module.exports = bookStoreControl