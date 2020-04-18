const moment = require("moment");

function formatTemp(temp) {
  //formatting to fahrenheit
  let newTemp = Math.floor((temp - 273) * (9 / 5) + 32)
  return newTemp.toString() + "\xB0"
}

function getTime(time) {
  //converts time based on utc offset, which api provides
  return moment().utcOffset(time / 60).format("h:mm a")
}

function getWeather(zip) {
  return new Promise((resolve, reject) => {
    $.get(`https://api.openweathermap.org/data/2.5/forecast?zip=${zip}&appid=3b2dc511fa1b554f1b0c117c3837d37e`, function (data) {
      if (!data) {
        reject("No data!")
      } else {
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

$("form").on("submit", (event) => {
  event.preventDefault();
  let zip = $("#zip").val();
  if (zip === "") {
    alert("Please enter a zip code!")
  } else {
    getWeather(zip).then(result => {
      result.forEach(data => {
        console.log(data);
        let forecast = `<p>${data.temp}</p>`
        $("#data").append(forecast);
      })
    })
  }
})