
const mainPage = (req,res) => {

    res.render('./pages/mainPage')
}
const booksPage = (req,res) => {

    res.render('./pages/booksPage')

}

const bookStoresPage = (req,res) => {
    
    res.render('./pages/bookStoresPage')
}

module.exports = {
    mainPage,
    booksPage,
    bookStoresPage
}