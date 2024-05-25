"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.htmlFormat = exports.sendWeatherEmail = exports.transporter = exports.fetchWeatherData = exports.storeData = exports.fetchWeather = exports.saveWeather = void 0;
const axios_1 = __importDefault(require("axios"));
const userModel_1 = __importDefault(require("./userModel"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const saveWeather = async (city, country, geocodingApiKey) => {
    try {
        const response = await axios_1.default.get(`https://api.api-ninjas.com/v1/geocoding?city=
    ${city}
    &country=${country}`, { headers: { 'X-Api-Key': geocodingApiKey }, });
        console.log(response.data[0]);
        return response.data[0];
    }
    catch (error) {
        console.log(error);
    }
};
exports.saveWeather = saveWeather;
const fetchWeather = async (lati, long, weatherApiKey) => {
    const options = {
        method: 'GET',
        url: `https://weatherapi-com.p.rapidapi.com/current.json`,
        params: { q: `${lati},${long}` },
        headers: {
            'X-RapidAPI-Key': 'c19db6272cmshb57302bf98667e1p19ac3fjsncf723e114701',
            'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
        }
    };
    const weatherResponse = await axios_1.default.request(options);
    const weatherData = weatherResponse.data;
    storeData(weatherData);
    return weatherData;
};
exports.fetchWeather = fetchWeather;
async function storeData(weatherData) {
    const city = weatherData.location.name;
    const country = weatherData.location.country;
    const latitude = weatherData.location.lat;
    const longitude = weatherData.location.lon;
    const weather = weatherData.current.condition.text;
    try {
        await userModel_1.default.create({
            city,
            country,
            latitude,
            longitude,
            weather
        });
        console.log('Weather data saved successfully');
    }
    catch (error) {
        console.error('Error saving weather data:', error);
    }
}
exports.storeData = storeData;
async function fetchWeatherData(city) {
    try {
        if (city) {
            // Fetch all weather data for the specified city
            return await userModel_1.default.findAll({
                where: { city }
            });
        }
        else {
            // Fetch all weather data for all cities
            console.log(userModel_1.default.findAll());
            return await userModel_1.default.findAll();
        }
    }
    catch (error) {
        console.error('Error fetching weather data:', error);
        throw new Error('Failed to fetch weather data');
    }
}
exports.fetchWeatherData = fetchWeatherData;
// Configure the email transporter
exports.transporter = nodemailer_1.default.createTransport({
    service: 'gmail.com', // You can use any email service
    auth: {
        user: 'nileshkasar929@gmail.com',
        pass: 'sfgs ytyn hjui mzxy',
    },
});
// Function to send email
async function sendWeatherEmail(to, subject, htmlContent) {
    try {
        await exports.transporter.sendMail({
            from: 'nileshkasar929@gmail.com',
            to: to,
            subject: subject,
            html: htmlContent,
        });
        console.log('Email sent successfully');
    }
    catch (error) {
        console.error('Error sending email:', error);
    }
}
exports.sendWeatherEmail = sendWeatherEmail;
// Function to format data into an HTML table
function htmlFormat(data) {
    let tableRows = data.map((entry) => `
    <tr>
      <td>${entry.id}</td>
      <td>${entry.city}</td>
      <td>${entry.country}</td>
      <td>${entry.weather}</td>
    </tr>
  `).join('');
    return `
    <table border="1" cellpadding="5" cellspacing="0">
      <thead>
        <tr>
          <th>ID</th>
          <th>City</th>
          <th>Country</th>
          
          <th>Weather</th>
        </tr>
      </thead>
      <tbody>
        ${tableRows}
      </tbody>
    </table>
  `;
}
exports.htmlFormat = htmlFormat;
