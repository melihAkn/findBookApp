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
getCitys()
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
