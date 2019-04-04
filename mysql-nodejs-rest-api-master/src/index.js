var cors = require('cors')
const express = require('express');
const app = express();
app.use(cors())

// Settings
app.set('port', process.env.PORT || 4201);
//app.use(cors({ origin: 'http://localhost:4200', methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'x-access-token', 'XSRF-TOKEN'], preflightContinue: false }));



// Middlewares
app.use(express.json());

// Routes
app.use(require('./routes/usuarios'));

// Starting the server
app.listen(app.get('port'), () => {
  console.log(`Server on port ${app.get('port')}`);
});
