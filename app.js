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
        private_key: process.env.private_key,
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

http.createServer(app).listen(process.env.PORT);


