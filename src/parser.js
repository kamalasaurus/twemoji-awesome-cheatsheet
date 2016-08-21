var fs = require('fs');
var path = require('path')

///////////////////////////////////////////////////////////////////////////////
// CONSTANTS
///////////////////////////////////////////////////////////////////////////////

var HTML_OUTPUT = path.join(__dirname, '..', 'docs', 'index.html');

var TWEMOJI_PATH = path.join(__dirname, '..', 'modules', 'twemoji-awesome', 'twemoji-awesome.css');
var TWEMOJI_OUTPUT = path.join(__dirname, '..', 'docs', 'twemoji-awesome.css');

var STYLES_PATH = path.join(__dirname, 'styles.css');
var STYLES_OUTPUT = path.join(__dirname, '..', 'docs', 'styles.css');

var GROUPS_PATH = path.join(__dirname, '..', 'modules', 'twemoji-awesome', 'modules', 'twemoji-possum', 'dist', 'emoji-groups.json');


var awesomeCss = fs.readFileSync(TWEMOJI_PATH, 'utf8');
var groups = require(GROUPS_PATH);


///////////////////////////////////////////////////////////////////////////////
// PRIVATE FUNCTIONS
///////////////////////////////////////////////////////////////////////////////

// only get class names and codePoints from the css rule
function stripExcess(rule) {
  name = rule
    .match(/[^\s]+/)[0]
    .replace(/\./g, '');

  codePoint = rule
    .split('/')
    .slice(-1)[0]
    .split('.')[0];

  return [name, codePoint];
}

// filter out the non-emoji declarations
function filterModifiers(namePointPair) {
  return !~[
    'twa-lg',
    'twa-2x',
    'twa-3x',
    'twa-4x',
    'twa-5x'
  ].indexOf(namePointPair[0]);
}

// group human readable names by code-point to display in series
function groupByPoint(group, namePointPair) {
  var name = namePointPair[0];
  var point = namePointPair[1];
  group[point] ? group[point].push(name) : group[point] = [name];
  return group;
}


// context group names
function groupByName(elementName) {
  var map = [
    'smilies-and-people',
    'animals-and-nature',
    'food-and-drink',
    'activity',
    'travels-and-places',
    'objects',
    'symbols',
    'flags',
  ];

  var key = selectName(elementName);
  return map[key];
}

// select unmatched names from the Mac OS list for a group they belong in
function selectName(name) {
  return [
    [ // smilies-and-people
      /^(?=.*\bface\b)(?=((?!fox).)*$).*$/,
      /snowboarder/,
      /horse-racing/,
      /skin-type/,
      /family/,
      /couple/,
      /kiss/,
      /dancing/,
      /hand/,
      /fist/,
      /rolling-on-the-floor/,
      /pregnant/,
      /selfie/,
      /prince/,
      /man-in-tuxedo/,
      /mother/,
      /shrug/,
      /cartwheel/,
      /pointing/
    ],
    [ // animals-and-nature
      /sun/,
      /cloud/,
      /snowman/,
      /comet/,
      /snowflake/,
      /wilted-flower/,
      /bat/,
      /shark/,
      /owl/,
      /fox/,
      /butterfly/,
      /deer/,
      /gorilla/,
      /lizard/,
      /rhino/,
      /shrimp/,
      /squid/,
      /eagle/,
      /duck/,
    ],
    [ // food-and-drink
      /beverage/,
      /croissant/,
      /avocado/,
      /cucumber/,
      /bacon/,
      /potato/,
      /carrot/,
      /baguette/,
      /salad/,
      /shallow-pan/,
      /egg/,
      /milk/,
      /peanuts/,
      /flatbread/,
      /kiwifruit/,
      /pancakes/
    ],
    [ // activity
      /scooter/,
      /canoe/,
      /juggling/,
      /fencer/,
      /wrestlers/,
      /water-polo/,
      /handball/,
      /boxing/,
      /martial-arts/,
      /soccer/,
      /baseball/,
      /sailboat/,
      /tent/,
      /flag-in-hole/
    ],
    [ // travels-and-places
      /church/,
      /fountain/,
      /fuel/,
    ],
    [ //objects
      /keyboard/,
      /umbrella/,
      /hot-springs/,
      /anchor/,
      /scissors/,
      /airplane/,
      /envelope/,
      /black-nib/,
      /octagonal-sign/,
      /shopping-trolley/,
      /drum/,
      /glass/,
      /spoon/,
      /goal-net/,
      /medal/,
      /watch/,
      /hourglass/,
      /phone/,

    ],
    [ //symbols
      /exclamation/,
      /information/,
      /arrow/,
      /ballot/,
      /skull/,
      /radioactive/,
      /biohazard/,
      /cross/,
      /dharma/,
      /aries/,
      /taurus/,
      /sagittarius/,
      /capricorn/,
      /aquarius/,
      /pisces/,
      /spade/,
      /club/,
      /hearts/,
      /heart-suit/,
      /heavy-heart/,
      /red-heart/,
      /diamond/,
      /check-mark/,
      /multiplication-x/,
      /star/,
      /asterisk/,
      /sparkle/,
      /wavy-dash/,
      /ideograph/,
      /mahjong/,
      /button/,
      /squared/,
      /black-heart/,
      /speech-bubble/,
      /hash/,
      /circle/,
      /square/,
      /yin-yang/,
      /gemini/,
      /cancer/,
      /leo/,
      /virgo/,
      /libra/,
      /scorpius/,
      /recycling/,
      /wheelchair/,
      /warning/,
      /voltage/,
      /circle/,
      /no-entry/,
      /pencil/,
      /cross/,
      /alternation/,
      /peace/,
      /zero/,
      /one/,
      /two/,
      /three/,
      /four/,
      /five/,
      /six/,
      /seven/,
      /eight/,
      /nine/,
      /ten/,
    ],
    [ //flags
      /^(?=.*\bflag\b)(?=^((?!rainbow).)*$)(?=^((?!pirate).)*$)(?=^((?!hole).)*$).*$/,
    ],
  ].map(function(tests) {
    return tests
      .map(function(test) { return test.test(name); })
      .some(function(isTrue) { return isTrue; });
  }).indexOf(true);

}


