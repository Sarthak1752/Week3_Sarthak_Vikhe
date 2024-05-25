// import { Pool } from 'pg';
import { Sequelize } from 'sequelize';


// const pool = new Pool({
  
 const sequelize = new Sequelize({
    username: 'postgres',
    host: 'localhost',
    database: "postgres",
    password: "sarthak",
    port: 5432,
    dialect: "postgres",
});


sequelize.authenticate()
  .then(() => {
    console.log('Connected to database Succesfully.');
  })
  .catch((error) => {
    console.error('Failed to connect to the database:', error);
  });


sequelize.sync()
  .then(() => {
    console.log('Models synchronized with the database.');
  })
  .catch((err) => {
    console.error('Unable to synchronize models with the database:', err);
  });



export default sequelize;