const searchBtn = document.getElementById("search");
const input = document.getElementById("input");
const body = document.getElementById("body");

// Flag and Coat of Arms
const flag = document.getElementById("flag");
const coatOfArm = document.getElementById("coatofarm");

// Country Names
const countryDescription = document.getElementById("officailname");

// Geography
const continent = document.getElementById("continent");
const continentSide = document.getElementById("partofcontinent");
const capital = document.getElementById("capital");
const countrySize = document.getElementById("area");

// Borders
const surroundingCountries = document.getElementById("borders");

// Population & Demographics
const population = document.getElementById("population");
const calledByEn = document.getElementById("en");
const calledByFr = document.getElementById("fr");



// Languages
const language = document.getElementById("lang");

// Currency
const currency = document.getElementById("currency");


// Maps
const googleMap = document.getElementById("googlemap");
const openStreetmap = document.getElementById("openstreetmap");



// filter by continent
const byContinent = document.getElementById("continentSelect");
const continentBtn = document.getElementById("continentsearch");






// the filter by

async function fetchCountriesByContinent(continent) {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all");
    const data = await response.json();

    // Filter countries by continent
    const filtered = data.filter(c =>
      c.continents && c.continents.includes(continent)
    );

    return filtered;
  } catch (error) {
    console.error("Error fetching countries by continent:", error);
    return null;
  }
};



continentBtn.addEventListener("click", async () => {
  let selected = byContinent.value;
  

  if (!selected) {
    alert("Please select a continent");
    return;
  }

  const countries = await fetchCountriesByContinent(selected);

  
  

  countries.forEach((country) => {
    const card = document.createElement("div");
    card.className = "col-md-4";

    card.innerHTML = `
        <div class="card shadow-sm p-4 ">
         <div class="d-flex justify-content-center mb-4">
        <img src="${country.flags.png}" alt="flag" class="me-3" style="height: 80px;">
       <img src="${country.coatOfArms.png || ''}" alt="Coat of Arms" style="height: 80px;">
      </div>
      <h3>${country.name.official}</h3>
     <p><strong>Region:</strong> ${country.continents}</p>
     <p><strong>Subregion:</strong> ${country.subregion}</p>
    <p><strong>Capital:</strong> ${country.capital}</p>
    <p><strong>Area:</strong> ${country.area} km²</p>
    <p><strong>Borders:</strong> ${country.borders ? country.borders.join(', ') : 'None'}</p>
    <p><strong>Population:</strong> ${country.population.toLocaleString()} people</p>
    <p><strong>Language:</strong> ${Object.values(country.languages).join(', ')}</p>
    <p><strong>Currency:</strong> ${Object.values(country.currencies)[0].name} (${Object.values(country.currencies)[0].symbol})</p>
    <p><strong>Google Maps:</strong> 
    <a href="${country.maps.googleMaps}" target="_blank">map</a>
    <a href="${country.maps.openStreetMaps}" target="_blank">openStreeMap</a>
   </p>
 </div>
      
    `;

    document.getElementById("card-container").appendChild(card);

  });

  // Clear previous results
  byContinent.value ="";
});


document.getElementById("clearinfo").addEventListener('click',()=>{
  document.getElementById("card-container").innerHTML = "";
})

// filter ends



async function getCountry(countryName) {

  try {
    const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
    const data = await response.json();


    // console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching weather:", error);
    return null;
  }
}

// Usage


async function getCountryFromLatLng(lat, lon) {
  try {
    //Reverse geocode lat/lon to get country name
    const reverseRes = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
    const reverseData = await reverseRes.json();

    const countryName = reverseData.address.country;
    console.log("You are in:", countryName);

    //Fetch country details from restcountries using the name
    const countryRes = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
    const countryData = await countryRes.json();

    console.log("Country details:", countryData);
    return countryData;
  } catch (error) {
    console.error("Error fetching country by lat/lon:", error);
    return null;
  }
}


