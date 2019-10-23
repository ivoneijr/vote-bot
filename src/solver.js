const axios = require("axios");
const bestcaptchasolver = require("bestcaptchasolver");
const { BCS_TOKEN } = require("./config");
const getResponse = async (key, url) => {
  bestcaptchasolver.set_access_token(BCS_TOKEN);

  return bestcaptchasolver
    .submit_recaptcha({
      page_url: url,
      site_key: key
    })
    .then(id => {
      return bestcaptchasolver
        .retrieve_captcha(id)
        .then(data => {
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
  console.log("report", id);
  axios
    .post(`https://bcsapi.xyz/api/captcha/bad/${id}`, {
      access_token: token
    })
    .then(response => {
      console.log("error reported");
    })
    .catch(error => {
      console.log("error to report error");
    });
};

module.exports = {
  getResponse,
  checkBalance,
  report
};
