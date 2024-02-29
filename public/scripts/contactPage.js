const contactForm = document.getElementById("contactForm")
contactForm.addEventListener('submit', _ => {
    const formdata = new FormData(contactForm)
    console.log(formdata)

    contactInfoJSON = {
        name : formdata.get('name'),
        email : formdata.get('email'),
        message : formdata.get('message')
    }
    console.log(contactInfoJSON)
    const contactPageURL = "/contact"
    fetch(contactPageURL,{
        method : "POST",
        headers : {
            "Content-Type": "application/json",
        },
        body : JSON.stringify(contactInfoJSON)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
        alert(data.message)
    
    })
    .catch(e => console.log(e))
})




