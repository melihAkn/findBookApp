//perform search
const searchButton = document.getElementById('performSearch')
const searchText = document.getElementById('searchInput')
const citySelectOption = document.getElementById('citys')
const bookSection = document.getElementById('booksSection')
const searchContainer = document.getElementById('searchContainer')
async function placeDetailedBook(bookObject) {
  let bookSectionInnerHtmlBackup = bookSection.innerHTML



   bookSection.innerHTML = `
   
<input type="button" value="go back to books page" class="goBackButton" id="goBackButton">
<div class="container">
   <div id="imagesSlider">
       <img src="${bookObject.images[0][0].path.replace('public/','../')}" width="350px" height="500px">
   </div>


   <div id="bookInfos" class="bookInfos">
       <p>Book name : ${bookObject.name}</p>
       <p>Book description : ${bookObject.description}</p>

       <div id="otherBookInfos" class="otherBookInfos">
           <p>page count : ${bookObject.pageCount}</p>
           <p> author : ${bookObject.author}</p>
           <p>book ISBN : ${bookObject.ISBN}</p>
       </div>

   </div>

   <div id="bookBuy" class="bookBuy">
       <input type="button" value="Add to card" id="addToCart">
       <input type="button" value="Add to favorite" id="addToFavorite">

       <p>lowest price : ${bookObject.bookStoreInfos[0].price}.00 tl</p>
       <p> seller : ${bookObject.bookStoreInfos[0].bookStoreName} </p>
       <p> stock : ${bookObject.bookStoreInfos[0].stockInfo} </p>
       <p>other bookStores</p>
       <div id="otherBookStores" class = "otherBookStores">
      
       </div>
       
   </div>



</div>

<div id="commentSection" class="commentSection">
       <div class="commentTitle">
           <p>Yorum Yaz</p>
           <input type="text" id="newCommentText" class="newCommentText" >
           <button type="submit" class="addComment" id="addComment">Gönder</button>
       </div>
    
       <br>
       <div class="commentsList">
           <div class="comment">
               <div class="commentOwner">
                   <p class="username">kitapkurdu2779</p>
                   <p class="commentDate">22 Şubat 2024</p>
               </div>
               <p class="commentText">
                   yorum yorum yorum yorum
               </p>
               <div class="commentİnteract">
                   <p>Do you agree with this comment?</p>
                   <button type="button" class="yesButton" id="yesButton">yes (0)</button>
                   <button type="button" class="noButton" id="noButton">no (0)</button>
               </div>
           </div>
       </div>
</div>

   
   `
 




   const otherBookStores = document.getElementById('otherBookStores')
   bookObject.bookStoreInfos.forEach(bookStore => {
   
      otherBookStores.innerHTML += `
      <label for="${bookStore.bookStoreId}">
       <input type="checkbox" name="bookStoresList" id="${bookStore.bookStoreId}" value="${bookStore.bookStoreId}"> ${bookStore.bookStoreName} price : ${bookStore.price}.00 tl  <br>
      </label>
      `
    
  
   })
   document.getElementById(`${bookObject.bookStoreInfos[0].bookStoreId}`).checked = true

   const checkboxes = document.querySelectorAll('input[type="checkbox"][name="bookStoresList"]')
   checkboxes.forEach(checkbox => {
     checkbox.addEventListener('change', function() {
       checkboxes.forEach(cb => {
         if (cb !== this) {
           cb.checked = false;
         }
       })
     })
   })
   console.log(checkboxes)
   //finish html adding so event listeners should be above this line
   const addToCartButton = document.getElementById('addToCart')
   const addToFavoriteButton = document.getElementById('addToFavorite')
   addToCartButton.addEventListener('click',_=>{
    const shoppingCard = {
      bookId : bookObject._id,
      sellerBookStoreInfos : "",
      quantity : 1,
      bookName : bookObject.name

    }
    checkboxes.forEach(checkbox => {
      if(checkbox.checked == true){
        console.log(checkbox)
        const getSelectedBookStoreInfos = bookObject.bookStoreInfos.find(e => e.bookStoreId === checkbox.value)
        if(getSelectedBookStoreInfos){
          shoppingCard.sellerBookStoreInfos = getSelectedBookStoreInfos
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
             }, 1500);
           }else{
             return response.json()
           }
         })
         .then(data => {
           alert(data.message)
         }).catch(e => console.error(e))
        }else{
          alert("selected book store not found try to buy another bookstore")
        }
      }
    })
  })

    addToFavoriteButton.addEventListener('click', _ => {
      const favoriteCard = {
        bookId : bookObject._id
        }

        const addToBookUserOrBookStoresCart = "/user/userAndBookStoresAddFavorite"
         fetch(addToBookUserOrBookStoresCart,{
           method : "POST",
           headers : {
             "Content-Type": "application/json"
           },
           body : JSON.stringify(favoriteCard)
         })
         .then(response => {
           console.log(response)
           if(response.redirected == true){
             alert("please login you are redirected in 3 seconds")
             setTimeout(() => {
               window.location.href = "/login"
             }, 1500);
           }else{
             return response.json()
           }
         })
         .then(data => {
           alert(data.message)
         }).catch(e => console.error(e))



    })
   
     
   //commnet section add comment 
   const newCommentText = document.getElementById('newCommentText')
   const addCommnet = document.getElementById('addComment')
   const yesButton = document.getElementById('yesButton')
   const noButton = document.getElementById('noButton')
   addCommnet.addEventListener('click', asyc_ => {



   })
  const goBackButton = document.getElementById('goBackButton')
  goBackButton.addEventListener('click',async _ => {
    await performSearch()
    searchContainer.style.display = ""
  })

 }

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
    data.books.forEach(e => {
      
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
  console.log(returnedData)
  //button action
  const addToCartButton = document.querySelectorAll('.add-to-cart-button')
  const addToWishListButton = document.querySelectorAll('.add-to-wishlist-button')
  const bookNameP = document.querySelectorAll('.bookName')
  const bookImgs = document.querySelectorAll('.bookIMG')
  //link to the full book details
  function findBookId(bookName){
    let returnedArray = []
    returnedData.books.forEach((books,index) => {
      if(books.name == bookName){
        returnedArray.push(books)
      }
    })
    return returnedArray
    
    
  }


  console.log(bookSection)
  bookNameP.forEach(bookNames => {
    bookNames.addEventListener('click' ,_ => {
      const bookName =bookNames.parentElement.children[1].textContent.trim()
      const returnedBookData = findBookId(bookName)[0]
      searchContainer.style.display = "none"
      placeDetailedBook(returnedBookData)
    })
  })

  bookImgs.forEach(bookImg => {
    bookImg.addEventListener('click',_ =>{
      const bookName = bookImg.parentElement.children[1].textContent.trim()
      const returnedBookData = findBookId(bookName)[0]
      searchContainer.style.display = "none"
      placeDetailedBook(returnedBookData)
      
    })

  })
  
  addToCartButton.forEach(addToCart => {
    addToCart.addEventListener('click',_=>{
      const bookName = addToCart.parentElement.children[1].textContent.trim()
      const shoppingCard = {
        bookId : findBookId(bookName)[0]._id,
        sellerBookStoreInfos : findBookId(bookName)[0].bookStoreInfos[0],
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
              }, 1500);
            }else{
              return response.json()
            }
          })
          .then(data => {
            alert(data.message)


          }).catch(e => console.error(e))
        
      })
    })
    //code replication in here
  addToWishListButton.forEach(addToWishList => {
    addToWishList.addEventListener('click',_=>{
      const bookName = addToWishList.parentElement.children[1].textContent.trim()
      const shoppingCard = {
        bookId : findBookId(bookName)[0]._id,
        quantity : 1,
        bookName

      }
          //add to user wishlist
          const addToWishListURL = "/user/userAndBookStoresWishList"
          fetch(addToWishListURL,{
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

