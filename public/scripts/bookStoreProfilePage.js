//html elements
const userActionsResult = document.getElementById('userActionResults')
const updateUserInfosButton = document.querySelector('#bookStoreUpdateInfos');
const getBookStoresBooksButton = document.getElementById('bookStoreGetBooks')
const addBooksButton = document.getElementById('bookStoreAddBooks')

//fetch the user ınfos
const getUserInfosURL = "/bookStores/getUserInfos"
fetch(getUserInfosURL)
.then(response => {
  if (!response.ok) {
    if (response.status === 401) {
        window.location.href = '/login';
    } else {
        console.error('Something went wrong:', response.statusText);
    }
} else {
    return response.json();
}

})
.then(data => {
  console.log(data)
//inner html
console.log(updateUserInfosButton)
    updateUserInfosButton.addEventListener('click', _ => {
        userActionsResult.innerHTML = `
        <iframe name="noPageReload" style="display:none;"></iframe>
    <form id="updateForm" target = "noPageReload">
  
    <!-- 
      burada slider şeklinde olmali
    <label for="userProfilePicture"><p>profile picture: </p></label>
    <img id="userProfilePicture" name = "userProfilePicture" class="userProfilePicture"  src="https://bulma.io/images/placeholders/96x96.png" alt="Placeholder image">
    </br>
    <input type="file" id="fileInput" accept="image/*">
    !-->
    <label for="name"><p>name: </p></label>
    <input type="text" name="name" id="name" class="input" placeholder="bookstore name" value="${data.getBookStoreInfos.name}" required><br>
  
    <label for="username"><p>username: </p></label>
    <input type="text" name="username" id="username" class="input" placeholder="username" value="${data.getBookStoreInfos.username}" required><br>
  
    <label for="email"><p>email: </p></label>
    <input type="email" name="email" id="email" class="input" placeholder="email" value="${data.getBookStoreInfos.email}" required><br>
              
    <label for="currentPassword"><p>current password: * </p></label>
    <input type="password" name="currentPassword" id="currentPassword" class="input" required><br>
    <p> if dont want to update your password keep it blank</p>
              
    <label for="newPassword"><p>new password: </p></label>
    <input type="password" name="newPassword" id="newPassword" class="input" ><br>
              
    <label for="newPasswordAgain"><p>new password again: </p></label>
    <input type="password" name="newPasswordAgain" id="newPasswordAgain" class="input" ><br>
  
    <label for="phoneNumber"><p>phoneNumber: </p></label>
    <input type="text" name="phoneNumber" id="phoneNumber" class="input" placeholder="phone number" value="${data.getBookStoreInfos.phoneNumber}" required><br>
         
    <label for="physcialAddress"><p>physcial address: </p></label>
    <input type="text" name="physcialAddress" id="physcialAddress" class="input" value="${data.getBookStoreInfos.physcialAddress}" required><br>
  
    <label for="city">city:</label>
    <select class="cityList" id="citys" name="city">
      <option>select</option>
    </select><br><br>
  
    <button class="button" id="updateButton"> UPDATE INFOS</button>
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
    console.log(updateFormData)
    const newPasswordValue = newPasswordInput.value;
    const newPasswordAgainValue = newPasswordAgainInput.value;

    if (newPasswordValue !== newPasswordAgainValue) {
        alert("passwords are not equal please enter again");
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
          console.log(data)
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
})


