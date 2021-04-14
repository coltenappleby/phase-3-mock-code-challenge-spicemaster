// write your code here

//globals
const spiceBlendDetail = document.querySelector('div#spice-blend-detail')
const spiceImages = document.querySelector('div#spice-images')

document.addEventListener('DOMContentLoaded', () => {

    loadDetailedSpiceBlend()

    loadSpiceImages()

    document.addEventListener('click', event => { //this should be submit not slick
        event.preventDefault()
        // console.log(event.target)
        if (event.target.matches('input')) {
            console.log(event.target.value)
            if (event.target.value === 'Update') {
                updateSpice()
            } else if (event.target.value === "Add Ingredient") {
                console.log('inside of submit event listener')
                addIngredient()
            }
        }
        // console.log(event.target)}
    })

    spiceImages.addEventListener('click', event => {

        console.log(event.target.parentElement.dataset.id)

        loadDetailedSpiceBlend(event.target.parentElement.dataset.id)

    })
    


});


function loadSpiceImages() {

    fetch('http://localhost:3000/spiceblends')
    .then(res => res.json())
    .then(json => {

        json.forEach(element => {

            console.log(element.image)

            let div = document.createElement('div')
            div.dataset.id = element.id

            div.innerHTML = `
                <img src = ${element.image} alt = ${element.title} />
            `
            
            // div.className = 'spice-images'
            // let img = document.createElement('img')
            // img.src = element.image
            // img.atl = element.title
            // div.appendChild(img)

            spiceImages.append(div)

        })
    });

}


function loadDetailedSpiceBlend(id = 1) {


    fetch(`http://localhost:3000/spiceblends/${id}`)
    .then(res => res.json())
    .then(json => {
        
        let img = spiceBlendDetail.querySelector('img')
        img.src = json.image
        img.alt = json.title

        let h2  = spiceBlendDetail.querySelector('h2')
        h2.textContent = json.title

        spiceBlendDetail.dataset.id = json.id

        loadIngredients(json.id)

    });
}

function loadIngredients(spiceID) {

    let ingredientsList = spiceBlendDetail.querySelector('ul.ingredients-list')

    ingredientsList.innerHTML = ``

    fetch('http://localhost:3000/ingredients')
    .then(res => res.json())
    .then(json => {
        json.forEach(element => {
           if (element.spiceblendId === spiceID){
            let li = document.createElement('li')
            li.textContent = element.name
            ingredientsList.append(li)
            }
        });
    });
}

function updateSpice() {

    const updateForm = document.querySelector('form#update-form')

    const newTitle = updateForm.querySelector('input#spiceblend-title').value

    // PATCH FETCH
    const patchObj = {
        method: 'PATCH',
        headers: { 
            "Content-Type": "application/json" ,
            Accept: "application/json"},
        body:
            JSON.stringify({"title": newTitle})
    }

    fetch(`http://localhost:3000/spiceblends/${spiceBlendDetail.dataset.id}`, patchObj)
    .then(res => res.json())
    .then(json => {
        console.log(json)
        let h2  = spiceBlendDetail.querySelector('h2')
        h2.textContent = json.title
    })
}



function addIngredient () {

    console.log('inside of add ingredient')

    const ingredientForm = document.querySelector('form#ingredient-form')
    const name = ingredientForm.querySelector('input#ingredient-name').value
    const spiceblendId = parseInt(spiceBlendDetail.dataset.id)

    // POST FETCH

    const ingredient = {name, spiceblendId}

    const patchObj = {
        method: 'POST',
        headers: { 
            "Content-Type": "application/json" ,
            Accept: "application/json"},
        body:
            JSON.stringify(ingredient)
    }
    fetch(`http://localhost:3000/ingredients`, patchObj)
    .then(res => res.json())
    .then(json => {
        console.log(json)
        loadDetailedSpiceBlend(json.spiceblendId)
    })


}
