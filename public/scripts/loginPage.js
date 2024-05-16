const loginForms = document.getElementById('loginForms')
const userLoginFormButton = document.getElementById('userLogin')
const bookStoresLoginFormButton = document.getElementById('bookStoresLogin')

userLoginFormButton.addEventListener('click', _ => {

    loginForms.innerHTML = `
    <iframe name="noPageReload" style="display:none;"></iframe>
    <form target="noPageReload" id="userLoginForm">
        <label for="name">kullanıcı adı:</label>
        <input type="text" id="username" name="username" required>
        <br>
        <label for="password">şifre:</label>
        <input type="password" id="password" name="password" required>
        <br>
        <button type="submit">giriş yap</button>
    </form>
    
    `
    const userLoginForm = document.getElementById('userLoginForm')
    userLoginForm.addEventListener('submit', _ => {
        
        const userLoginFormData = new FormData(userLoginForm)
        const userLoginInfos = {
            username : userLoginFormData.get('username'),
            password : userLoginFormData.get('password')
        }
        const userLoginFormURL = "/userLogin"
        fetch(userLoginFormURL,{
            method : "POST",
            headers : {
                "Content-Type": "application/json",
            },
            body : JSON.stringify(userLoginInfos)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            if(data.loginAttemp){
                window.location.href = "/"
            }else if(data.error){
                alert(data.error)
            }
            else{
                alert(data.message)
            }
        })
        .catch(e => console.log(e))
    })
})


bookStoresLoginFormButton.addEventListener('click', _ => {
    loginForms.innerHTML = `
    <iframe name="noPageReload" style="display:none;"></iframe>
    <form target="noPageReload" id="bookStoresLoginForm">
        <label for="name">mağaza kullanıcı adı:</label>
        <input type="text" id="username" name="username" required>
        <br>
        <label for="password">şifre:</label>
        <input type="password" id="password" name="password" required>
        <br>
        <button type="submit">giriş yap</button>
    </form>
    
    `
    const bookStoresLoginForm = document.getElementById('bookStoresLoginForm')
    bookStoresLoginForm.addEventListener('submit', _ => {

    
    const bookStoreLoginFormData = new FormData(bookStoresLoginForm)
    const bookStoresLoginInfos = {
        username : bookStoreLoginFormData.get('username'),
        password : bookStoreLoginFormData.get('password')
    }
    console.log(bookStoresLoginInfos)
    const bookStoresLoginURL = "/bookStoresLogin"
    fetch(bookStoresLoginURL,{
        method : "POST",
        headers : {
            "Content-Type": "application/json",
        },
        body : JSON.stringify(bookStoresLoginInfos)
    })
    .then(response => response.json())
    .then(data => {
        if(data.loginAttemp){
            window.location.href = "/"
        }else if(data.error){
            alert(data.error)
        }else{
            alert(data.message)
        }
        
    })
    .catch(e => {
        console.log(e) 
    })
})

})





document.addEventListener('DOMContentLoaded', function() {
    userLoginFormButton.click();
});