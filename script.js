async function getLatLon(){

    /*1) House Number  /
      2) Street Name  /  street
      3) City / city
      4) State / state
      5) Postal Code  / postalcode
      6) Country / country */

    let houseNumber = document.getElementById("houseNumber").value.replace(" ", "+");
    let streetName = document.getElementById("streetName").value.replace(" ", "+");
    let city = document.getElementById("city").value.replace(" ", "+");
    let state = document.getElementById("state").value.replace(" ", "+");
    let postalCode = document.getElementById("postalCode").value.replace(" ", "+");
    let country = document.getElementById("country").value.replace(" ", "+");

    houseNumber = houseNumber.trim();
    streetName = streetName.trim();
    city = city.trim();
    state = state.trim();
    postalCode = postalCode.trim();
    country = country.trim();

    let lat = undefined
    let lon = undefined

    const url = `https://geocode.maps.co/search?street=${houseNumber}+${streetName}&city=${city}&state=${state}&postalcode=${postalCode}&country=${country}`;
    console.log(url)
    try{
        const response = await fetch(url);

        if(response.ok){

            data = await response.json();
            lat = data[0].lat;
            lon = data[0].lon;
            return [lat, lon];

        }else{
            console.error("Fallo al procesar el archivo JSON:", response.statusText)
        }
    }catch(error){
        console.error('Error en la conexión o en el mostrado de datos JSON:',error)
    }
}

async function get_weather(){

    const [lat, lon] = await getLatLon();

    console.log(lat)
    console.log(lon)

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m&hourly=precipitation&hourly=precipitation_probability&hourly=weathercode`;
    console.log(url)

    try{
        const response = await fetch(url);

        if(response.ok){

            data = await response.json();
            
            return data;
            
        }else{
            console.error('Fallo al procesar el archivo JSON:', respuesta.statusText);
        }

    }catch(error){
        console.error('Error en la conexión o en el mostrado de datos JSON:', error);
    }
}

async function showWeatherTable(){

        /* ICON ****************************** CODE
    <i class="wi wi-day-sunny"></i>   -> 0
    <i class="wi wi-day-cloudy"></i>  -> 1,2,3
    <i class="wi wi-day-fog"></i>     -> 45, 48
    <i class="wi wi-day-sleet"></i>   -> 51, 53, 55
    <i class="wi wi-day-showers"></i>    -> 56, 57
    <i class="wi wi-day-rain"></i>    -> 61, 63, 65
    <i class="wi wi-day-storm-showers"></i>  -> 66, 67
    <i class="wi wi-day-snow"></i>    -> 71, 73, 75
    <i class="wi wi-day-snow"></i>  ->   77
    <i class="wi wi-day-thunderstorm"></i> -> 80, 81, 82
    <i class="wi wi-day-snow-thunderstorm"></i> -> 85, 86
    <i class="wi wi-day-thunderstorm"></i>  -> 95*
    <i class="wi wi-thunderstorm	"></i> -> 96, 99**/
    
    let wetCode = 63;
    let iconCode = 0; //Guardar el codigo del icon ejemplo wi-day-sunny y utilizarlo para colocar el icono.

    data = await get_weather();

    const table = document.querySelector("table")
    //const zona = document.querySelector("#city").value

    let tr = document.createElement("tr");
    let time = getTime();
    let hora = 0;
    let j = getTime() + 10;
    
    let thd = document.createElement("th")
    thd.innerHTML = "Horas";

    tr.append(thd)
    
    for(let i = time ; i < j; i++){
        let th = document.createElement("th");
        let fullDateTime = data.hourly.time[i];
        hora= fullDateTime.substring(fullDateTime.indexOf('T') + 1);
        th.innerHTML = hora.toString().concat('h');
        tr.append(th)
    }
    
    table.append(tr)

    let tr1 = document.createElement("tr");
    let tdd = document.createElement("td")
    tdd.innerHTML = "Temperaturas (°C)";

    tr1.append(tdd)
    

    for(let i = time; i < j; i++){
        let td = document.createElement("td");
        td.innerHTML = data.hourly.temperature_2m[i].toString().concat("°C")
        tr1.append(td)
    }
    

    table.append(tr1)

    let tr2 = document.createElement("tr");
    let tdd1 = document.createElement("td")
    tdd1.innerHTML = "Precipitaciones (mm)";

    tr2.append(tdd1)

    for(let i = time; i < j; i++){
        let td = document.createElement("td");
        td.innerHTML = data.hourly.precipitation[i].toString().concat("mm")
        tr2.append(td)
    }

    table.append(tr2)
    
    let tr3 = document.createElement("tr");
    let tdd2 = document.createElement("td")
    tdd2.innerHTML = "Probabilidad Precipitaciones (%)";

    tr3.append(tdd2)

    for(let i = time; i < j; i++){
        let td = document.createElement("td");
        td.innerHTML = data.hourly.precipitation_probability[i].toString().concat("%")
        tr3.append(td)
    }

    table.append(tr3)

    let tr4 = document.createElement("tr");
    let tdd3 = document.createElement("td")
    tdd3.innerHTML = "Icono";

    tr4.append(tdd3)

    
    //<i class="wi wi-day-sleet"></i>
    for(let i = time; i < j; i++){
        let td = document.createElement("td");
        let key = getCodes(data.hourly.weathercode[i]);
        let icon = document.createElement("i")
        icon.className = `wi ${key}`
        td.appendChild(icon);
        console.log(getCodes(data.hourly.weathercode[i]))
        tr4.append(td)
    }

    table.append(tr4)
}
/* 00:00 */
function getTime() { //As Integer

    let date = new Date();
    let hours = date.getHours();
    

    let time = hours.toString()
    return parseInt(time);

}

function getCodes(wetCode){

    const icons = {
        "wi-day-sunny": [0],
        "wi-day-cloudy": [1,2,3],
        "wi-day-fog": [45, 48],
        "wi-day-sleet": [51, 53, 55],
        "wi-day-showers": [56, 57],
        "wi-day-rain": [61, 63, 65],
        "wi-day-storm-showers": [66, 67],
        "wi-day-snow": [71, 73, 75, 77],
        "wi-day-thunderstorm": [80, 81, 82, 95],
        "wi-day-snow-thunderstorm": [85, 86],
        "wi-thunderstorm": [96, 99]
    }
    
    for( const key in icons){
        const values = icons[key];
        for(let j = 0; j < values.length; j++){
            if(values[j] === wetCode){
                return key;
            }
        }
    }
}

