const path = require('path');
const Sequelize = require('sequelize');
const express = require('express');
const bodyParser = require('body-parser')
const moment = require('moment')
const Op = Sequelize.Op;
const models = require('./models');

require('dotenv').config()

const app = express();
const util = require('./util');
app.use(bodyParser.json());

app.set('view engine', 'pug')
app.set("views", path.join(__dirname, "views"));

const GrowthNote = models['growth_note']

app.get('/', (req, res)=> {
  GrowthNote.findAll()
  .then(items=> {
    res.send(items);
  })
})

app.post('/growth-notes', (req, res)=> {
  const {
    field_1:owner,
    field_2:subject,
    field_3:description,
    field_4:answerLineCount
  } = req.body.entry
  GrowthNote.create({owner, subject, description, answerLineCount})
    .then((growthNote)=> {
      res.send(growthNote.get({
        plain: true
      }));
    })
})

app.get('/growth-notes/html', (req, res)=> {
  const {startAt = 0, subject} = req.query
  renderToHtml({startAt,subject}, (err, html)=> {
    res.send(html);
  })
})

app.get('/growth-notes/pdf', (req, res)=> {
  const {startAt = 0, subject} = req.query
  renderToHtml({startAt,subject}, (err, html)=> {
    util.toPdf(html, (err, stream)=> {
      res.setHeader("content-type", "application/pdf");
      stream.pipe(res);
    })
  })
})

const renderToHtml = ({startAt, subject}, callBack)=> {
  let condition = {where: {}}
  if(startAt) {
    condition.where.id = { [Op.gt]: startAt}
  }
  if(subject) {
    condition.where.subject = subject
  }
  GrowthNote.findAll(condition).then(items=> {
    const practise = items.map(item=> item.get({plain: true}));
    const now = moment().format('ll');
    app.render('index', {practise, now}, callBack);
  })
}

const server = app.listen(3333, (err)=> {
  console.log(`server started at http://localhost:3333`)
})

