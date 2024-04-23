const express = require('express');
const puppeteer = require('puppeteer');

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
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: 'networkidle0' });

    // Wait for 5 seconds after the page is loaded
    await new Promise(resolve => setTimeout(resolve, 5000));

    const pdfBuffer = await page.pdf({ format: 'A4' });

    await browser.close();

    return pdfBuffer;
}

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});