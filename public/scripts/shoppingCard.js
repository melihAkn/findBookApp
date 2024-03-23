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
        data.forEach((e , index)=> {
            products.innerHTML += `
            <div class="books">
            <div>
                <img class="book-IMG" src="${e.bookImages[0][0].path.replace('public/','../')}">
                <p class="bookName">${e.bookName}</p>
                <p class="bookStoreName">book store name : ${e.bookStoreName}</p>
             
                <div class="bookPriceAndCount">
                    <input type="number" class="bookQuantity" value="${e.quantity}" min="0" max="100">
                    <p class="bookPrice">${e.bookPrice},00</p>
                </div>
                <div class = "otherBookStores${index} otherBookStoresGroup" id="otherBookStores${index}">
            </div>
            </div>
        </div>
    <br>
        
        `
        bookList.innerHTML += `
        <p>${e.bookName} quantity : ${e.quantity} price ${e.bookPrice * e.quantity},00 tl</p>
        `
        totalPrices += parseInt(e.bookPrice) * e.quantity

        const otherBookStores = document.getElementById(`otherBookStores${index}`)
        let count = 1

        if(data[index].otherBookStores.length > 0){
            data[index].otherBookStores.forEach(others => {
                otherBookStores.innerHTML += `
                <label for="otherBookStore${others.name}">${others.name}</label>
                <input type="checkbox" class="otherBookStore" id="otherBookStore${index}_${count}">
                `
                count++
            })
        }

        count = 1

        })
        totalPricesElement.textContent = "total book prices " + totalPrices + ",00 tl"
        booksCountP.textContent = "Books count : " + booksCount

      
        
    

        return data
    })
    .then(data => {
        console.log(data)
        const booksQuantity = document.querySelectorAll('.bookQuantity')
        const updateCardButton = document.getElementById('updateCard')
        booksQuantity.forEach(inputs => {
            inputs.addEventListener('input', e => {
                updateCardButton.hidden = false
                console.log(e.originalTarget.parentElement.parentElement.parentElement.children[0].children[1].textContent.trim())
                for(let item in data){
                    if(data[item].bookName == e.originalTarget.parentElement.parentElement.parentElement.children[0].children[1].textContent.trim() ){
                        data[item].quantity = e.originalTarget.value
                        console.log(data)
                        if(data[item].quantity == 0){
                            
                        }
                    }
                }
               
            })
        })
        
        
        updateCard.addEventListener('click', _ => {
            console.log(data)
        })




        completeOrderButton.addEventListener('click', _ => {
            console.log(data)
            const completeOrderURL = "/user/userAndBookStoresCompleteOrder"
            fetch(completeOrderURL,{
                method : "POST",
                headers : {
                    "Content-Type": "application/json"
                },
                body : JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                console.log(data)
            })
        })

        continueShoppingButton.addEventListener('click', _ => {
            window.location.href = "/books"
        })
    })
    .catch(e => console.error(e))