const Sequelize = require('sequelize');
const express = require('express');
const bodyParser = require('body-parser')
require('dotenv').config()

const app = express();
const util = require('./util');
app.use(bodyParser.json());
console.log(process.env.DB_URL);
const sequelize = new Sequelize(process.env.DB_URL);

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
    res.send(items[0]);
  })
})

app.post('/growth-note', (req, res)=> {
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

app.get('/growth-note/pdf', (req, res)=> {
  GrowthNote.findAll()
    .then(items=> {
      const practise = items.map(item=> item.get({plain: true}));
      util.toPdf(practise, (err, stream)=> {
        res.setHeader("content-type", "application/pdf");
        stream.pipe(res);
      })
    })
})

const server = app.listen(3333, (err)=> {
  console.log(`server started at http://localhost:3333`)
})

