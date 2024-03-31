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
                    <input type="button" id="buyLater" value = "buy later">
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
                <label for="otherBookStore${others.name}">${others.name} ${others.price},00 tl</label>
                <input type="checkbox" class="otherBookStore" id="otherBookStore${index}_${count}">
                `
                count++
            })
        }

        count = 1

       
        })
        totalPricesElement.textContent = "total book prices " + totalPrices + ",00 tl"
        booksCountP.textContent = "Books count : " + booksCount

      const bookStoresGroup = document.querySelectorAll('.otherBookStore')
      console.log(bookStoresGroup)
      bookStoresGroup.forEach(checkbox => {
        checkbox.addEventListener('change', e => {
        

        })
      })
        
    

        return data
    })
    .then(data => {
        console.log(data)
        const booksQuantity = document.querySelectorAll('.bookQuantity')
        const updateCardButton = document.getElementById('updateCard')
        booksQuantity.forEach(inputs => {
            inputs.addEventListener('change', e => {
                updateCardButton.hidden = false
              
                for(let item in data){
                    if(data[item].bookName == e.originalTarget.parentElement.parentElement.parentElement.children[0].children[1].textContent.trim() ){
                        data[item].quantity = e.originalTarget.value
                        console.log(data[item])
                            
                    }
                }
               
            })
     
        })
        
        updateCard.addEventListener('click', _ => {

            console.log(data)
            const deleteItemUrl = "/user/userOrBookStoresUpdateOrDeleteItem"
            fetch(deleteItemUrl,{
                method : "POST",
                headers : {
                    "Content-Type": "application/json"
                },
                body : JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                if(!data.error){
                    alert(data.message)
                    setTimeout(() => {
                    location.reload()
                    }, 1000)
                }else{
                    alert(data.error)
                }
                 
                                    
            })
            .catch(e => {
                console.error(e)
            })




        })

        const buyLaterButtons = document.querySelectorAll('#buyLater')
        buyLaterButtons.forEach(buyLaterButton => {
            buyLaterButton.addEventListener('click', _ => {
                const buyLaterURL = "/user/buyLaterThisBook"
                console.log(buyLaterButton.parentElement.parentElement.children[1].textContent.trim())
                console.log(buyLaterButton.parentElement.parentElement.children[2].textContent.split(':')[1].trim())
                for(let item in data){
                    if(data[item].bookName == buyLaterButton.parentElement.parentElement.children[1].textContent.trim() && data[item].bookStoreName == buyLaterButton.parentElement.parentElement.children[2].textContent.split(':')[1].trim() ){
                        console.log(data[item])
                        fetch(buyLaterURL,{
                            method : "POST",
                            headers : {
                                "Content-Type": "application/json"
                            },
                            body : JSON.stringify(data[item])
                        })
                        .then(response => response.json())
                        .then(data => {
                            alert(data.message)
                            setTimeout(() => {
                                location.reload()
                            }, 1000);
                            console.log(data)
                        })
                        .catch(e => console.error(e))
                    }
                }

                
                /*
                
    
    */
    
            })
        })
   
        completeOrderButton.addEventListener('click', _ => {
                let falseCount = 0
                for(let i = 0; i < data.length; i++){
                    for(let k = i + 1; k <= data.length - 1; k++){
                        if(data[i].bookStoreName != data[k].bookStoreName){
                            falseCount += 1
                        }
                        console.log(`[${i}] [${k}]`)
                    }
                }
                if(falseCount == 0) {
                    const userAndBookStoresCompleteOrderURL = "/user/userAndBookStoresCompleteOrder"
                    fetch(userAndBookStoresCompleteOrderURL,{
                        method : "POST",
                        headers : {
                            "Content-Type": "application/json"
                        },
                        body : JSON.stringify(data)
                    })
                    .then(response => response.json())
                    .then(data => {
                        console.log(data)
                        alert(data.message)
                    })
                    .catch(e => console.error(e))

                }else{
                    alert("You can only order books from one bookstore at a time.")
                }
        })
        continueShoppingButton.addEventListener('click', _ => {
            window.location.href = "/books"
        })
    })
    .catch(e => console.error(e))