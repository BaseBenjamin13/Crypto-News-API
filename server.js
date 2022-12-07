
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express(); 


app.get('/', (req, res) => {
    res.json({message: 'Hello there, welcome to Crypto News.'})
})



const PORT = 5050;
app.listen(PORT, () => console.log(`server running on PORT: ${PORT}`));