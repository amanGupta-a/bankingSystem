require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Backend Ledger " <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });
  } catch (error) {
    throw error;
  }
};
async function sendRegistrationEmail(userEmail, name){
    const subject='Welcome to Backend Ledger';
    const text=`Hello ${name}, \n\n Thank You for registering at Backend Ledger.
    \n\n
    Best Regards from Backend Ledger`;
    const html=`
    <p>Hello ${name},</p><p> Thank You for registering at Backend Ledger.</p>
    <p>
    Best Regards from Backend Ledger
    </p>
    `
    await sendEmail(userEmail,subject, text,html);
}

async function sendTransactionSuccessMail(userEmail, name, Amount, toAccount){
  const subject="Transactions successful";
  const text=`Hello, dear ${name}, \n\n your transaction for amount ${Amount} is credited to account ${toAccount} .
  \n\n If NOT DONE BY YOU contact us @1234`;
  const html=`<p>Hello ${name}, </p> 
  <p>your transaction for amount ${Amount} is credited to account ${toAccount} .</p>
  <p>If NOT DONE BY YOU contact us @1234</p>`
  await sendEmail(userEmail, subject,text, html);
}

async function sendTransactionFailMail(userEmail, name, Amount, toAccount){
  const subject="Transactions Failed";
  const text=`Hello ${name}, \n\n your transaction for amount ${Amount} to account ${toAccount} is FAILED.
  \n\n Deducted amount (if any) will be reversed`;
  const html=`<p>Hello ${name}, </p> 
  <p>your transaction for amount ${Amount} to account ${toAccount} is Failed.</p>
  <p>Deducted amount(if any) will be reversed</p>`
  await sendEmail(userEmail, subject,text, html);
}

async function sendTransactionSuccessAdminMail(userEmail, name, Amount, toAccount){
  const subject="Amount credited from branch";
  const text=`Hello ${name}, \n\n transaction of amount ${Amount} to your account ${toAccount} is completed
  , CASH DEPOSITED.
  \n\n Thank you for banking with us`;

  const html=`<p>Hello ${name}, </p> 
  <p>transaction of amount ${Amount} to your account ${toAccount} is completed.</p>
  <p>CASH DEPOSITED at BRANCH</p>
  <p>Thank you for banking with us </p>`;
  await sendEmail(userEmail, subject,text, html);
}

module.exports = {
    sendRegistrationEmail,
    sendTransactionFailMail,
    sendTransactionSuccessMail,
    sendTransactionSuccessAdminMail
}