import { saveWeather,fetchWeather, fetchWeatherData,sendWeatherEmail,htmlFormat } from './service';
import express from 'express';
import sequelize from './pgConfig';
import bodyParser from 'body-parser';
import nodemailer from 'nodemailer'

// Replace these with your actual API keys
const geocodingApiKey = 'j6uPVpk0YFA4XzoLASux1Q==btHqA4uNxl1pQaXS';
const weatherApiKey ='8e513d669fmshf460a87b0af5e34p1b6307jsn793a028da0c8';

const app = express();
app.use(bodyParser.json());

app.post('/api/saveWeatherMapping', async (req, res) => {
  try {
    const cities = req.body;

    // Fetch coordinates for each city and country pair
    const coordinatesPromises = cities.map(async (cityy: { city: string; country: string }) => {
      
        const { city, country } = cityy;
        const { latitude, longitude } = await saveWeather(city, country, geocodingApiKey);
        const weather = await fetchWeather(latitude,longitude,weatherApiKey)
        
        return { city, country, latitude, longitude,weather };
      } 

    );
    
    // Wait for all coordinate fetching requests to complete
    const coordinates = await Promise.all(coordinatesPromises);

    // Filter out any null values (invalid coordinates)
    const validCoordinates = coordinates.filter(coord => coord !== null);

    res.status(200).json({ message: 'Coordinates fetched successfully', data: validCoordinates });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.get('/api/getWeatherData',async(req,res)=>{
  try {
    const city: any = req.query.city;

  const weatherData =await fetchWeatherData(city);

  res.json(weatherData);
  } catch (error:any) {
    console.log(error)
  }
  
})


app.post('/api/sendEmail', async (req, res) => {
  const { to, city } = req.body;

  try {
    const weatherData = await fetchWeatherData(city);
    const formattedData = htmlFormat(weatherData);

    await sendWeatherEmail(to, 'Weather Data', formattedData);
    res.status(200).send('Email sent successfully');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred while sending the email.');
  }
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

