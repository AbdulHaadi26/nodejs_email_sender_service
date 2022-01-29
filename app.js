//To get process env variables
require('dotenv').config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const compression = require('compression');
const nodeMailer = require('nodemailer');
const upload = require('./multer');
const path = require('path');
const { GoogleSpreadsheet } = require('google-spreadsheet');

//Middleware functions
app.use(express.json({ limit: '100mb' }));
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
app.use(cors());
app.use(compression({ filter: shouldCompress }));


function shouldCompress(req, res) {
    if (req.headers["x-no-compression"]) return false;
    return compression.filter(req, res);
}

let baseUrl = `https://graph.facebook.com/v11.0/${process.env.PixelId}/events?access_token=${process.env.PixelToken}`;

app.post("/paragon/send/event/fb", async (req, res) => {
  try {
    let body = req.body;
    await Axios.post(baseUrl, body);
    res.sendStatus(200);
  } catch (e) {
    res.sendStatus(400);
  }
});

app.post('/send/mail', async (req, res) => {
    try {
        const { name, email, subject, message, company } = req.body;

        var transporter = nodeMailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASS
            }
        });

        var mailOptions = {
            from: process.env.EMAIL,
            to: process.env.EMAIL,
            subject: subject,
            html: `
            <h2 style="margin-left: 50%;">Message</h2>
            <br/>
            <h3>Subject : ${subject}</h3>
            <h3>Hello, I am ${name} and here is my contact ${email}</h3>
            <h3>Company : ${company}</h3>
            <p>${message}</p> 
            <br/>
            `
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                throw new Error('Email not sent.')
            }

            console.log(info)
        });

        return res.json({ success: true });
    } catch (e) {
        console.log(e);
        res.json({ error: e.message });
    }
});

app.post('/send/ops/mail', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        var transporter = nodeMailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASS
            }
        });

        var mailOptions = {
            from: process.env.EMAIL,
            to: process.env.EMAIL,
            subject: subject,
            html: `
            <h2 style="margin-left: 50%;">Message</h2>
            <br/>
            <h3>Subject : ${subject}</h3>
            <h3>Hello, I am ${name} and here is my contact ${email}</h3>
            
            <p>${message}</p> 
            <br/>
            `
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                throw new Error('Email not sent.')
            }

            console.log(info)
        });

        return res.json({ success: true });
    } catch (e) {
        console.log(e);
        res.json({ error: e.message });
    }
});


app.post('/apply', async (req, res) => {
    try {
        const { first_name, last_name, email, age, phone, work_experience, have_car, fileName, licence } = req.body;

        var transporter = nodeMailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASS
            }
        });

        let tempName = fileName.split('--');
        tempName = tempName[tempName.length - 1];


        var mailOptions = {
            from: process.env.EMAIL,
            to: process.env.EMAIL,
            subject: 'Applied For Job',
            html: `
            <h2 style="textAlign: center;">Employment Details </h2>
            <br/>
            <h4>First Name : ${first_name}</h4>
            <h4>Last Name : ${last_name}</h4>
            <h4>Email : ${email}</h4>
            <h4>Phone Number : ${phone}</h4>
            <h4>Age : ${age}</h4>
            <h4>Work Experience : ${work_experience ? 'Yes' : 'No'}</h4>
            <h4>Have Car : ${have_car ? 'Yes' : 'No'}</h4>
            <h4>Licence : ${licence ? 'Yes' : 'No'}</h4>
            <br/>
            `,
            attachments: [{
                filename: tempName,
                path: path.join(__dirname, `/uploads/${fileName}`)
            }]
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                throw new Error('Email not sent.')
            }

            return res.json({ success: true });
        });
    } catch (e) {
        console.log(e);
        res.json({ error: e.message });
    }
});

