const loginForms = document.getElementById('loginForms')
const userLoginFormButton = document.getElementById('userLogin')
const bookStoresLoginFormButton = document.getElementById('bookStoresLogin')

userLoginFormButton.addEventListener('click', _ => {

    loginForms.innerHTML = `
    <iframe name="noPageReload" style="display:none;"></iframe>
    <form target="noPageReload" id="userLoginForm">
        <label for="name">username:</label>
        <input type="text" id="username" name="username" required>
        <br>
        <label for="password">user password:</label>
        <input type="password" id="password" name="password" required>
        <br>
        <button type="submit">send</button>
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
        })
        .catch(e => console.log(e))
    })
})


bookStoresLoginFormButton.addEventListener('click', _ => {
    loginForms.innerHTML = `
    <iframe name="noPageReload" style="display:none;"></iframe>
    <form target="noPageReload" id="bookStoresLoginForm">
        <label for="name">book store username:</label>
        <input type="text" id="username" name="username" required>
        <br>
        <label for="password">bookstore password:</label>
        <input type="password" id="password" name="password" required>
        <br>
        <button type="submit">send</button>
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
        console.log(data)
    })
    .catch(e => console.log(e))
})

})





document.addEventListener('DOMContentLoaded', function() {
    userLoginFormButton.click();
});