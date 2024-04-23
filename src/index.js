const fs = require('fs');
const express = require('express');
const puppeteer = require('puppeteer');
const chromium = require("chrome-aws-lambda");

const app = express();
const port = process.env.PORT || 3000;

app.get('/api', async (req, res) => {
    const url = req.query.url || 'https://example.com';
    const fileName = req.query.filename || 'output';

    try {
        const pdfBuffer = await generatePDFFromURL(url);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${fileName}.pdf"`
        });
        res.send(pdfBuffer);
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).send('Error generating PDF');
    }
});

async function generatePDFFromURL(url) {
    chromium.setHeadlessMode = true;

    const browser = await chromium.puppeteer.launch({
        args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath || '/usr/bin/chromium',
        headless: true,
        ignoreHTTPSErrors: true,
    })

    const page = await browser.newPage();

    await page.goto(url, { waitUntil: 'networkidle0' });

    await new Promise(resolve => setTimeout(resolve, 5000));

    const pdfBuffer = await page.pdf({ format: 'A4' });

    await browser.close();

    return pdfBuffer;
}

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});