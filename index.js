const request = require('request');
const schedule = require('node-schedule');
const fs = require('fs');
const moment = require('moment');

require('dotenv').config();

let wasWorking;
let becameDown = moment();
let becameUp = moment();
let totalCalls = 0;
let successCalls = 0;

async function callInte() {
    let reqStartTime = Date.now();
    console.log(`Checking ${process.env.SITE}`);
    return new Promise((res, rej) => {
        request.get(process.env.SITE, {
            timeout: 30000
        }, (err, resp, body) => {
            totalCalls += 1;
            const siteWorks = !err || resp?.statusCode === 200;
            if (siteWorks === true) successCalls += 1;

            if (siteWorks !== wasWorking) {
                if (siteWorks) becameUp = moment();
                if (!siteWorks) becameDown = moment();
                wasWorking = siteWorks;
            }

            const data = {
                loadTime: Date.now() - reqStartTime,
                isDown: !siteWorks ? 'Yes': 'No',
                downFrom: becameDown?.format('DD-MM-YYYY HH:mm:ss'),
                upFrom: becameUp?.format('DD-MM-YYYY HH:mm:ss'),
                downFromMoment: becameDown,
                upFromMoment: becameUp,
                totalCalls,
                successCalls
            };
            
            fs.writeFile('./temp.json', JSON.stringify(data, null, 2), () => {
                //
            });
        });
    });
}

callInte();

schedule.scheduleJob("*/1 * * * *", function() {
    callInte();
});
