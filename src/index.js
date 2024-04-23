const fs = require('fs');
const express = require('express');
const puppeteer = require('puppeteer');
const chromium = require("@sparticuz/chromium");

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

    fs.rename('./bin/libnss3.so', '~/tmp/chrome/libnss3.so', (err) => {
        if (err) {
            console.error('Erro ao mover o arquivo:', err);
            return;
        }
    })

    const browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath,
    });

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