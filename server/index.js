const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));

// fallback option for invalid paths
app.get(/.*/, (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
})

app.listen(port, () => console.log(`listening at port ${port}`));