app.post('/qoute', async (req, res) => {
    try {
        const { first_name, last_name, email, location, phone, service, info } = req.body;

        var transporter = nodeMailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASS
            }
        });

        var mailOptions = {
            from: process.env.EMAIL,
            to: process.env.EMAIL,
            subject: 'Get a qoute',
            html: `
            <h2 style="textAlign: center;">Qoute Details </h2>
            <br/>
            <h4>First Name : ${first_name}</h4>
            <h4>Last Name : ${last_name}</h4>
            <h4>Email : ${email}</h4>
            <h4>Phone Number : ${phone}</h4>
            <h4>Location : ${location}</h4>
            <h4>Service : ${service}</h4>
            <h4>Information :</h4>
            <p>${info}</p> 
            <br/>
            `,

        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                throw new Error('Email not sent.')
            }

            return res.json({ success: true });
        });
    } catch (e) {
        console.log(e);
        res.json({ error: e.message });
    }
});

app.put('/upload/resume', upload.single('resume'), function (req, res, next) {
    const file = req.file
    res.json({
        fileName: file.filename
    });
})


app.post('/paragon/send/mail', async (req, res) => {
    try {
        const { name, email, phone, message, tier } = req.body;

        var transporter = nodeMailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASS
            }
        });

        var mailOptions = {
            from: process.env.EMAIL,
            to: process.env.REC_EMAIL,
            subject: name,
            html: `
            <br/>
            <h4>Name : ${name}</h4>
            <h4>Email : ${email}</h4>
            <h4>Phone : ${phone}</h4>
            <p>${message}</p> 
            <br/>
            `
        };

        let data = {
            name,
            email,
            phone,
            tier
        }

        try {
            await googleSpreadSheet(data);
        } catch (e) {
            console.log(e)
        }


        tier !== 'Free' ? transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                throw new Error('Email not sent.')
            }

            return res.json({ success: true });
        }) : res.json({ success: true });

    } catch (e) {
        console.log(e);
        res.json({ error: e.message });
    }
});

async function googleSpreadSheet(data) {
    const doc = new GoogleSpreadsheet(process.env.spread_sheet);
    await doc.useServiceAccountAuth({
        client_email: process.env.client_email,
        private_key: process.env.private_key.replace(new RegExp('\\\\n', '\g'), '\n'),
    });

    await doc.loadInfo(); // loads document properties and worksheets

    const sheet = doc.sheetsByTitle['Paragon'];

    try {
        await sheet.addRow(data);
    } catch (e) {
        const sheet = await doc.addSheet({ headerValues: ['name', 'email', 'phone', 'tier'] });
        await sheet.updateProperties({ title: 'Paragon' });
        await sheet.addRow(data);
    }
}


