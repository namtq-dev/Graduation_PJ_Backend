const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const { OAuth2 } = google.auth;

const OAUTH_LINK = 'https://developers.google.com/oauthplayground';

const {
  SERVER_EMAIL,
  GOOGLE_MAILING_ID,
  GOOGLE_MAILING_SECRET,
  GOOGLE_MAILING_REFRESH_TOKEN,
} = process.env;

const auth = new OAuth2(GOOGLE_MAILING_ID, GOOGLE_MAILING_SECRET, OAUTH_LINK);

exports.sendVerificationEmail = (email, name, url) => {
  auth.setCredentials({
    refresh_token: GOOGLE_MAILING_REFRESH_TOKEN,
  });
  const accessToken = auth.getAccessToken();
  const smtp = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: SERVER_EMAIL,
      clientId: GOOGLE_MAILING_ID,
      clientSecret: GOOGLE_MAILING_SECRET,
      refreshToken: GOOGLE_MAILING_REFRESH_TOKEN,
      accessToken,
    },
  });

  const mailOptions = {
    from: SERVER_EMAIL,
    to: email,
    subject: 'Aimer email verification',
    html: `
    <div
      style="
        max-width: 700px;
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        font-family: Roboto;
        font-weight: 600;
        color: #3b5998;
      "
    >
      <img
        src="https://res.cloudinary.com/dmhcnhtng/image/upload/v1645134414/logo_cs1si5.png"
        alt=""
        style="width: 30px; margin-right:10px"
      />
      <span>Account activation: Activate your Aimer account</span>
    </div>
    <div
      style="
        padding: 1rem 0;
        border-top: 1px solid #e5e5e5;
        border-bottom: 1px solid #e5e5e5;
        color: #141823;
        font-size: 17px;
        font-family: Roboto;
      "
    >
      <span>Hello ${name},</span>
      <div style="padding: 20px 0">
        <span style="padding: 1.5rem 0">
          You recently created a new account on Aimer.
          To complete the registration, please confirm your email address.
        </span>
      </div>
      <a
        href="${url}"
        style="
          width: 200px;
          padding: 10px 15px;
          background: #4c649b;
          color: #fff;
          text-decoration: none;
          font-weight: 600;
        "
      >
        Confirm your account
      </a>
      <br />
      <div style="padding-top: 20px">
        <span style="margin: 1.5rem 0; color: #898f9c">
          Aimer allows you to stay in touch with all your friends.
          Once registered on Aimer, you can share photos, organize events
          and so much more.
        </span>
      </div>
    </div>
    `,
  };
  smtp.sendMail(mailOptions, (err, res) => {
    if (err) return err;
    return res;
  });
};
