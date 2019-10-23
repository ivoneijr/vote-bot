const axios = require("axios");
const bestcaptchasolver = require("bestcaptchasolver");
const { BCS_TOKEN } = require("./config");
const getResponse = async (key, url) => {
  bestcaptchasolver.set_access_token(BCS_TOKEN);

  return bestcaptchasolver
    .submit_recaptcha({
      page_url: url,
      site_key: key,
      v3_min_score: "0.3"
    })
    .then(id => {
      return bestcaptchasolver
        .retrieve_captcha(id)
        .then(data => {
          console.log("solved =)");
          return data;
        })
        .catch(e => {
          console.log("erro em retrieve_captcha ", e);
        });
    })
    .catch(e => {
      console.log("erro em submit_recaptcha ", e);
    });
};

const checkBalance = async token => {
  bestcaptchasolver.set_access_token(token);

  return bestcaptchasolver.account_balance().then(balance => {
    console.log("Balance: $", balance);
  });
};

const report = async (token, id) => {
  console.log("reporting ", id);
  axios
    .post(`https://bcsapi.xyz/api/captcha/bad/${id}`, {
      access_token: token
    })
    .then(response => {
      console.log("captcha reported ok ", id);
    })
    .catch(error => {
      console.log("error to report captcha");
    });
};

module.exports = {
  getResponse,
  checkBalance,
  report
};
