
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const { response } = require('express');

const app = express(); 


app.get('/', (req, res) => {
    res.json({message: 'Hello there, welcome to Crypto News.'})
})

app.get('/news', async (req, res) => {
    await axios.get("https://www.coindesk.com")
        .then(data => {
            res.json({news: data.data})
        })
        .catch(err => console.log(err))
    // const rese = await axios.get("https://www.coindesk.com")
    // res.json({data: JSON.stringify(rese.data)})
})

const PORT = 5050;
app.listen(PORT, () => console.log(`server running on PORT: ${PORT}`));