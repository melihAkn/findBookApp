    //checkbox group only one checkbox selected
    const checkboxes = document.querySelectorAll('input[type="checkbox"][name="bookStoresList"]');
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', function() {
        checkboxes.forEach(cb => {
          if (cb !== this) {
            cb.checked = false;
          }
        });
      });
    });
//get city for options
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
    citys.selectedIndex = 81
})
.catch(e => {
    //if an error occured to getting cityy alert the user
    //and ask them to refresh page if error alert the user please try again later
    //because this is a server error
    console.log(e)
})

//perform search
const searchButton = document.getElementById('performSearch')
const searchText = document.getElementById('searchInput')
searchButton.addEventListener('click', _ => {
    console.log(searchText.value)
    console.log(citys.value)
    const searchThis = {
        bookName : searchText.value,
        searchedCity : citys.value
    }
    fetch('/performSearch',{
        method : "POST",
        headers : {
            "Content-Type" : "Application-Json"
        },
        body : JSON.stringify(searchThis)
    })
    .then(response => response.json())
    .then(data => {
        //card create

        return data
    })
    .then(returnedData => {
        //button action
    })
    .catch(e => console.log(e))
})