///////////////////////////////////////////////////////////////////////////////
// PARSE CSS
///////////////////////////////////////////////////////////////////////////////


// generate groups from css
var elementGroups = awesomeCss
  .split('\n\n')
  .slice(1)
  .map(stripExcess)
  .filter(filterModifiers)
  .reduce(groupByPoint, {});

// group icon-name groups by vendor-specific context groups such as  "smilies-and-people"
var contextGroups = Object
  .keys(elementGroups)
  .reduce(function(cGroups, codePoint) {
    elements = elementGroups[codePoint];
    group = groups[codePoint] || groupByName(elements[0]) || 'twemoji-custom';
    cGroups[group] ? cGroups[group].push(elements) : cGroups[group] = [elements];
    return cGroups;
  }, {});

// this is a manually globbed set of the context group names in the order they should
// be displayed, there are ways to automate this to make it more robust, but I don't
// think it's worth pursuing at this time
var sortedContextGroups = [
    'smilies-and-people',
    'twemoji-custom',
    'animals-and-nature',
    'food-and-drink',
    'activity',
    'travels-and-places',
    'objects',
    'symbols',
    'flags',
];

// generate sections of html
var sections = sortedContextGroups
  .map(makeSection);

///////////////////////////////////////////////////////////////////////////////
// HTML GENERATORS
///////////////////////////////////////////////////////////////////////////////


var header = [
  '<!doctype html>',
  '<html>',
  '\t<head>',
  '\t\t<meta charset="UTF-8">',
  '\t\t<title>Twemoji Awesome Cheatsheet! 😃🤑😂</title>',
  '\t\t<link rel="stylesheet" type="text/css" href="twemoji-awesome.css">',
  '\t\t<link rel="stylesheet" type="text/css" href="styles.css">',
  '\t</head>',
  '\t<body>',
  '\t\t<div class="container">',
].join('\n');

var subheader = [
  '\t\t\t<div class="subheader">',
  '\t\t\t\t<h1>Twemoji Awesome Cheatsheet</h1>',
  '\t\t\t\t<p>if a class with a weird character isn\'t working, declare &lt;meta charset=&quot;UTF-8&quot;&gt; in the head of your app if you need something like å or ô, they should all be removed, though</p>',
  '\t\t\t</div>',
].join('\n');

var footer = [
  '\t\t</div>',
  '\t</body>',
  '</html>',
].join('\n');

function makeSection(groupName) {
  var elements = contextGroups[groupName]
    .map(makeElement)
    .join('\n');

  return [
    '\t\t\t<div class="section">',
    '<h2>',
    groupName.split('-').map(function(n) { return n.charAt(0).toUpperCase() + n.slice(1); }).join(' '),
    '</h2>',
    elements,
    '\t\t\t</div>',
  ].join('\n');
}

function makeElement(names) {

  var nameSpans = names.map(function(name) {
    return '\t\t\t\t<span>' + name + '</span>';
  }).join('\n');

  return [
    '\t\t\t<div class="element">',
    '\t\t\t\t<i class="twa ' + names[0] + '"></i>',
    nameSpans,
    '\t\t\t</div>',
  ].join('\n');
}

var html = header + '\n' + subheader + '\n' + sections.join('\n') + '\n' + footer;


///////////////////////////////////////////////////////////////////////////////
// WRITE OUTPUT TO FILES
///////////////////////////////////////////////////////////////////////////////

fs.writeFileSync(HTML_OUTPUT, html);
fs.createReadStream(TWEMOJI_PATH).pipe(fs.createWriteStream(TWEMOJI_OUTPUT));
fs.createReadStream(STYLES_PATH).pipe(fs.createWriteStream(STYLES_OUTPUT));

console.log('cheat sheet website generated');

