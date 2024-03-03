const layoutSet =(req,res,next) => {
    if(req.cookies.userToken){
        req.layout = "userPageLayout"
        
    }else if(req.cookies.bookStoresToken){
        req.layout = "bookStoresPageLayout"
    }else{
        req.layout = "main"
    }
    next()
}
module.exports = layoutSet