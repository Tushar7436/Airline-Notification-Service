const express = require('express');
const amqplib  = require("amqplib");
const { EmailService } = require('./services');

async function connectQueue() {
    try {
        const connection = await amqplib.connect("amqp://localhost");
        const channel = await connection.createChannel();
        await channel.assertQueue("noti-queue");
        channel.consume("noti-queue",  async (data) => {
            console.log(`${Buffer.from(data.content)}`);
            const object = JSON.parse(`${Buffer.from(data.content)}`);
            await EmailService.sendEmail("tushar7436@gmail.com", object.recipientEmail, object.subject, object.text);
            channel.ack(data);

        })
    } catch(error) {
        console.log(error);
    }
}


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
    await connectQueue();
    console.log("Queue is up")
});