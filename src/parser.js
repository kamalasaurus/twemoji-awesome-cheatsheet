var fs = require('fs');

var awesomeCss = fs.readFileSync('twemoji-awesome.css', 'utf8');
var names = awesomeCss
  .split('\n\n')
  .map(function(name) {
    return name.match(/[^\s]+/)[0]; // only get class names from the css rule
  })
  .filter(function(name) {
    return !~[
      '.twa-lg',
      '.twa-2x',
      '.twa-3x',
      '.twa-4x',
      '.twa-5x'
    ].indexOf(name); // filter out the non-emoji declarations
  })
  .slice(1) // remove the initial declaration of base styles

fs.writeFileSync('twemoji-list.json', JSON.stringify(names, null, 4));

console.log('twemoji list generated');

