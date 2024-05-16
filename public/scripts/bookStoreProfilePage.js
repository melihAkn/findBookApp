//html elements
const userActionsResult = document.getElementById('userActionResults')
const updateUserInfosButton = document.querySelector('#bookStoreUpdateInfos')
const getBookStoresBooksButton = document.getElementById('bookStoreGetBooks')
const addBooksButton = document.getElementById('bookStoreAddBooks')
const getBooksButton = document.getElementById('bookStoreGetBooks')
const getOrdersButton = document.getElementById('bookStoreGetOrders')
//fetch the user ınfos
const getUserInfosURL = "/bookStores/getUserInfos"
fetch(getUserInfosURL)
.then(response => {
  if (!response.ok) {
    if (response.status === 401) {
        window.location.href = '/login';
    } else {
        console.error('hata:', response.statusText);
    }
} else {
    return response.json();
}

})
.then(data => {
    updateUserInfosButton.addEventListener('click', _ => {
        userActionsResult.innerHTML = `
        <iframe name="noPageReload" style="display:none;"></iframe>
    <form id="updateForm" target = "noPageReload">
      
    <!--
    bookstores profile picture added soon as posible now is it not necessary 
    <label for="userProfilePicture"><p>profil resmi: </p></label>
    <img id="userProfilePicture" name = "userProfilePicture" class="userProfilePicture"  src="https://bulma.io/images/placeholders/96x96.png" alt="Placeholder image">
    </br>
    <input type="file" id="fileInput" accept="image/*">
    !-->
    <label for="name"><p>mağaza ismi: </p></label>
    <input type="text" name="name" id="name" class="input" placeholder="mağaza isminiz" value="${data.getBookStoreInfos.name}" required><br>
  
    <label for="username"><p>kullanıcı adı: </p></label>
    <input type="text" name="username" id="username" class="input" placeholder="kullanıcı adınız" value="${data.getBookStoreInfos.username}" required><br>
  
    <label for="email"><p>email: </p></label>
    <input type="email" name="email" id="email" class="input" placeholder="email" value="${data.getBookStoreInfos.email}" required><br>
              
    <label for="currentPassword"><p>şuanki şifreniz: * </p></label>
    <input type="password" name="currentPassword" id="currentPassword" class="input" required><br>
    <p>şifrenizi güncellemek istemiyorsanız alttaki iki alanıda boş bırakın</p>
              
    <label for="newPassword"><p>yeni şifrenizi girin: </p></label>
    <input type="password" name="newPassword" id="newPassword" class="input" ><br>
              
    <label for="newPasswordAgain"><p>yeni şifrenizi tekrar girin: </p></label>
    <input type="password" name="newPasswordAgain" id="newPasswordAgain" class="input" ><br>
  
    <label for="phoneNumber"><p>telefon numaranız: </p></label>
    <input type="text" name="phoneNumber" id="phoneNumber" class="input" placeholder="telefon numaranız" value="${data.getBookStoreInfos.phoneNumber}" required><br>
         
    <label for="physcialAddress"><p>fiziksel adresiniz: </p></label>
    <input type="text" name="physcialAddress" id="physcialAddress" class="input" value="${data.getBookStoreInfos.physcialAddress}" required><br>
  
    <label for="city">city:</label>
    <select class="cityList" id="citys" name="şehir">
      <option>select</option>
    </select><br><br>
  
    <button class="button" id="updateButton"> bilgileri guncelle</button>
        </form>
        `
        getCitys(data.city)
        //sending the formData
  const updateForm = document.getElementById("updateForm")
  const currentPasswordInput = document.getElementById('currentPassword')
  const newPasswordInput = document.getElementById('newPassword')
  const newPasswordAgainInput = document.getElementById('newPasswordAgain')

  function controlTyping() {
    if(newPasswordInput.value.length > 0 || newPasswordAgainInput.value.length > 0){
      newPasswordInput.required = true
      newPasswordAgainInput.required = true
    }else{
        newPasswordInput.required = false
      newPasswordAgainInput.required = false
    }
  }
  newPasswordInput.addEventListener('input',controlTyping)
  newPasswordAgainInput.addEventListener('input',controlTyping)

  updateForm.addEventListener('submit', _ => {
    const updateFormData = new FormData(updateForm)
    const newPasswordValue = newPasswordInput.value;
    const newPasswordAgainValue = newPasswordAgainInput.value;

    if (newPasswordValue !== newPasswordAgainValue) {
        alert("şifreler eşleşmiyor");
    } else {

        const updateBookStoreInfosData = {
          name : updateFormData.get('name'),
          username : updateFormData.get('username'),
          email : updateFormData.get('email'),
          password : updateFormData.get('currentPassword'),
          phoneNumber : updateFormData.get('phoneNumber'),
          physcialAddress : updateFormData.get('physcialAddress'),

        }
        if(newPasswordValue.length > 0 && newPasswordAgainValue.length > 0){
          updateBookStoreInfosData.newPassword = newPasswordValue
          updateBookStoreInfosData.newPasswordAgain = newPasswordAgainValue
        }
        const updateUserInfosURL = "/bookStores/updateInfos"
        fetch(updateUserInfosURL , {
          method : "POST",
          headers : {
            "Content-Type" : "application/json"
          },
          body : JSON.stringify(updateBookStoreInfosData)
          
        })
        .then(response => response.json())
        .then(data => {
          if(data.updated == false){
            alert(data.message)
          }else{
            alert(data.message)
      
          }
          newPasswordInput.value = ""
          newPasswordAgainInput.value = ""
          currentPasswordInput.value = ""
        })
        .catch(e => console.log(e))
    }

    })


})

addBooksButton.addEventListener('click', _ => {
  userActionsResult.innerHTML = `
  <iframe name="noPageReload" style="display:none;"></iframe>
  <form id="updateForm" target = "noPageReload" action="/bookStores/addBook" method="post" enctype="multipart/form-data" >


  <input type="file" name="images" multiple accept="image/*">

  <label for="bookname"><p>kitabın ismi: </p></label>
  <input type="text" name="bookName" id="bookName" class="input" placeholder="kitap ismi"        required ><br>

  <label for="bookDescription"><p>açıklama: </p></label>
  <input type="text" name="bookDescription" id="bookDescription" class="input" placeholder="açıklama"       required><br>
            
  <label for="bookPageCount"><p>sayfa sayısı: * </p></label>
  <input type="text" name="bookPageCount" id="bookPageCount" class="input"      required><br>
            <br>
  <select class="categoryList" id="categoryList" name="category">
    <option>seçiniz</option>
  </select><br><br>

  <label for="bookAverageRating"><p>ortala puan: </p></label>
  <input type="text" name="bookAverageRating" id="bookAverageRating" class="input" ><br>

  <label for="bookPublicationDate"><p>yayınlanma tarihi: </p></label>
  <input type="date" name="bookPublicationDate" id="bookPublicationDate" class="input"  required><br>
       
  <label for="bookAuthor"><p>yazar: </p></label>
  <input type="text" name="bookAuthor" id="bookAuthor" class="input"   required><br>

  <label for="bookISBN"><p>ISBN: </p></label>
  <input type="text" name="bookISBN" id="bookISBN" class="input"   required><br>

  <label for="stockInfo"><p>stock bilgisi: </p></label>
  <input type="text" name="stockInfo" id="stockInfo" class="input"  required><br>

  <label for="price"><p>fiyat: </p></label>
  <input type="text" name="price" id="price" class="input"   required><br>
  <button class="button" id="updateButton"> UPDATE INFOS</button>
      </form>
  
  
  `
  getBookCategories()
    function validateForm() {
      var files = document.querySelector('input[type="file"]').files;
      for (var i = 0; i < files.length; i++) {
          var file = files[i];
          if (!file.type.startsWith('image/')) {
              document.querySelector('input[type="file"]').value = '';
              return false;
          }
      }
      return true;
  }
  const updateForm = document.getElementById('updateForm')
  updateForm.addEventListener('submit', e =>{
    event.preventDefault()
    const validateImages = validateForm()

    const updateFormData = new FormData(updateForm)

    
    if(validateImages){
      const addBookURL = "/bookStores/addBook"
      fetch(addBookURL,{
        method : "POST",
        body : updateFormData
      })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        alert(data.message)





      })
      .catch(e => console.error(e))




    }else{
      alert('sadece resim dosyaları yukleyebilirsiniz.')
    }


  })


})

