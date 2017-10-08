const XLSX = require('xlsx');
const pdf = require('html-pdf');
const fs = require('fs');
const glob = require('glob');

// 读取文件
const files = glob.sync('./input/*.xls');
if(files.length !== 1) {
  console.warn("不存在xls文件或者有多个xls文件");
  process.exit(0);
}
const inputFile = files[0];

const workbook = XLSX.readFile(inputFile);
const first_sheet_name = workbook.SheetNames[0];
const worksheet = workbook.Sheets[first_sheet_name];
const practises = XLSX.utils.sheet_to_json(worksheet);

const html = practises.map((item)=> {
  return `
<p><pre>${item['序号']}:${item['题目描述']}</pre></p>
  `
}).reduce((pre, cur)=> {
  return pre + cur
})

const options = { format: 'A4', border: '1cm', };

pdf.create(html, options).toFile('./print.pdf', function(err, res){
  fs.unlinkSync(inputFile);
  console.log(res.filename);
});