# PDF Generation API Documentation

This API allows you to generate PDF files from web pages using Express and Puppeteer.

> [!error]
>
> This API is not deployed, the request of api returns a ***500 http error***

## How to Use

### Requirements

- Installed Node.js
- npm or yarn installed

### Installation

1. Clone the repository or create a new directory for the project.
2. Inside the project directory, initialize a new Node.js project:

```bash
npm init -y
```

3. Install the necessary dependencies (Express and Puppeteer):

```bash
npm install express puppeteer
```

or

```bash
yarn add express puppeteer
```

### Usage

To generate a PDF from a web page, make a GET request to the `/generate-pdf` endpoint with the following query parameters:

- `url`: The URL of the web page to be converted to PDF.
- `filename` (optional): The desired name for the PDF file (without the ".pdf" extension).

Example:

```
GET http://localhost:3000/generate-pdf?url=https://example.com&filename=myfile
```

This will generate a PDF file from the specified page and initiate the download with the specified name.