getBooksButton.addEventListener('click', _ => {
  userActionsResult.innerHTML = `
  <div class="card">
    <img src="../uploads/deneme123/1.jpeg" alt="Ürün Resmi">
    <p>book name </p>
    <p>Price: $50</p>
    <input type="button" class="add-to-cart-button" value = "sepete ekle" >
</div>


  `
 
})

getOrdersButton.addEventListener('click', _ => {
  const getBookStoreOrdersURL = "/bookstores/getOrders"

  fetch(getBookStoreOrdersURL)
  .then(response => response.json())
  .then(data => {
    console.log(data)
    data.bookStoreOrder.forEach(allInfos=> {
      userActionsResult.innerHTML = ""
      userActionsResult.innerHTML += `
      <div id="orders" class = "orders"> 
      
        <div id="userInfos">
        <p> kullanıcı bilgileri </p>
          <p> tam adı : ${allInfos.userInfos.userFullName}</p>
          <p> teslimat adresi : ${allInfos.userInfos.deliverAddress}</p>
          <p> telefon numarası : ${allInfos.userInfos.userPhoneNumber}</p>
          <p> email : ${allInfos.userInfos.userEmail}</p>
        </div>
        
        <div id="orderItems" class = "orderItems">
        
        <p class="orderItemsTitle"> sipariş edilen ürünler </p>
        
        </div>
        <div id = "orderDetails" class = "orderDetails"> 
        <p> sipariş detayları </p>
          <p> ödeme yöntemi : ${allInfos.orderDetails.paymentMethod} </p>
          <p> toplam adet : ${allInfos.orderDetails.totalAmount} </p>
          <p id="totalPrice"> ${allInfos.orderDetails.totalPrice} </p>
          <p id="orderId" hidden = "true"> ${allInfos.orderDetails.orderId} </p>
          <select id="orderStatus" >
            <option> beklemede </option>
            <option> hazırlanıyor </option>
            <option> teslimatta </option>
            <option> teslim edildi to user </option>
          </select>
          <input type = "button" id="updateOrderStatus" value = "siparişi güncelle" hidden ="true">
       </div>
      
      </div>
      <br>
      
      `
      let totalPrice = 0
      const totalPriceP = document.getElementById('totalPrice')
      const orderItems = document.getElementById('orderItems')
      allInfos.orderItems.forEach(item => {
        orderItems.innerHTML += `
        \n
        <p> kitap ismi : ${item.bookName} </p>
        <p> ISBN : ${item.bookISBN} </p>
        <p> adet : ${item.quantity} </p>
        <p> fiyat : ${item.price} </p>
        <br>
        `
        totalPrice += item.price
      })
      totalPriceP.textContent = "toplam fiyat : " + totalPrice
      const orderStatusSelect = document.getElementById('orderStatus')
      const orderStatusOptions = orderStatusSelect.querySelectorAll('option')
      let count = 0
      orderStatusOptions.forEach(option => {
          if(allInfos.orderDetails.orderStatus === option.value){
              orderStatusSelect.selectedIndex = count
          }
          count++
      })
    })
  })
  .then( _ => {
    const orderStatusSelect = document.querySelectorAll('#orderStatus')
    const updateOrderStatusButton = document.getElementById('updateOrderStatus')
    orderStatusSelect.forEach(select => {
      let firstSelectedIndex  = select.selectedIndex
      console.log(select.selectedIndex)
      select.addEventListener('change', _ => {
        updateOrderStatusButton.hidden = false
        if(firstSelectedIndex == select.selectedIndex){
          updateOrderStatusButton.hidden = true
        }
      })
    })
    updateOrderStatusButton.addEventListener('click', _ => {
      const updateOrderStatus = {
        orderId : updateOrderStatusButton.parentElement.children[4].textContent.trim(),
        orderStatus : updateOrderStatusButton.parentElement.children[5].value.trim()
      }
      console.log(updateOrderStatus)
      const updateOrderStatusURL = "/bookstores/updateOrderStatus"
      fetch(updateOrderStatusURL,{
        method : "POST",
        headers : {
          "Content-Type": "application/json"
        },
        body : JSON.stringify(updateOrderStatus)
      })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        if(data.updated){
          alert(data.message)
        }
        setTimeout(() => {
          location.reload()
        }, 500);
        
      })
      .catch(e => console.error(e))




    })




  })
  .catch(e => console.error(e))

 
})


})