app.post('/stormer/send/mail', async (req, res) => {
    try {

        let {
            datum, uhrzeit, mitarbeiter, minuten, unterschrankband, hāngeschrankband, rating, free_text, signature,
            seitenschrankband, vanReit, forentenstern, laserGroദ, klein, korpusfertigung, APLBAZ
        } = req.body;

        let text = '';

        if (unterschrankband && unterschrankband.length > 0) {
            unterschrankband.map(i => {
                text = text + i.toString();
                text = text + '<br/>';
                return i;
            });
        }
        unterschrankband = text;

        text = ''
        if (hāngeschrankband && hāngeschrankband.length > 0) {
            hāngeschrankband.map(i => {
                text = text + i.toString();
                text = text + '<br/>';
                return i;
            });
        }
        hāngeschrankband = text;

        text = ''
        if (laserGroദ && laserGroദ.length > 0) {
            laserGroദ.map(i => {
                text = text + i.toString();
                text = text + '<br/>';
                return i;
            });
        }
        laserGroദ = text;

        text = ''
        if (seitenschrankband && seitenschrankband.length > 0) {
            seitenschrankband.map(i => {
                text = text + i.toString();
                text = text + '<br/>';
                return i;
            });
        }
        seitenschrankband = text;

        text = ''
        if (vanReit && vanReit.length > 0) {
            vanReit.map(i => {
                text = text + i.toString();
                text = text + '<br/>';
                return i;
            });
        }

        vanReit = text;


        text = ''
        if (forentenstern && forentenstern.length > 0) {
            forentenstern.map(i => {
                text = text + i.toString();
                text = text + '<br/>';
                return i;
            });
        }

        forentenstern = text;

        text = ''
        if (klein && klein.length > 0) {
            klein.map(i => {
                text = text + i.toString();
                text = text + '<br/>';
                return i;
            });
        }

        klein = text;

        text = ''
        if (korpusfertigung && korpusfertigung.length > 0) {
            korpusfertigung.map(i => {
                text = text + i.toString();
                text = text + '<br/>';
                return i;
            });
        }

        korpusfertigung = text;

        text = ''
        if (APLBAZ && APLBAZ.length > 0) {
            APLBAZ.map(i => {
                text = text + i.toString();
                text = text + '<br/>';
                return i;
            });
        }

        APLBAZ = text;
        var transporter = nodeMailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASS
            }
        });

        var mailOptions = {
            from: process.env.EMAIL,
            to: process.env.REC_EMAIL,
            subject: 'Stormer-AG',
            html: `
            <div style="display: flex; flex-direction: row; justify-content: center;">
            <h1 style="textAlign: center; font-weight: 400">Details</h1>
       </div>
       <div style="display: flex; flex-direction: row; justify-content: space-between;">
            <h4 style="textAlign: center; font-weight: 400"><span style="font-weight: 600">Datum:</span> ${datum}</h4>
            <h4 style="textAlign: center; font-weight: 400"><span style="font-weight: 600; margin-left: 120px;">Uhrzeit:</span> ${uhrzeit}</h4>
       </div>
       <h4 style="textAlign: center; font-weight: 400"><span style="font-weight: 600">Mitarbeiter:</span> ${mitarbeiter}</h4>
       <h4 style="textAlign: center; font-weight: 400"><span style="font-weight: 600">Benötigte Wartungzeist in Minuten:</span> ${minuten}/180 minuten</h4>
       
       <h4 style="textAlign: center; font-weight: 400"><span style="font-weight: 600">Unterschrankband:</span>
       <br/>
       <p style="font-weight: 400">${unterschrankband}</p>
       
       <h4 style="textAlign: center; font-weight: 400"><span style="font-weight: 600">Hāngeschrankband:</span>
       <br/>
       <p style="font-weight: 400">${hāngeschrankband}</p>
       
       <h4 style="textAlign: center; font-weight: 400"><span style="font-weight: 600">Seitenschrankband:</span>
       <br/>
       <p style="font-weight: 400">${seitenschrankband}</p>
       
       <h4 style="textAlign: center; font-weight: 400"><span style="font-weight: 600">VanReit:</span>
       <br/>
       <p style="font-weight: 400">${vanReit}</p>
       
       <h4 style="textAlign: center; font-weight: 400"><span style="font-weight: 600">Forentenstern:</span>
       <br/>
       <p style="font-weight: 400">${forentenstern}</p>
       
       <h4 style="textAlign: center; font-weight: 400"><span style="font-weight: 600">Laser Groദ:</span>
       <br/>
       <p style="font-weight: 400">${laserGroദ}</p>
       
       <h4 style="textAlign: center; font-weight: 400"><span style="font-weight: 600">Klein:</span>
       <br/>
       <p style="font-weight: 400">${klein}</p>
       
       <h4 style="textAlign: center; font-weight: 400"><span style="font-weight: 600">Korpusfertigung:</span>
       <br/>
       <p style="font-weight: 400">${korpusfertigung}</p>
       
       <h4 style="textAlign: center; font-weight: 400"><span style="font-weight: 600">APL BAZ:</span>
       <br/>
       <p style="font-weight: 400">${APLBAZ}</p>
       
       
       
       <h4 style="textAlign: center; font-weight: 400"><span style="font-weight: 600">Gesamtzustand Maschinenpark heute:</span> ${rating}/5</h4>
            `,
            attachments: [
                {
                    filename: 'free-text.png',
                    content: free_text.split("base64,")[1],
                    encoding: 'base64'
                },
                {
                    filename: 'signature.png',
                    content: signature.split("base64,")[1],
                    encoding: 'base64'
                },
            ]
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                throw new Error('Email not sent.')
            }

            return res.json({ success: true });
        });
    } catch (e) {
        console.log(e);
        res.json({ error: e.message });
    }
});
http.createServer(app).listen(process.env.PORT || 80);


