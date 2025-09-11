const express = require('express');

const { ServerConfig, Logger } = require('./config');
const apiRoutes = require('./routes');

const mailsender = require('./config/email-config');

const app = express();

app.use(express.json());   
app.use(express.urlencoded({extended: true}));

app.use('/api', apiRoutes);

app.listen(ServerConfig.PORT, async () => {
    console.log(`sucessfully started the server on PORT: ${ServerConfig.PORT}`);
    Logger.info("Sucessfully started the server");
    try{
            const response = await mailsender.sendMail({
            from: ServerConfig.GMAIL_EMAIL,
            to: 'tusharagarwal2022@vitbhopal.ac.in',
            subject: 'Is the service working ?',
            content: 'Yes It is wotking'
        });
        console.log(response)
    } catch(error){
        console.log(error);
    }
});