navigator.geolocation.getCurrentPosition(
  async (position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    const countryData = await getCountryFromLatLng(lat, lon);
    if (countryData) {
      // do something with countryData[0], like display card

      flag.src = countryData[0].flags.png;
      coatOfArm.src = countryData[0].coatOfArms.png;
      continent.innerText = countryData[0].continents;
      continentSide.innerText = countryData[0].subregion;
      capital.innerText = countryData[0].capital;
      population.innerText = countryData[0].population + " " + "people";

      if (countryData[0].languages) {
        language.innerHTML = `${Object.values(countryData[0].languages).join(', ')}`;
      } else {
        language.innerHTML = "No languages available.";
      }

      if (countryData[0].maps.googleMaps) {
        googleMap.href = countryData[0].maps.googleMaps;
      } else {
        googleMap.href = "#";
        googleMap.textContent += " (Not available)";
      }



      if (countryData[0].maps.openStreetMaps) {
        openStreetmap.href = countryData[0].maps.openStreetMaps;
      } else {
        openStreetmap.href = "#";
        openStreetmap.textContent += " (Not available)";
      }



      if (countryData[0].currencies) {
        currency.innerHTML = `${Object.values(countryData[0].currencies)[0].name}  (${Object.values(countryData[0].currencies)[0].symbol})`;
      } else {
        currency.innerHTML = "No languages available.";
      }






      console.log("Country name:", countryData[0].name.common);
    }
  },
  (err) => {
    console.error("Geolocation error:", err);
  }
);







searchBtn.addEventListener('click', async () => {

  let countryName = input.value.trim();
  input.value = "";

  // if input is not found alert
  if (!countryName) {
    alert("Please enter a country name!");
    return;
  }

  const data = await getCountry(countryName);

  try {


    if (data) {
      // i am looping through the data array to match the condition
      const matchedCountry = data.find(country =>
        country.name.common.toLowerCase() === countryName.toLowerCase() ||
        // using some to loop through the altSpellings
        (country.altSpellings && country.altSpellings.some(alt => alt.toLowerCase() === countryName.toLowerCase()))
      );


      // if condition is true output
      if (matchedCountry) {

        const card = document.createElement("div");
        card.className = "col-md-4";

        card.innerHTML = `
        <div class="card shadow-sm p-4 ">
          <div class="d-flex justify-content-center mb-4">
            <img src="${matchedCountry.flags.png}" alt="Flag of ${matchedCountry.name.common}" class="me-3" style="height: 80px;">
            <img src="${matchedCountry.coatOfArms.png || ''}" alt="Coat of Arms" style="height: 80px;">
          </div>
          <h3>${matchedCountry.name.official}</h3>
          <p><strong>Region:</strong> ${matchedCountry.continents}</p>
          <p><strong>Subregion:</strong> ${matchedCountry.subregion}</p>
          <p><strong>Capital:</strong> ${matchedCountry.capital}</p>
          <p><strong>Area:</strong> ${matchedCountry.area} km²</p>
          <p><strong>Borders:</strong> ${matchedCountry.borders ? matchedCountry.borders.join(', ') : 'None'}</p>
          <p><strong>Population:</strong> ${matchedCountry.population.toLocaleString()} people</p>
          <p><strong>Language:</strong> ${Object.values(matchedCountry.languages).join(', ')}</p>
          <p><strong>Currency:</strong> ${Object.values(matchedCountry.currencies)[0].name} (${Object.values(matchedCountry.currencies)[0].symbol})</p>
          <p><strong>Google Maps:</strong> <a href="${matchedCountry.maps.googleMaps}" target="_blank">map</a>
          <a href="${matchedCountry.maps.openStreetMaps}" target="_blank">openStreeMap</a>
          </p>
        </div>
      `;

        document.getElementById("card-container").appendChild(card);


      }






      // else for the loop condition
      else {
        alert("data not found. Please try again.");
        return;
      }


    }




    // body.style.display = "block";
  }



  catch (error) {
    console.error("Error Fetching data:", error)
  }




});








