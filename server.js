const express = require('express');
const app = express();
app.set('view engine', 'ejs');
app.use(express.static('assets'));

require('dotenv').config();

const fs = require('fs');
const moment = require('moment');

app.get('/icon', (req, res) => {
    let data = JSON.parse(fs.readFileSync('./temp.json'));
    res.sendFile(`${__dirname}/assets/${data.isDown === 'Yes' ? 'circle-red.ico' : 'circle-green.ico'}`);
});

app.get('/', (req, res) => {
    let data = JSON.parse(fs.readFileSync('./temp.json'));
    data['dTime'] = moment(data.downFromMoment)?.fromNow(true);
    data['uTime'] = moment(data.upFromMoment)?.fromNow(true);
    data['successRate'] = `${((data.successCalls / data.totalCalls) * 100).toFixed(2)}%`
    res.render('index.ejs', data);
});

app.listen(process.env.PORT, () => console.log(`Started on ${process.env.PORT}`));