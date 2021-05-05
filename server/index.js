const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/hi', (req, res) => {
    res.send('Hello!');
})

app.listen(port, () => console.log(`listening at port ${port}`));
