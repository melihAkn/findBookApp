async function getUserLocation(){
    let userCity = ""
    //geolocaiton api is slow 
    //try alternative and fast
    const getUserCityFromLocalStorage = localStorage.getItem('city')
    console.log(getUserCityFromLocalStorage)
    if(getUserCityFromLocalStorage){

        userCity = getUserCityFromLocalStorage
    }else{
        fetch("https://ipapi.co/json/")
        .then(response => response.json())
        .then(data => {
            console.log(data)
            localStorage.setItem("city",data.city)
            userCity = data.city
        })
    }
  
    return userCity
}

async function getMostSelledBooks(userCity = "Istanbul"){
    const mostSelledBooksCard = document.getElementById('mostSelledBooks')
   const getMostSelledBooksURL = "/getMostSelledBooksByCity"
   const dataForMostSelledBooks = {
    city : userCity
   }
   fetch(getMostSelledBooksURL,{
    method : "POST",
    headers : {
        "Content-Type": "application/json"
    },
    body : JSON.stringify(dataForMostSelledBooks)
   })
   .then(response => response.json())
   .then(data => {
    data.mostSelledBooks.forEach(e => {
        mostSelledBooksCard.innerHTML += `

    <div class="booksCard">
        <img src="../${e.images[0].path.replace("public","")}" class="bookIMG">
        <p>${e.name}</p>
        <p>${e.bookStoreInfos[0].price},00 tl</p>
        <div class="buttonGroup">
            <input type="button" value="sepete ekle" id="addToCart">
            <input type="button" value="favoriye ekle" id="favorite">
        </div>
    </div>
    
    `
    })
   })
   .catch(e => console.error(e)) 
}

async function getBooksByMostPopularCategory(userCity = "Istanbul"){
    const booksByMostPopularCategoryCard = document.getElementById('booksByMostPopularCategory')
    const getMostSelledBooksURL = "/getBooksByMostPopularCategory"
    const dataForMostPopularCategoryBooks = {
     city : userCity
    }
    fetch(getMostSelledBooksURL,{
     method : "POST",
     headers : {
         "Content-Type": "application/json"
     },
     body : JSON.stringify(dataForMostPopularCategoryBooks)
    })
    .then(response => response.json())
    .then(data => {
     data.books.forEach(e => {
        booksByMostPopularCategoryCard.innerHTML += `

    <div class="booksCard">
        <img src="../${e.images[0].path.replace("public","")}" class="bookIMG">
        <p>${e.name}</p>
        <p>${e.bookStoreInfos[0].price},00 tl</p>
        <div class="buttonGroup">
            <input type="button" value="sepete ekle" id="addToCart">
            <input type="button" value="favoriye ekle" id="favorite">
        </div>
    </div>
    
    `
     })

    })
    .catch(e => console.error(e)) 
}


async function getNewlyAddedBooks(userCity = "Istanbul"){
    const newlyAddedBooksCard = document.getElementById('newlyAddedBooks')
    const getMostSelledBooksURL = "/getNewlyAddedBooks"
    const dataForNewlyAddedBooks = {
     city : userCity
    }
    fetch(getMostSelledBooksURL,{
     method : "POST",
     headers : {
         "Content-Type": "application/json"
     },
     body : JSON.stringify(dataForNewlyAddedBooks)
    })
    .then(response => response.json())
    .then(data => {
        
        console.log("most")
        console.log(data)
        console.log("most")
     //html insert
     data.books.forEach(e => {
        newlyAddedBooksCard.innerHTML += `
        <br>
    <div class="booksCard">
        <img src="../${e.images[0].path.replace("public","")}" class="bookIMG">
        <p>${e.name}</p>
        <p>${e.bookStoreInfos[0].price},00 tl</p>
        <div class="buttonGroup">
            <input type="button" value="sepete ekle" id="addToCart">
            <input type="button" value="favoriye ekle" id="favorite">
        </div>
    </div>
    <br>
    `
     })
    })
    .catch(e => console.error(e)) 
}

async function getPopularCategorys(userCity = "Istanbul"){
    const getPopularCategorysCard = document.getElementById('popularCategories')
    const getMostSelledBooksURL = "/getPopularCategorys"
    const dataForPopularCategorys = {
     city : userCity
    }
    fetch(getMostSelledBooksURL,{
     method : "POST",
     headers : {
         "Content-Type": "application/json"
     },
     body : JSON.stringify(dataForPopularCategorys)
    })
    .then(response => response.json())
    .then(data => {

      data.popularCategorys.forEach(e => {
        console.log(e.bookCategory)
        getPopularCategorysCard.innerHTML += `

        <p>${e.bookCategory}</p>
        `
  })
    })
    .catch(e => console.error(e)) 
    
}

async function getMostReliableBookStores(userCity = "Istanbul"){
    const getMostSelledBooksURL = "/getMostReliableBookStores"
    const dataForMostReliableBookStores = {
     city : userCity
    }
    fetch(getMostSelledBooksURL,{
     method : "POST",
     headers : {
         "Content-Type": "application/json"
     },
     body : JSON.stringify(dataForMostReliableBookStores)
    })
    .then(response => response.json())
    .then(data => {
     console.log(data)
     //html insert
    })
    .catch(e => console.error(e)) 
}

document.addEventListener('DOMContentLoaded',async  _ =>{
    const userLocation = await getUserLocation()
    await getMostSelledBooks(userLocation)
    await getBooksByMostPopularCategory(userLocation)
    await getNewlyAddedBooks(userLocation)
    await getPopularCategorys(userLocation)
    await getMostReliableBookStores(userLocation)
})

