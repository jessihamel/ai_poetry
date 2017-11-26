var fs = require('fs');
var ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');
var dsv = require('d3-dsv');
var csv = fs.readFileSync('../src/data/poetry.csv', 'utf8');

const versionDate = '2016-05-19'
const keys = JSON.parse(fs.readFileSync('./keys.json'))
const tone_analyzer = new ToneAnalyzerV3({
  username: keys.username,
  password: keys.password,
  version_date: versionDate
})
const poems = dsv.csvParse(csv)
const debug = false
poems.forEach((poem, i) => {
  if (debug && i > 0) {
    return
  }
  const inputFile = '../public/poems/' + poem.slug + '.txt'
  const outputFile = versionDate === '2016-05-19' ?
    '../public/analysis/' + poem.slug + '.json' :
    '../public/analysis/' + versionDate + '/' + poem.slug + '.json'

  if (fs.existsSync(outputFile)) {
    return
  }
  let poemText = fs.readFileSync(inputFile, 'utf8')
  poemText = poemText.replace(/\n/g, ' ').replace(/\s\s+/g, ' ')
  const params = {
    text: poemText,
    tones: 'emotion',
  }
  tone_analyzer.tone(params, function(error, response) {
    if (error)
      console.log('error:', error);
    else
      console.log(JSON.stringify(response, null, 2));
      sentences: 'true'
      fs.writeFileSync(outputFile, JSON.stringify(response), 'utf8')
    }
  )
})
