const express = require('express');
const app = express();
const path = require('path');
const categoriesRoutes = require('./routes/categories');
const partsRoutes = require('./routes/parts');

require('dotenv').config();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/categories', categoriesRoutes);
app.use('/parts', partsRoutes);

app.get('/', (req, res) => {
  res.render('home');
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
