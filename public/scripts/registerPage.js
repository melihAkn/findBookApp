const registerForms = document.getElementById('registerForms')
const userRegisterFormButton = document.getElementById('userRegister')
const bookStoresRegisterFormButton = document.getElementById('bookStoresRegister')

userRegisterFormButton.addEventListener('click', _ => {

    registerForms.innerHTML = `
    <iframe name="noPageReload" style="display:none;"></iframe>
    <form target="noPageReload" id="userRegisterForm">
        <label for="name">name :</label>
        <input type="text" id="name" name="name" required>
        <br>
          <label for="surname">surname :</label>
        <input type="text" id="surname" name="surname" required>
        <br>
        <label for="username">username :</label>
        <input type="text" id="username" name="username" required>
        <br>
          <label for="email">email :</label>
        <input type="email" id="email" name="email" required>
        <br>
          <label for="password">password :</label>
        <input type="password" id="password" name="password" required>
        <br>
          <label for="passwordAgain">password again :</label>
        <input type="password" id="passwordAgain" name="passwordAgain" required>
        <br>
        <label for="city">city:</label>
        <select class="cityList" id="citys" name="city">
            <option>select</option>
        </select>
        <br>
        <label for="phoneNumber">phone number:</label>
        <input type="text" id="phoneNumber" name="phoneNumber" required>
        <br>
        <button type="submit">send</button>
    </form>
    
    `
    getCitys()
    const userRegisterForm = document.getElementById('userRegisterForm')
    userRegisterForm.addEventListener('submit', _ => {
        
        const userRegisterFormData = new FormData(userRegisterForm)
        const userRegisterInfos = {
            name : userRegisterFormData.get('name'),
            surname : userRegisterFormData.get('surname'),
            username : userRegisterFormData.get('username'),
            email : userRegisterFormData.get('email'),
            password : userRegisterFormData.get('password'),
            city : userRegisterFormData.get('city'),
            phoneNumber : userRegisterFormData.get('phoneNumber')
        }
        console.log(userRegisterInfos)
        const userRegisterFormURL = "/userRegister"
        fetch(userRegisterFormURL,{
            method : "POST",
            headers : {
                "Content-Type": "application/json",
            },
            body : JSON.stringify(userRegisterInfos)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            if(data.registered){
                window.location.href = "/login"
            }else{
                alert(data.error)
            }
        })
        .catch(e => console.log(e))
    })
})


bookStoresRegisterFormButton.addEventListener('click', _ => {
    registerForms.innerHTML = `
    <iframe name="noPageReload" style="display:none;"></iframe>
    <form target="noPageReload" id="bookStoresRegisterForm">
        <label for="bookStoreName">bookStore name :</label>
        <input type="text" id="bookStoreName" name="bookStoreName" required>
        <br>
          <label for="username">username :</label>
        <input type="text" id="username" name="username" required>
        <br>
          <label for="email">email :</label>
        <input type="email" id="email" name="email" required>
        <br>
          <label for="password">password :</label>
        <input type="password" id="password" name="password" required>
        <br>
          <label for="passwordAgain">password again :</label>
        <input type="password" id="passwordAgain" name="passwordAgain" required>
        <br>
        <label for="phoneNumber">phone number:</label>
        <input type="text" id="phoneNumber" name="phoneNumber" required>
        <br>
        <label for="city">city:</label>
        <select class="cityList" id="citys" name="city">
            <option>select</option>
        </select>
        <br>
        <label for="physcialAddress">physcial address:</label>
        <input type="text" id="physcialAddress" name="physcialAddress">
        <br>
        <button type="submit">send</button>
    </form>
    
    `
    getCitys()
    const bookStoreRegisterForm = document.getElementById('bookStoresRegisterForm')
    bookStoreRegisterForm.addEventListener('submit', _ => {
    const bookStoreLoginFormData = new FormData(bookStoreRegisterForm)
    const bookStoresRegisterInfos = {
        name : bookStoreLoginFormData.get('bookStoreName'),
        username : bookStoreLoginFormData.get('username'),
        email : bookStoreLoginFormData.get('email'),
        password : bookStoreLoginFormData.get('password'),
        phoneNumber : bookStoreLoginFormData.get('phoneNumber'),
        city : bookStoreLoginFormData.get('city'),
        physcialAddress : bookStoreLoginFormData.get('physcialAddress')
    }
    console.log(bookStoresRegisterInfos)
    const bookStoresLoginURL = "/bookStoreRegister"
    fetch(bookStoresLoginURL,{
        method : "POST",
        headers : {
            "Content-Type": "application/json",
        },
        body : JSON.stringify(bookStoresRegisterInfos)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
        if(data.registered){
            window.location.href = "/login"
        }else{
            alert(data.error)
        }
    })
    .catch(e => console.log(e))
})

})





document.addEventListener('DOMContentLoaded', function() {
    userRegisterFormButton.click();
});