const products = document.getElementById('products')
const booksCountP = document.getElementById('productsCount')
const bookList = document.getElementById('bookList')
const totalPricesElement = document.getElementById('totalPrices')
const completeOrderButton = document.getElementById('completeOrder')
const continueShoppingButton = document.getElementById('continueShopping')
const updateCardButton = document.getElementById('updateCard')


const getUsersOrBookStoresCardDetails = "/user/userOrBookStoresGetCardDetails"
fetch(getUsersOrBookStoresCardDetails)
    .then(response => {

        console.log(response)
        if(response.redirected == true){

            alert("lutfen giriş yapın. 3 saniye içinde giriş sayfasına yönlendiriliceksiniz.")
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
            console.log(e.bookImages[0][0])
            products.innerHTML += `
            <div class="books">
            <div class = "allBooks">
                <img class="book-IMG" src="${e.bookImages[0].path.replace('public/','../')}">
                <p class="bookName">${e.bookName}</p>
                <p class="bookStoreName">mağaza ismi : ${e.bookStoreName}</p>
             
                <div class="bookPriceAndCount">
                    <input type="number" class="bookQuantity" value="${e.quantity}" min="0" max="100">
                    <p class="bookPrice">${e.bookPrice},00</p>
                    <input type="button" id="buyLater" value = "daha sonra al">
                </div>
                <div class = "otherBookStores${index} otherBookStoresGroup" id="otherBookStores${index}">
            </div>
            </div>
        </div>
     <br>
        
        `
        bookList.innerHTML += `
        <p>${e.bookName} adet : ${e.quantity} fiyat : ${e.bookPrice * e.quantity},00 tl</p>
        `
        totalPrices += parseInt(e.bookPrice) * e.quantity

        const otherBookStores = document.getElementById(`otherBookStores${index}`)
        let count = 1

        if(data[index].otherBookStores.length > 0){
            data[index].otherBookStores.forEach(others => {
                otherBookStores.innerHTML += `
                <label for="otherBookStore${others.name}">${others.name} ${others.price},00 tl</label>
                <input type="checkbox" class="otherBookStore" name="bookStoresList" id="otherBookStore${index}_${count}">
                `
                count++
            })
        }

        count = 1

       
        })
        totalPricesElement.textContent = "toplam kitap fiyatı " + totalPrices + ",00 tl"
        booksCountP.textContent = "kitap sayısı : " + booksCount
        const cards = document.querySelectorAll('.allBooks')
        cards.forEach(card => {
            const checkboxes = card.querySelectorAll('input[type="checkbox"][name="bookStoresList"]')
            checkboxes.forEach(checkbox => {
                checkbox.addEventListener('change', function() {
                  checkboxes.forEach(cb => {
                    if (cb !== this) {
                      cb.checked = false;
                    }
                  })
                })
              })
        })
        
     
      const bookStoresGroup = document.querySelectorAll('.otherBookStore')
      
      bookStoresGroup.forEach(checkbox => {
        
        checkbox.addEventListener('change', e => {
            completeOrderButton.hidden = true
            updateCardButton.hidden = false
            const selectedBookStoreName = checkbox.parentElement.parentElement.children[2].textContent.replace("book store name : ","")
            const selectedBookName = e.originalTarget.parentElement.parentElement.parentElement.children[0].children[1].textContent.trim()
            for(let item in data){

                if(data[item].bookName == selectedBookName  && data[item].bookStoreName == selectedBookStoreName ){
                    const changedValue = e.target.previousElementSibling.textContent.split(" ")
                    const bookStoreInfoForChange = data[item].otherBookStores.find(e => e.name == changedValue[0] && e.price == changedValue[1].split(",")[0])
                    data[item].bookPrice = bookStoreInfoForChange.price.toString()
                    data[item].bookStoreName = bookStoreInfoForChange.name
                    data[item].bookStoreId = bookStoreInfoForChange._id
                }
            }
        })
      })
        return data
    })
    .then(data => {
        console.log(data)
        const booksQuantity = document.querySelectorAll('.bookQuantity')
        
        booksQuantity.forEach(inputs => {
            inputs.addEventListener('change', e => {
                completeOrderButton.hidden = true
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
                        originalData = undefined
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
                    alert("tek seferde sadece bir mağazadan kitap alabilirsiniz.")
                }
        })
        continueShoppingButton.addEventListener('click', _ => {
            window.location.href = "/books"
        })
    })
    .catch(e => console.error(e))