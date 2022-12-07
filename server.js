
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const { response } = require('express');

const app = express(); 


app.get('/', (req, res) => {
    res.json({message: 'Hello there, welcome to Crypto News.'})
})

app.get('/news', (req, res) => {
    const news = [];

    axios.get('https://www.coindesk.com/markets/')
        .then(data => {
            const html = data.data;
            const $ = cheerio.load(html);
            $('a:contains("crypto"), a:contains("coin")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                news.push({ title, url })
            })
            res.json(news)
        })
        .catch(err => console.log(err))
})

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`server running on PORT: ${PORT}`));