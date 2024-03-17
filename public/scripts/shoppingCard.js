const products = document.getElementById('products')
const booksCountP = document.getElementById('productsCount')
const bookList = document.getElementById('bookList')
const totalPricesElement = document.getElementById('totalPrices')
const completeOrderButton = document.getElementById('completeOrder')
const continueShoppingButton = document.getElementById('continueShopping')




const getUsersOrBookStoresCardDetails = "/user/userOrBookStoresGetCardDetails"
fetch(getUsersOrBookStoresCardDetails)
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
        let totalPrices = 0
        let booksCount = data.length
        data.forEach(e => {
            products.innerHTML += `
        <div class="books">
        <div>
            <img class="book-IMG" src="${e.bookImages[0][0].path.replace('public/','../')}">
            <p class="bookName">${e.bookName}</p>
            <div class="bookPriceAndCount">
                <input type="number" class="bookQuantity" value="${e.quantity}">
                <p class="bookPrice">${e.bookPrice},00</p>
                
            </div>
            
            <p class="bookStoreName">book store name : ${e.bookStoreName}</p>
            
        </div>
        </div>

    </div>
    <br>
        
        
        `
        bookList.innerHTML += `
        <p>book name : ${e.bookName} ${e.bookPrice},00 tl</p>
        `
       
        totalPrices += parseInt(e.bookPrice)

        })
        totalPricesElement.textContent = "total book prices " + totalPrices + ",00 tl"
        booksCountP.textContent = "Books count : " + booksCount


        return data
    })
    .then(data => {
        completeOrderButton.addEventListener('click', _ => {
            
        })

        continueShoppingButton.addEventListener('click', _ => {
            window.location.href = "/books"
        })
    })
    .catch(e => console.error(e))