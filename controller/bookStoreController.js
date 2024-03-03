const {bookStoresBookModel,bookStoresModel} = require('../model/bookStores')
const {compare} = require('bcrypt')


const profilePage = (req,res) => {

    res.render('./pages/bookStorePages/bookStoreProfilePage',{layout : req.layout})

}

const getUserInfos = async (req,res) => {
    try {
        const getBookStoreInfos = await bookStoresModel.findOne({_id : req.userId}).select("-_id -password -createdAt -updatedAt -__v")
        const getBookStoresBooks = await bookStoresBookModel.findOne({_id : req.userId}).select("-createdAt -updatedAt -__v")
        res.status(200).send({getBookStoreInfos,getBookStoresBooks})
    } catch (error) {
        res.status(500).send({error})
    }
}


const updateInfos = async (req,res) => {
    const userId = req.userId
    console.log(userId)
    try {
        const findUser = await bookStoresModel.findById(userId)
        console.log(findUser)
        const compareUserPassword = await compare(req.body.password , findUser.password)
        if(compareUserPassword){
            //update
            if(req.body.newPassword){
                req.body.password = req.body.newPassword
                await hash(req.body.password, 10).then(async function(hash) {
                    console.log(hash);
                    req.body.password = hash;
                });
                const updateData = {
                    name : req.body.name,
                    username : req.body.username,
                    password : req.body.password,
                    email : req.body.email,
                    phoneNumber : req.body.phoneNumber,
                    physcialAddress : req.body.physcialAddress
                }
                console.log("update data here")
                console.log(updateData)
                //update here
                const updateUserInfos = await bookStoresModel.updateOne({_id : userId},updateData)
            }else{
                //direct update
                const updateData = {
                    name : req.body.name,
                    username : req.body.username,
                    email : req.body.email,
                    phoneNumber : req.body.phoneNumber,
                    physcialAddress : req.body.physcialAddress
                }
                //update here
                const updateUserInfos = await bookStoresModel.updateOne({_id : userId},updateData)
            }
            res.status(200).send({message : "infos updated successfully", updated : true})
        }
        else{
            res.status(400).send({message : "wrong password" , updated : compareUserPassword})
        }
        

    } catch (error) {
        console.log(error)
        res.status(500).send({error})
    }
}


module.exports = {
    profilePage,
    updateInfos,
    getUserInfos,
}