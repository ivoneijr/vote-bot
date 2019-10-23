const puppeteer = require("puppeteer");
const bestcaptchasolver = require("bestcaptchasolver");

const { BCS_TOKEN, PAGE_URL, SITE_KEY, OPTIONS } = require("./config");
const { getRandomIntInclusive } = require("./utils");
const { getResponse, report } = require("./solver");

bestcaptchasolver.set_access_token(BCS_TOKEN);

let successCount = 0;
let errorCount = 0;

const run = async () => {
  try {
    const d1 = new Date().getTime();

    // open the headless browser
    const browser = await puppeteer.launch(OPTIONS);

    // open a new page
    var page = await browser.newPage();

    // enter url in page
    page.goto(PAGE_URL, { waitUntil: "load" });

    // wait for
    await page.waitForSelector("input[type=email]");
    await page.waitForSelector("input[type=submit]");
    await page.waitForSelector(".g-recaptcha");

    // type
    await page.type(
      "input[type=email]",
      `dereck_${getRandomIntInclusive()}@gmail.com`,
      { delay: 10 }
    );

    //getToken
    const response = await getResponse(SITE_KEY, PAGE_URL);

    // set token in recaptcha response
    await page.evaluate(
      `document.getElementById("g-recaptcha-response").innerHTML="${response.gresponse}";`
    );
    await bestcaptchasolver.set_access_token(response.gresponse);

    // disable button
    await page.$eval("input[type=submit]", e => e.removeAttribute("disabled"));
    await page.click("input[type=submit]");

    // success vote ?
    const found = await page.evaluate(() =>
      window.find("Voto computado com sucesso!")
    );

    if (found) {
      successCount += 1;
    } else {
      errorCount += 1;

      report(BCS_TOKEN, response.id);
    }

    console.log("success: ", successCount);
    console.log("errors: ", errorCount);
    console.log("time: ", new Date().getTime() - d1);

    await browser.close();
  } catch (e) {}
};

function start(counter) {
  if (counter < 1000) {
    setTimeout(function() {
      counter++;
      console.log(counter);
      run();
      run();
      // run();
      start(counter);
    }, 160000);
  }
}
start(0);

// run();
// run();
// run();
// run();
// run();
