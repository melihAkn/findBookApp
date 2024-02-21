
const mainPage = (req,res) => {

    res.render('./pages/mainPage')
}
const booksPage = (req,res) => {

    res.render('./pages/booksPage.handlebars')

}


module.exports = {
    mainPage,
    booksPage
}