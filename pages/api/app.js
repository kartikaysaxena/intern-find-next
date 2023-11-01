import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import fetch from 'node-fetch';

const filePath = path.join(process.cwd(), 'public', 'content.txt');
const textData = fs.readFileSync(filePath, 'utf8');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER, 
    pass: process.env.SMTP_PASS
  }
});

export default async function handler(req, res) {
  try {
    const data = await fetch('https://script.google.com/macros/s/AKfycbyO3S2CWxqsaFgzD8313-dksFBCQ_cbx48kiIey1t_NtsbMzm0gCNBlQNUzTn0v3DR8/exec');
    const json = await data.json();
    console.log(json);

    const mailPromises = json.map(async item => {
      const mailOptions = {
        from: 'kartikaysaxena12@gmail.com',
        to: item.email,
        subject: 'Requesting for Internship',
        text: textData,
        attachments: [
          {
            filename: 'Resume_Kartikay.pdf',
            path: path.join(process.cwd(), 'public', 'Resume_Kartikay.pdf')
          }
        ]
      };

      mailOptions.text = textData;
      console.log(item.email);
      console.log(item.isMale);

      if (item.isMale === 0) {
        mailOptions.text = `Dear Ma'am ${textData.split('$')[0] + item.company + textData.split('$')[1]}`;
      } else if (item.isMale === 1) {
        mailOptions.text = `Dear Sir ${textData.split('$')[0] + item.company + textData.split('$')[1]}`;
      }

      try {
        const info = await transporter.sendMail(mailOptions);
        const getCurrentDate = () => {
          const today = new Date();
          const day = String(today.getDate()).padStart(2, '0');
          const month = String(today.getMonth() + 1).padStart(2, '0');
          return `${day}/${month}`;
        };
        const sentMail = {
          company: item.company,
          email: item.email,
          date: getCurrentDate()
        };
        console.log('Email sent:', info.response);
        const updateSentEmails = await fetch("https://script.google.com/macros/s/AKfycbwQojRIk8eBxRJET1EWWWb_MOCRb3mdpbho6GKGTb3wI2_APijJzn1BuuJ5EDW_ZzekoQ/exec", {
          method: 'POST',
          body: JSON.stringify(sentMail)
        });
        const responseData = await updateSentEmails.text();
        console.log(responseData);
      } catch (error) {
        console.error('Error sending email:', error);
      }
    });

    await Promise.all(mailPromises);

    res.status(200).json({ message: 'Emails sent successfully!' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
