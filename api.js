const path = require('path');
const Sequelize = require('sequelize');
const express = require('express');
const bodyParser = require('body-parser')
const moment = require('moment')
const Op = Sequelize.Op;

require('dotenv').config()

const app = express();
const util = require('./util');
app.use(bodyParser.json());
console.log(process.env.DB_URL);
const sequelize = new Sequelize(process.env.DB_URL);

app.set('view engine', 'pug')
app.set("views", path.join(__dirname, "views"));

const GrowthNote = sequelize.define('growth_note', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  owner: {
    type: Sequelize.STRING
  },
  subject: {
    type: Sequelize.STRING
  },
  description: {
    type: Sequelize.STRING
  }
}, {
  freezeTableName: true,
  timestamps: false
});

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
    field_3:description
  } = req.body.entry
  GrowthNote.create({owner, subject, description})
    .then((growthNote)=> {
      res.send(growthNote.get({
        plain: true
      }));
    })
})

app.get('/growth-notes/html', (req, res)=> {
  const startAt = parseInt(req.query.startAt) || 0;
  renderToHtml({startAt}, (err, html)=> {
    res.send(html);
  })
})

app.get('/growth-notes/pdf', (req, res)=> {
  const startAt = parseInt(req.query.startAt) || 0;
  renderToHtml({startAt}, (err, html)=> {
    util.toPdf(html, (err, stream)=> {
      res.setHeader("content-type", "application/pdf");
      stream.pipe(res);
    })
  })
})

const renderToHtml = (param, callBack)=> {
  GrowthNote.findAll({
    where: {
      id: {
        [Op.gt]: param.startAt
      }
    }
  }).then(items=> {
    const practise = items.map(item=> item.get({plain: true}));
    const now = moment().format('ll');
    app.render('index', {practise, now}, callBack);
  })
}

const server = app.listen(3333, (err)=> {
  console.log(`server started at http://localhost:3333`)
})

