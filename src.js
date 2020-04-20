const moment = require("moment");
const temp = $("#temp")
const description = $("#description")
const city = $("#city")
const time = $("#time")
 
function formatTemp(temp) {
  //formatting to fahrenheit
  let newTemp = Math.floor((temp - 273) * (9 / 5) + 32)
  return newTemp.toString() + "\xB0"
}

function getTime(time) {
  //converts time based on utc offset, which api provides
  return moment().utcOffset(time / 60).format("h:mm a")
}

function getForecast(zip) {
  return new Promise((resolve, reject) => {
    $.get(`https://api.openweathermap.org/data/2.5/forecast?zip=${zip}&appid=3b2dc511fa1b554f1b0c117c3837d37e`, function (data) {
      if (!data) {
        reject("No data!")
      } else {
        console.log(data)
        let forecast = [];
        data.list.forEach(element => {
          let display = {
            forecastTime: moment.utc(element.dt_txt).format("ddd, MM/D/YY, h:mm a"),
            temp: formatTemp(element.main.temp),
            description: element.weather[0].description,
            name: data.city.name,
            time: getTime(data.city.timezone)
          }
          forecast.push(display)
        })
        resolve(forecast);
      }
    })
  })
}

function getWeather(zip) {
  return new Promise((resolve, reject) => {
    $.get(`https://api.openweathermap.org/data/2.5/weather?zip=${zip}&appid=3b2dc511fa1b554f1b0c117c3837d37e`, function (data) {
      if (!data) {
        reject("No data!")
      } else {
        console.log(data)
          let display = {
            temp: formatTemp(data.main.temp),
            description: data.weather[0].description,
            name: data.name,
            time: getTime(data.timezone)
          }
        resolve(display);
      }
    })
  })
}
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      let lat = position.coords.latitude;
      let lon = position.coords.longitude;
      $.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=3b2dc511fa1b554f1b0c117c3837d37e`, (data) => {
        let display = {
          temp:formatTemp(data.main.temp),
          description:data.weather[0].description,
          name:data.name,
          time:getTime(data.timezone),
        }
        temp.text(display.temp);
        description.text(display.description);
        city.text(display.name);
        time.text(display.time);
      })
    });
  } else { 
    console.log("Geolocation is not supported by this browser.");
  }
}
getLocation();

$("form").on("submit", (event) => {
  event.preventDefault();
  let zip = $("#zip").val();
  if (zip === "") {
    alert("Please enter a zip code!")
  } else {
    getWeather(zip).then(data => {
      console.log(data);
      temp.text(data.temp);
      description.text(data.description);
      city.text(data.name);
      time.text(data.time);
    })
  }
})