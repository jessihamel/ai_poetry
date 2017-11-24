var fs = require('fs');
var ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');
var dsv = require('d3-dsv');
var csv = fs.readFileSync('../src/data/poetry.csv', 'utf8');

const keys = JSON.parse(fs.readFileSync('./keys.json'))
const tone_analyzer = new ToneAnalyzerV3({
  username: keys.username,
  password: keys.password,
  version_date: '2016-05-19'
})
const poems = dsv.csvParse(csv)
const debug = false
poems.forEach((poem, i) => {
  if (debug && i > 0) {
    return
  }
  let poemText = fs.readFileSync('../public/poems/' + poem.slug + '.txt', 'utf8')
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
      fs.writeFileSync('../public/analysis/' + poem.slug + '.json', JSON.stringify(response), 'utf8')
    }
  )
})
