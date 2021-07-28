import Cors from 'cors'
import fs from 'fs'

const cors = Cors({
    methods: ['GET', 'POST', 'HEAD'],
});

function runMiddleware(req, res, fn) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result) => {
            if (result instanceof Error) {
                return reject(result);
            }
            return resolve(result);
        })
    });
}

//Endpoint for TTN application webhook. Receives downlink messages and stores the decoded
//payload in data.json.
async function handler(req, res) {
    await runMiddleware(req, res, cors);
    return new Promise(resolve => {
        let appData = req.body.decoded_payload;
        console.log(appData);
        fs.readFile('./data.json', (err, data) => {
            if (err) {
                throw err;
            }
            let fileData = JSON.parse(data);
            fileData.values.push(appData);
            fs.writeFile('./data.json', JSON.stringify(fileData), (err)=> {
                if (err) {
                    console.log(err);
                }
            });
        });
        res.status(200).end();
        return resolve();
    })
}

export default handler
