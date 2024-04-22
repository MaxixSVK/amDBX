const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.static('frontend'));

app.use((req, res, next) => {
    res.status(404).send("404-chan: Page not found");
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(process.env.WEB_PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.WEB_PORT}`);
});