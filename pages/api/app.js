// api/hello.js
const fs = require('fs');
var nodemailer = require('nodemailer');
const filePath = '../../content.txt';
const textData = fs.readFileSync(filePath, 'utf8')

var transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: true,
  port: 465,
  auth: {
    user: 'kartikaysaxena12@gmail.com',
    pass: 'stdswtkaasyoonpq'
  }
});
var mailOptions = {
    from: 'kartikaysaxena12@gmail.com',
    to: 'kartikay_2101ce32@iitp.ac.in',
    subject: 'Requesting for Internship',
    text: fs.readFileSync(filePath, 'utf8'),
    attachments : [
        {
            filename: 'Resume_Kartikay.pdf',
            path: '../../Resume_Kartikay.pdf'
        }
    ]
    
};

async function main() {
    var data = await fetch('https://script.google.com/macros/s/AKfycbyO3S2CWxqsaFgzD8313-dksFBCQ_cbx48kiIey1t_NtsbMzm0gCNBlQNUzTn0v3DR8/exec');
    var json = await data.json();
    console.log(json)
    json.forEach(item => {
        

        mailOptions.text = textData
        mailOptions.to = item.email;
        console.log(item.email)
        console.log(item.isMale)
        if (item.isMale===0) {
            mailOptions.text = "Dear Ma'am" + mailOptions.text.split('$')[0] + item.company + mailOptions.text.split('$')[1]; 
        } else if(item.isMale===1) {
            mailOptions.text = "Dear Sir" + mailOptions.text.split('$')[0] + item.company + mailOptions.text.split('$')[1]; 
        }
        transporter.sendMail(mailOptions,async function(error, info){
            if (error) {
              console.log(error);
            } else {
              var sentMail = {}
              sentMail.company = item.company
              sentMail.email = item.email
              console.log('Email sent: ' + info.response);
              try {
                const updateSentEmails = await fetch("https://script.google.com/macros/s/AKfycbz3eR18bmbL47z-7cEhQI5eSgSepOkGJ-yauDtqsxbuVlqRaYk4LVDrbr1gwivXj-JcpA/exec",{
                    method: 'POST',
                    body: JSON.stringify(sentMail)
                  })
                  const responseData = await response.text();
                  console.log(responseData);
              }
              catch {
                console.log('err')
              }
            }
          });
    })
}
export default async function handler(req, res) {
    await main();
    res.status(200).json({ message: 'Hello from the API endpoint!' });
  }
  