
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const { response } = require('express');

const app = express();

const news = [];

const newsSources = [
    { 
        name: 'coindesk',
        address: 'https://www.coindesk.com/markets/',
        base: 'https://www.coindesk.com/',
        Id: 1,
    },
    { 
        name: 'cryptonews',
        address: 'https://cryptonews.net',
        base: 'https://cryptonews.net',
        Id: 2,
    },
]

newsSources.forEach((source) => {
    axios.get(source.address)
        .then(data => {
            const html = data.data;
            const $ = cheerio.load(html);
            $('a:contains("crypto"), a:contains("coin"), a:contains("tokens")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                // if(url.includes('markets') || url.includes('business')){
                    news.push({ 
                        title, 
                        url: source.base + url,
                        source: source.name,
                        sourceAddress: source.address,
                    })
                // }
            })
        })
        .catch(err => console.log(err))
})


app.get('/', (req, res) => {
    res.json({message: 'Hello there, welcome to Crypto News.'})
})

app.get('/news', (req, res) => {
    res.json(news);
})

app.get('/news/:newsId', async (req, res) => {
    const newsId = req.params.newsId;
    const newsSource = await newsSources.filter(source => source.Id == newsId)[0];
    const newsById = [];

    await axios.get(newsSource.address)
        .then(data => {
            const html = data.data;
            const $ = cheerio.load(html);
            $('a:contains("crypto"), a:contains("coin"), a:contains("tokens")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                    newsById.push({ 
                        title, 
                        url: newsSource.base + url,
                        source: newsSource.name,
                        sourceAddress: newsSource.address,
                    })
            })
        })
    res.json(newsById);
})

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`server running on PORT: ${PORT}`));