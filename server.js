
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
        base: 'https://www.coindesk.com',
        urlBranch: 'markets',
        Id: 1,
    },
    { 
        name: 'cryptonews.net',
        address: 'https://cryptonews.net',
        base: 'https://cryptonews.net',
        urlBranch: '',
        Id: 2,
    },
    { 
        name: 'cryptonews.com',
        address: 'https://cryptonews.com/news/',
        base: 'https://cryptonews.com',
        urlBranch: 'news',
        Id: 3,
    },
]

async function getNews(tempNewsSource, news){
    await axios.get(tempNewsSource.address, { 
        headers: { "Accept-Encoding": "gzip,deflate,compress" } 
    })
        .then(data => {
            const html = data.data;
            const $ = cheerio.load(html);
            $('a:contains("crypto"), a:contains("coin"), a:contains("tokens")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                if(url.includes(tempNewsSource.urlBranch)){
                    news({ 
                        title, 
                        url: tempNewsSource.base + url,
                        source: tempNewsSource.name,
                        sourceAddress: tempNewsSource.address,
                    })
                }
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

app.get('/test', (req, res) => {
    axios.get('https://cryptonews.com', { 
        headers: { "Accept-Encoding": "gzip,deflate,compress" } 
    })
        .then(data => {
            console.log(data)
        })
        .catch(err => console.log(err))
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