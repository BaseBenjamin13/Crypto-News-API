
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const { response } = require('express');

const app = express();

const news = [];
const newsById = [];

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

async function getNews(tempNewsSource, news){
    await axios.get(tempNewsSource.address)
        .then(data => {
            const html = data.data;
            const $ = cheerio.load(html);
            $('a:contains("crypto"), a:contains("coin"), a:contains("tokens")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                news({ 
                    title, 
                    url: tempNewsSource.base + url,
                    source: tempNewsSource.name,
                    sourceAddress: tempNewsSource.address,
                })
            })
        })
        .catch(err => console.log(err))
}

newsSources.forEach((source) => {
    getNews(source, news.push.bind(news))
})


app.get('/', (req, res) => {
    res.json({message: 'Hello there, welcome to Crypto News.'})
})

app.get('/news', (req, res) => {
    res.json(news);
})

app.get('/news/:newsId', async (req, res) => {
    newsById.length = 0;
    const newsId = req.params.newsId;
    const newsSource = await newsSources.filter(source => source.Id == newsId)[0];
    await getNews(newsSource, newsById.push.bind(newsById))

    res.json(newsById)
})



const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`server running on PORT: ${PORT}`));