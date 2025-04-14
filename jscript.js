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
        card.className = "col-md-6";

        card.innerHTML = `
        <div class="card shadow-sm p-4 ">
          <div class="d-flex align-items-center mb-4">
            <img src="${matchedCountry.flags.png}" alt="Flag of ${matchedCountry.name.common}" class="me-3" style="height: 80px;">
            <img src="${matchedCountry.coatOfArms?.png || ''}" alt="Coat of Arms" style="height: 80px;">
          </div>
          <h3>${matchedCountry.name.official}</h3>
          <p><strong>Alt Spellings:</strong> ${matchedCountry.altSpellings.join(', ')}</p>
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




})




