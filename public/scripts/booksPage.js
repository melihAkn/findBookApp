//perform search
const searchButton = document.getElementById('performSearch')
const searchText = document.getElementById('searchInput')
const citySelectOption = document.getElementById('citys')
const bookSection = document.getElementById('booksSection')
async function performSearch(city = citySelectOption.value,bookName = ""){
  const searchParameters = {
    bookName,
    searchedCity : city
}
  fetch('/performSearch',{
    method : "POST",
    headers : {
      "Content-Type": "application/json"
    },
    body : JSON.stringify(searchParameters)
})
.then(response => response.json())
.then(data => {
  if(data.bookFound == false){
    alert(data.message)
    bookSection.innerHTML=""
    data.findAllBooks.forEach(e => {
      
      bookSection.innerHTML += `

      <div class="card">
        <img src="${e.images[0][0].path.replace('public/','../')}" alt="book image">
        <p>${e.name} </p>
        <p>0.00 tl</p>
        <input type="button" class="add-to-wishlist-button" value = "add to wishList"  id = "addToWishlist">
      </div>
      
      `
    })
   
  }else if(data.bookFound == true){

    bookSection.innerHTML=""
    data.books.forEach(e => {
      bookSection.innerHTML += `

      <div class="card">
        <img src="${e.images[0][0].path.replace('public/','../')}" alt="book image" class="bookIMG">
        <p class="bookName">${e.name} </p>
        <p>${e.bookStoreInfos[0].price}.00 tl</p>
        <input type="button" class="add-to-cart-button" value = "add to cart"  id = "addToCart">
      </div>
      
      `
    })
  }




    
    return data
})
.then(returnedData => {
  //button action
  const addToCartButton = document.querySelectorAll('.add-to-cart-button')
  const addToWishListButton = document.querySelectorAll('.add-to-wishlist-button')
  const bookNameP = document.querySelectorAll('.bookName')
  const bookImgs = document.querySelectorAll('.bookIMG')
  //link to the full book details
  function findBookId(bookName){
    let bookId , bookStoreId
    let bookStoreInfosArray = []
    let returnedArray = []
    returnedData.books.forEach(books => {
      if(books.name == bookName){
        returnedArray.push({bookId : books._id})
        bookId = books._id
        books.bookStoreInfos.forEach(e => {
          bookStoreInfosArray.push(e)
        })
      }

    })
    bookStoreInfosArray.sort((a, b) => a.price - b.price)
    return {bookId , bookStoreInfosArray}
    
    
  }
  bookNameP.forEach(bookNames => {
    bookNames.addEventListener('click' ,_ => {
      const bookName =bookNames.parentElement.children[1].textContent.trim()
      
      window.location.href = `/books/${findBookId(bookName).bookId}`
    
    })
  })

  bookImgs.forEach(bookImg => {
    bookImg.addEventListener('click',_ =>{
      const bookName = bookImg.parentElement.children[1].textContent.trim()
      window.location.href = `/books/${findBookId(bookName).bookId}`
    })

  })

  addToCartButton.forEach(addToCart => {
    addToCart.addEventListener('click',_=>{
      const bookName = addToCart.parentElement.children[1].textContent.trim()

      const shoppingCard = {
        bookId : findBookId(bookName).bookId,
        sellerBookStoreInfos : findBookId(bookName).bookStoreInfosArray[0],
        quantity : 1,
        bookName

      }
          //add to user cart
          const addToBookUserOrBookStoresCart = "/user/userAndBookStoresAddToCart"
          fetch(addToBookUserOrBookStoresCart,{
            method : "POST",
            headers : {
              "Content-Type": "application/json"
            },
            body : JSON.stringify(shoppingCard)
          })
          .then(response => {
            console.log(response)
            if(response.redirected == true){
              alert("please login you are redirected in 3 seconds")
              setTimeout(() => {
                window.location.href = "/login"
              }, 3000);
            }else{
              return response.json()
            }
          })
          .then(data => {
            alert(data.message)


          }).catch(e => console.error(e))
        
      })
    })

  addToWishListButton.forEach(addToWishList => {
    addToWishList.addEventListener('click',_=>{

    })
  })




})
.catch(e => console.log(e))




}

searchButton.addEventListener('click', _ => {
    performSearch(citys.value,searchText.value)
   
})

document.addEventListener('DOMContentLoaded', async _ => {
  await getCitys()
  await performSearch()
})

