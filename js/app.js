const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const app = express();
// Για custom Paths κανω require path
const path = require('path');

app.use(bodyParser.urlencoded({extended: true}));
app.get("/", function(req, res) {
  var parentDir = path.normalize(__dirname+"/..");
  res.sendFile(parentDir + "/index.html");
});

app.post("/", function(req,res){
  console.log(req.body.cityName);
  const query = req.body.cityName;
  const apiKey = "something";
  const units = "metric";
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&units=" + units + "&appid=" + apiKey;
  https.get(url, function(response) {
    console.log(response.statusCode);
    response.on("data", function(data) {
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const description = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const imageUrl = "http://openweathermap.org/img/wn/"+ icon + "@2x.png";
      console.log(temp);
      console.log(description);
      res.write("<p>The weather is currently " + description + "<p>");
      res.write("<h1>The temperature in "+ query +" is " + temp + " degrees Celcius</h1>");
      res.write("<img src="+imageUrl+">");
      res.send();
    });
  });
})


app.listen(process.env.PORT || 3000, function() {
  console.log("Started");
});
