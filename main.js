const API = "10072a77019799ef7504db3701b8439d"

const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
]

// Declaring Variables
const dayElement = document.querySelector('.default-day')
const dateElement = document.querySelector('.default-date')
const iconsContainer = document.querySelector('.icons')
const infoContainer = document.querySelector('.day-info')
const listContentElement = document.querySelector('.list-content ul')
const contentErrorContainer = document.querySelector('.content-error')
const contentErrorImg = document.querySelector('.content-error-img')

// Display the current day
const day = new Date();
const dayName = days[day.getDay()]
dayElement.textContent = dayName

// Display the current date
let month = day.toLocaleDateString("default", {month: "long"})
let date = day.getDate()
let year = day.getFullYear( )

dateElement.textContent = `${date} ${month} ${year}`

// Locate search-bars
const searchBars = document.querySelectorAll('form')
searchBars.forEach(form => {
    const btnElement = form.querySelector('.btn-search')
    const inputElement = form.querySelector('.input-field')
    
    // Add search function
    btnElement.addEventListener("click",  (e) => {
        e.preventDefault()
        e.stopPropagation()

        if(window.innerWidth < 768){
            alert(`We noticed you're currently on a mobile device\nYou can explore more of our features on a desktop`)
        }

        if(inputElement.value == ''){
            alert('Search box is empty')
        } else{

            const searchValue = inputElement.value
            inputElement.value = '';

            findLocation(searchValue)
        } 
    })

});


// Run Search function
const findLocation = async (countryName) => {

    iconsContainer.classList.remove("fadeIn")
    iconsContainer.innerHTML = ""

    contentErrorImg.classList.remove("fadeIn")

    document.querySelectorAll('.value').forEach((value) => {
        value.classList.remove('fadeIn')
    })
    document.querySelectorAll('.list-item').forEach((value) => {
        value.classList.remove('fadeIn')
    })

    try{
        
        const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${countryName}&appid=${API}&units=metric`

        const data = await fetch(API_URL);
        const result = await data.json()
        console.log(result)
        // Placing main content
        const MainContent = displayMainContent(result)

        setTimeout(() => {
            iconsContainer.insertAdjacentHTML('afterbegin', MainContent)

            iconsContainer.classList.add("fadeIn")
        }, 500)

        if(result.cod !== "404"){

            setTimeout(() => {
                // Placing right side content
                const RightSideContent = rightSideContent(result)
                infoContainer.innerHTML = RightSideContent

                // FadeIN Effect
                document.querySelectorAll('.value').forEach((value) => {
                    value.classList.add('fadeIn')
                })

                // ForeCasting
                displayForeCast(result.coord.lat, result.coord.lon)
            }, 500)

        } else{

            infoContainer.style.display = "none"
            listContentElement.style.display = "none"
            contentErrorContainer.style.display = "grid"
            contentErrorImg.classList.add("fadeIn")

        }

    } catch (err) {
        alert("Check your internet connection")
        console.error(err)
    }
}

// Function for deciphering values for main content
let displayMainContent = (result) => {

    if(result.cod == '404'){
        alert('Try searching a different location')
        return `
            <img class="error" src="./images/404.png" alt="">
            <h2 class="weather-temp">${result.cod}</h2>
            <h3 class="cloudtxt">${result.message}</h3>
        `
    }

    return `
        <img src="https://openweathermap.org/img/wn/${result.weather[0].icon}@4x.png" alt="">
        <h2 class="weather-temp">${Math.round(result.main.temp)}°C</h2>
        <h3 class="cloudtxt">${result.weather[0].description}</h3>
        <h3 class="country">${result.name}</h3>
    `
}

// Decipher values for right side content
let rightSideContent = (result) => {

    return `
        <div class="content">
            <p class="title">NAME</p>
            <span class="value">${result.name}</span>
        </div>
        <div class="content">
            <p class="title">TEMP</p>
            <span class="value">${Math.round(result.main.temp)}°C</span>
        </div>
        <div class="content">
            <p class="title">HUMIDITY</p>
            <span class="value">${result.main.humidity}%</span>
        </div>
        <div class="content">
            <p class="title">WIND SPEED</p>
            <span class="value">${result.wind.speed} Km/hr</span>
        </div>
    `
}

// Displaying Forecast
let displayForeCast = async (lat, long) => {
    const ForeCast_API = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${API}&units=metric`

    const data = await fetch(ForeCast_API)
    const result = await data.json()
    console.log(result)

    // Filter the forecast

    const uniqueSorter = []
    const daysForeCast = result.list.filter((forecast) => {
        const forecastDate = new Date(forecast.dt_txt).getDate()
        if (!uniqueSorter.includes(forecastDate)) {
            return uniqueSorter.push(forecastDate)
        }
    })
    console.log(daysForeCast)
    console.log(uniqueSorter)

    let listContentDisplay = (number) => {
        let newResult = daysForeCast[number]
        let dateStr = newResult.dt_txt;
        dateStr = dateStr.split(' ')[0]
        const date = new Date(dateStr);
        let contentDay = days[date.getDay()].slice(0,3)


        return `
            <li class="list-item">
                <img src="https://openweathermap.org/img/wn/${newResult.weather[0].icon}@2x.png" alt="">
                <span>${contentDay}</span>
                <span class="day-temp">${Math.round(newResult.main.temp)}°C</span>
            </li>
        `
    }

    listContentElement.innerHTML =
    `
        ${listContentDisplay(1)}
        ${listContentDisplay(2)}
        ${listContentDisplay(3)}
        ${listContentDisplay(4)}
    `

    
    // FadeIn Effect
    document.querySelectorAll('.list-item').forEach((listItem) => {
        listItem.classList.add('fadeIn')
    })
}


// Default Location
document.body.onload = () => findLocation("Nigeria"), alert('Looading weather of current location...')