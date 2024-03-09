function getCitys(city = undefined) {
    const citys = document.getElementById('citys')
    fetch('../frontendStuff/citys.json')
    .then(response => response.json())
    .then(data => {
        data.forEach(city => {
            let option = document.createElement('option')
            option.text = city
            citys.add(option)
        })
    })
    .then(data => {
        //set default city by users location if user cannot give the 
        //permission set the city ip control if fail set the city Istanbul or duzce
        if(city){
            const options = citys.querySelectorAll('option');
            let count = 0
            options.forEach(option => {
                if(city === option.value){
                    console.log(count)
                    citys.selectedIndex = count
                }
                count++
            });
        }else{
            citys.selectedIndex = 81
        }
        
    })
    .catch(e => {
        //if an error occured to getting cityy alert the user
        //and ask them to refresh page if error alert the user please try again later
        //because this is a server error
        console.log(e)
    })


}

function getBookCategories() {
    const bookCategories = document.getElementById('categoryList')
    fetch('../frontendStuff/bookCategories.json')
    .then(response => response.json())
    .then(data => {
        data.forEach(categories => {
            let option = document.createElement('option')
            option.text = categories
            bookCategories.add(option)
        })
    })
    .catch(e => {
        console.error(e)
    })


}
function logout(){
        fetch("/logout")
        .then(response => response.json())
        .then(data => {
            if(data.tokenDeleted){
                window.location.href = "/login"
            }else{
                alert("you are not loginned redirecting to login page")
                window.location.href = "/login"
            }
        })
        .catch(e => console.log(e))
}
function logoutEventListener(){
    const logoutLink = document.getElementById('logout')
    logoutLink.addEventListener('click',logout)
}

