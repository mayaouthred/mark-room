import Cors from 'cors'
import fs from 'fs'
import path from 'path'
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
    //CORS handling.
    await runMiddleware(req, res, cors);

    //Return a promise to satisfy the Next.js requirements.
    return new Promise(resolve => {
        //Append the decoded_payload to data.json.
        let appData = req.body.uplink_message.decoded_payload;
        console.log(appData);
        fs.readFile(path.join(process.cwd(), 'data.json'), (err, data) => {
            if (err) {
                throw err;
            }
            let fileData = JSON.parse(data);
            fileData.values.push(appData);
            fs.writeFile(path.join(process.cwd(), 'data.json'), JSON.stringify(fileData), (err)=> {
                if (err) {
                    console.log(err);
                }
            });
        });
        //Return the promise and give a positive status to res.
        res.status(200).end();
        return resolve();
    })
}

export default handler
