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
        <input type="button" class="add-to-cart-button" value = "add to wishList"  id = "addToWishlist">
      </div>
      
      `
    })
   
  }else if(data.bookFound == true){

    bookSection.innerHTML=""
    data.books.forEach(e => {
      bookSection.innerHTML += `

      <div class="card">
        <img src="${e.images[0][0].path.replace('public/','../')}" alt="book image">
        <p>${e.name} </p>
        <p>${e.bookStoreInfos[0].price}.00 tl</p>
        <input type="button" class="add-to-cart-button" value = "add to cart"  id = "addToCart">
      </div>
      
      `
    })
  }
  console.log(data)




    
    return data
})
.then(returnedData => {
    //button action
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

