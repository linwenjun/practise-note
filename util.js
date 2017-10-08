const pdf = require('html-pdf');

const toHtml = (practises)=> {
  return practises.map((item, key)=> {
    return `
  <p><pre>${key + 1}:${item['description']}</pre></p>
    `
  }).reduce((pre, cur)=> {
    return pre + cur
  })
}

const toPdf = (practises, done)=> {
  const options = { format: 'A4', border: '1cm', };
  const html = toHtml(practises);
  pdf.create(html, options).toStream(done);
}

module.exports = {toPdf}
