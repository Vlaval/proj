const router = require('express').Router();
const fs = require('fs');
const path = require('path');
let mocks = require('../../emotiq-UI10/js/posts.json');
const {arrToMap, mapToArr} = require('../utils');
const formidable = require('formidable');
const cheerio = require('cheerio');
const sm = require('sitemap');
const git = require('simple-git');

const PUBLIC_DIR = path.join(__dirname, '../../emotiq-UI10');
const IMG_DIR = PUBLIC_DIR + '/images/blog';
const MOCKS_FILE = PUBLIC_DIR + '/js/posts.json';

router.get('/', function (req, res, next) {
  res.render('news-list', {posts: mocks.reverse()});
});

router.get('/:id', function (req, res, next) {
  if (req.params.id === "add") {
    const id = Math.random().toString(36).substr(2, 9);

    return res.render('item-editor', {post: {id}});
  } else {
    const post = mocks.filter(function (item) {
      return item.id === req.params.id;
    })[0];
    if (post) return res.render('item-editor', {post});
  }

  res.status(404).json({error: "not found"});
});

router.post('/:id', function (req, res, next) {
  const id = req.params.id;
  const form = new formidable.IncomingForm();

  if(id === 'save') return next();

  form.on('fileBegin', function (name, file) {
    if (name === "img" && file.name) {
      file.name = Math.random().toString(36).substr(2, 9) + path.extname(file.name);
      file.path = IMG_DIR + "/preview/" + file.name;
    }
    if (name === "authorImg" && file.name) {
      // file.name = Math.random().toString(36).substr(2, 9) + path.extname(file.name);
      file.path = IMG_DIR + "/users/" + file.name;
    }
  });

  form.parse(req, function (err, fields, files) {
    const mocksMap = arrToMap(mocks);
    const {title, description, content, author, date} = fields;
    const {img, authorImg} = files;
    const item = {id};

    if (title) item.title = title;
    if (description) item.description = description;
    if (content) item.content = content;
    if (author) item.author = author;
    if (date) item.date = date;
    if (img.name) item.img = "/images/blog/preview/" + img.name;
    if (authorImg.name) item.authorImg = "/images/blog/users/" + authorImg.name;

    mocksMap[id] = Object.assign(mocksMap[id] || {}, item);

    mocks = mapToArr(mocksMap);

    fs.writeFile(MOCKS_FILE, JSON.stringify(mocks), function (err) {
      if (err) console.log(err);
      res.end('success')
    });
  });
});

router.post('/save', function (req, res) {
  const {news} = req.body;
  const blog = PUBLIC_DIR + "/blog.html";
  const htmlSource = fs.readFileSync(blog, "utf8");
  const $ = cheerio.load(htmlSource);
  const sitemapPages = [
    {url: '/' , changefreq: 'weekly', priority: 1},
    {url: '/blog' , changefreq: 'weekly', priority: 1}
  ];

  const blogPages = mocks.map((post) => {
    return {
      url: `/blog-full-post.html?id=${post.id}`,
      changefreq: 'weekly',
      priority: 0.9
    }
  });

  const sitemap = sm.createSitemap({
    hostname: 'http://www.mywebsite.com',
    cacheTime: 600000,  //600 sec (10 min) cache purge period
    urls: sitemapPages.concat(blogPages)
  });

  fs.writeFileSync(__dirname +"/../../sitemap.xml", sitemap.toString());

  $('#news-container').html(news);

  fs.writeFile(blog, $.html(), (err) => {
    const repo = path.join(__dirname, '../../');
    if (err) throw err;

    git(repo)
      .exec(() => console.log('Starting push...'))
      .add('./*')
      .commit("changed posts " + (new Date).toLocaleString())
      .push(['-u', 'origin', 'master'], () => console.log('push done'));

    res.json('saved');
  });
});

router.delete('/:id', function (req, res) {
  const mocksMap = arrToMap(mocks);
  const id = req.params.id;

  if (mocksMap[id]) {
    const imgPath = mocksMap[id].img;
    let imgName = "";
    if (imgPath) imgName = imgPath.split('/').pop();

    delete mocksMap[req.params.id];

    mocks = mapToArr(mocksMap);

    fs.writeFile(MOCKS_FILE, JSON.stringify(mocks), function (err) {
      if (err) console.log(err);
      if(imgName) {
        fs.unlink(IMG_DIR + "/preview/" + imgName, (err) => {
          if (err) throw err;
          res.end(`${imgName} was deleted`);
        });
      }
      res.end();
    });
  }
});

module.exports = router;
