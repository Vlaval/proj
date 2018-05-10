const path = require('path');
const express = require('express');
const fs = require('fs');
const api = require('./api');
const bodyParser = require('body-parser');
const port = 3001;
const git = require('simple-git');

const app = express();

app.set('views', './views');
app.set('view engine', 'pug');


app.use(bodyParser.urlencoded({limit: '50mb', extended: false}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(express.static('../emotiq-UI10'));
app.use('/news-editor', api);

app.get('/', (req, res) => fs.readFile('../emotiq-UI10/index.html', (err, data) => err ? console.log(err) : res.status(200).end(data)));

app.listen(port, 'localhost', function (err) {
    if (err) {
        console.log(err);
        return;
    }
    const repo = path.join(__dirname, '../');
    git(repo)
        .pull((err, update) => {
            if(update && update.summary.changes) {
                require('child_process').exec('npm restart');
            }
        })
        .exec(() => console.log('pull done.'));

    console.log('Listening at http://localhost:' + port);
});
