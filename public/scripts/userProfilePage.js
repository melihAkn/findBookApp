//html elements
const userActionsResult = document.getElementById('userActionResults')
const updateUserInfosButton = document.getElementById('userUpdateInfos')
const getUserFavBooksButton = document.getElementById('getUserFavBooks')
const getUserWishlistButton = document.getElementById('getUserWishlist')
const getUserOrdersButton = document.getElementById('userOrders')
//fetch the user ınfosuserUpdateInfos


const getUserInfosURL = "/user/getUserInfos"
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
    console.log(data)
    updateUserInfosButton.addEventListener('click', _ => {
        userActionsResult.innerHTML = `
        <iframe name="noPageReload" style="display:none;"></iframe>
    <form id="updateForm" target = "noPageReload">
  
    <!-- 
    <label for="userProfilePicture"><p>profile picture: </p></label>
    <img id="userProfilePicture" name = "userProfilePicture" class="userProfilePicture"  src="https://bulma.io/images/placeholders/96x96.png" alt="Placeholder image">
    </br>
    <input type="file" id="fileInput" accept="image/*">
    !-->
    <label for="name"><p>isim: </p></label>
    <input type="text" name="name" id="name" class="input" placeholder="bookstore name" value="${data.nameAndSurname}" required><br>
  
    <label for="username"><p>kullanıcı adı: </p></label>
    <input type="text" name="username" id="username" class="input" placeholder="username" value="${data.username}" required><br>
  
    <label for="email"><p>email: </p></label>
    <input type="email" name="email" id="email" class="input" placeholder="email" value="${data.email}" required><br>
              
    <label for="currentPassword"><p>şuan ki şifreniz: * </p></label>
    <input type="password" name="currentPassword" id="currentPassword" class="input" required><br>
    <p>eğer şifrenizi güncellemek istemiyorsanız ikisini de boş bırakın.</p>
              
    <label for="newPassword"><p>yeni şifreniz: </p></label>
    <input type="password" name="newPassword" id="newPassword" class="input" ><br>
              
    <label for="newPasswordAgain"><p>tekrar yeni şifreniz: </p></label>
    <input type="password" name="newPasswordAgain" id="newPasswordAgain" class="input" ><br>
  
    <label for="phoneNumber"><p>telefon numaranız: </p></label>
    <input type="text" name="phoneNumber" id="phoneNumber" class="input" placeholder="phone number" value="${data.phoneNumber}" required><br>
         
    <label for="physcialAddress"><p>fiziksel adres: </p></label>
    <input type="text" name="physcialAddress" id="physcialAddress" class="input" value="${data.physcialAddress}" required><br>
  
    <label for="city">şehir:</label>
    <select class="cityList" id="citys" name="city">
      <option>seçiniz</option>
    </select><br><br>
  
    <button class="button" id="updateButton">bilgileri güncelle</button>
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
        alert("şifreler birbirine eşit değil yeniden deneyin");
    } else {

        const updateUserInfosData = {
          name : updateFormData.get('name'),
          username : updateFormData.get('username'),
          email : updateFormData.get('email'),
          password : updateFormData.get('currentPassword'),
          phoneNumber : updateFormData.get('phoneNumber'),
          physcialAddress : updateFormData.get('physcialAddress'),

        }
        if(newPasswordValue.length > 0 && newPasswordAgainValue.length > 0){
          updateUserInfosData.newPassword = newPasswordValue
          updateUserInfosData.newPasswordAgain = newPasswordAgainValue
        }
        const updateUserInfosURL = "/user/updateInfos"
        fetch(updateUserInfosURL , {
          method : "POST",
          headers : {
            "Content-Type" : "application/json"
          },
          body : JSON.stringify(updateUserInfosData)
          
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


//get user fav books
getUserFavBooksButton.addEventListener('click', _ => {

})



// get user wishlisted books
getUserWishlistButton.addEventListener('click', _ => {

})


//get user orders
getUserOrdersButton.addEventListener('click' , _ => {
  const getUserOrdersURL = "/user/getUserOrders"
  
  fetch(getUserOrdersURL)
  .then(response => response.json())
  .then(data => {
    let totalPrice = 0
    
    data.forEach(e => {
      for(let item in e.items){
        totalPrice += e.items[item].price
      }
      userActionsResult.innerHTML = ""
      userActionsResult.innerHTML += `
      <div id="userOrders">
      <p>seller mağaza ismi : ${e.bookstoreName}</p>
      <p>satın alınan ürünler </p>
      <div id="itemsList">
      
      </div>
      
      <p>sipariş durumu : ${e.orderStatus}</p>
      <p>toplam fiyat : ${totalPrice}</p>
      </div>
      
      `
      const itemsList = document.getElementById('itemsList')
      for(let item in e.items){
        itemsList.innerHTML += `
        <p> kitap ismi: ${e.items[item].bookName} fiyatı : ${e.items[item].price}</p>
        
        `
      }
    });
    
  })
  .catch(e => console.error(e))
})











})






