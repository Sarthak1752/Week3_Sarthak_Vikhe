import axios from "axios";
import Weather from "./userModel";
import nodemailer from 'nodemailer';

export const saveWeather = async (city: string, country: string, geocodingApiKey: string)=>{
  try {
    const response = await axios.get(`https://api.api-ninjas.com/v1/geocoding?city=
    ${city}
    &country=${country}`
    , {headers: { 'X-Api-Key': geocodingApiKey },})

    
    console.log(response.data[0])
    return response.data[0];
    
  } catch (error:any) {
    console.log(error)
  }
};

export const fetchWeather=async(lati:number,long:number,weatherApiKey:string)=>{
  const options= {
    method: 'GET',
    url: `https://weatherapi-com.p.rapidapi.com/current.json`,
    params: { q: `${lati},${long}` },
    headers: {
      'X-RapidAPI-Key': '8e513d669fmshf460a87b0af5e34p1b6307jsn793a028da0c8',
      'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
    }
  };

  const weatherResponse = await axios.request(options);
  const weatherData = weatherResponse.data;
  
  
  storeData(weatherData);

  return weatherData;


}

export async function storeData(weatherData: any) {
  const city = weatherData.location.name;
  const country = weatherData.location.country;
  const latitude = weatherData.location.lat;
  const longitude = weatherData.location.lon;
  const weather = weatherData.current.condition.text;

  try {
    await Weather.create({
      city,
      country,
      latitude,
      longitude,
      weather
    });
    console.log('Weather data saved successfully');
  } catch (error) {
    console.error('Error saving weather data:', error);
  }
} 




export async function fetchWeatherData(city?: any): Promise<any[]> {
  try {
    if (city) {
      // Fetch all weather data for the specified city
      return await Weather.findAll({
        where: { city }
      });
    } else {
      // Fetch all weather data for all cities
      console.log(Weather.findAll())
      return await Weather.findAll();
    }
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw new Error('Failed to fetch weather data');
  }
}





// Configure the email transporter
export const transporter = nodemailer.createTransport({
  service: 'gmail.com', // You can use any email service
  auth: {
    user: 'nileshkasar929@gmail.com',
    pass: 'sfgs ytyn hjui mzxy',
  },
});

// Function to send email
export async function sendWeatherEmail(to: string, subject: string, htmlContent: string) {
  try {
    await transporter.sendMail({
      from: 'nileshkasar929@gmail.com',
      to: to,
      subject: subject,
      html: htmlContent,
    });
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

// Function to format data into an HTML table
export function htmlFormat(data: any[]): string {
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

  

