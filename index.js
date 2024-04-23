const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const port = process.env.PORT || 3000;

app.get('/generate-pdf', async (req, res) => {
    const url = req.query.url || 'https://example.com';
    const fileName = req.query.filename || 'output.pdf';

    try {
        const pdfBuffer = await generatePDFFromURL(url);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${fileName}.pdf"`
        });
        res.send(pdfBuffer);
    } catch (error) {
        console.error('Erro ao gerar o PDF:', error);
        res.status(500).send('Erro ao gerar o PDF');
    }
});

async function generatePDFFromURL(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: 'networkidle0' });

    // Aguarde 5 segundos após o carregamento da página
    await new Promise(resolve => setTimeout(resolve, 5000));

    const pdfBuffer = await page.pdf({ format: 'A4' });

    await browser.close();

    return pdfBuffer;
}

app.listen(port, () => {
    console.log(`Servidor iniciado na porta ${port}`);
});