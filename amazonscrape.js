

const puppeteer = require('puppeteer');

(async () => {
  // Launch the browser
  const browser = await puppeteer.launch({ headless: true }); // Set headless: false if you want to see the browser in action
  const page = await browser.newPage();

  // Navigate to Amazon (replace with your target Amazon URL)
  const searchUrl = 'https://www.amazon.com/s?k=laptop';  // Example: searching for "laptop"
  await page.goto(searchUrl, { waitUntil: 'domcontentloaded' });

  // Wait for the products to load
  await page.waitForSelector('.s-main-slot .s-result-item');

  // Scrape product data
  const products = await page.evaluate(() => {
    // Select all product elements
    const items = Array.from(document.querySelectorAll('.s-main-slot .s-result-item'));

    // Extract the details for each product
    return items.map(item => {
      const title = item.querySelector('h2 .a-link-normal')?.innerText || 'N/A';
      const priceWhole = item.querySelector('.a-price-whole')?.innerText || '';
      const priceFraction = item.querySelector('.a-price-fraction')?.innerText || '';
      const price = priceWhole && priceFraction ? `${priceWhole}${priceFraction}` : 'Price Not Available';
      const link = item.querySelector('h2 a.a-link-normal')?.href || 'No Link';
      const reviews = item.querySelector('.a-size-small .a-size-base')?.innerText || 'No Reviews';

      // Return product data as an object
      return { title, price, link, reviews };
    });
  });

  console.log(products);

  // Close the browser
  await browser.close();
})();
