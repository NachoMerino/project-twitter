// request to twitter
const Twit = require('twit');
const fs = require('fs');
/*
const TelegramBot = require('node-telegram-bot-api');
// tg321bot
// replace the value below with the Telegram token you receive from @BotFather
const token = '462645542:AAFymq4AkEz_zsySfKjNIDz5CScFAh5buQI';
*/

let osFolder = process.env.HOME + '/.twitter-conf';
let statusConfig = null;
if (!fs.existsSync(osFolder)) {
  fs.mkdirSync(osFolder);
  let initialConfig = {
    consumer_key: '',
    consumer_secret: '',
    access_token: '',
    access_token_secret: '',
  }
  fs.writeFileSync(osFolder + '/.config.json', JSON.stringify(initialConfig));
  console.log('The config folder does not exist, it has been created now. The server will exit now');
  process.exit();
} else {
  statusConfig = require(osFolder + '/.config.json');
}
// you need to access /home/"yourUserName"/.twitter-conf/.config.json and set the DB data
const T = new Twit({
  consumer_key: statusConfig.consumer_key,
  consumer_secret: statusConfig.consumer_secret,
  access_token: statusConfig.access_token,
  access_token_secret: statusConfig.access_token_secret,
});
// Contain the ids of the users we wanna retweet /tecnogeekies y /DevFromScratch
const users = ['3548228416', '634401203'];
const stream = T.stream('statuses/filter', { follow: users });
stream.on('tweet', (tweet) => {
  if (users.indexOf(tweet.user.id_str) > -1) {
    console.log(`incoming tweet from ${tweet.user.name}`);
    T.post('statuses/retweet/:id', { id: tweet.id_str }, (err, data, response) => {
      console.log(`ReTweet made by @${data.user.name} of the tweet from `,data.text);
    })
  }
})
// program to read all the pictures

let pictures = {
  evening: [],
  food: [],
  morning: [],
  night: [],
  techPicts: [],
}

function listFiles(path) {
  var listOfFiles = fs.readdirSync(path);
  // console.log('entering: ' + path);
  var nameOfFolder = path.split('./pictures/').pop();
  for (let i = 0; i < listOfFiles.length; i++) {
    var currentPath = path + '/' + listOfFiles[i];
    var toCheckFile = fs.lstatSync(currentPath);
    if (toCheckFile.isFile()) {
      if (nameOfFolder === 'evening') {
        pictures.evening.push(listOfFiles[i]);
      } else if (nameOfFolder === 'food') {
        pictures.food.push(listOfFiles[i]);
      } else if (nameOfFolder === 'morning') {
        pictures.morning.push(listOfFiles[i]);
      } else if (nameOfFolder === 'night') {
        pictures.night.push(listOfFiles[i]);
      } else if (nameOfFolder === 'techPicts') {
        pictures.techPicts.push(listOfFiles[i]);
      }
      // console.log('file: ' + currentPath);
    } else if (toCheckFile.isDirectory()) {
      // console.log('folder: ' + currentPath);
      listFiles(currentPath)
    }
  }
  // console.log('inside of the folder', pictures[nameOfFolder]);
}
// Set the starting point for the folder search.
listFiles('./pictures');

function getRnd(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
// MORNING SENTENCES
const phrMor = {
  start: [
    '¡Hola!',
    '¡Buenos días!',
    '¿Qué tal va todo?',
    'Propicios días',
  ],
  middle: [
    'hoy vamos a trabajar duro',
    'estamos provando que tal va JavaScript',
    'parece muy interesante todo esto que ocurre aqui',
  ],
  closing: [
    'una prueba de cierre',
    'voy a ir cerrando',
    'y acabamos por hoy',
  ],
  hashtags: [
    '#wow',
    '#js',
    '#tecnogeekies',
  ],
}
setInterval(() => { // Set interval for checking
  var date = new Date(); // Create a Date object to find out what time it is
  if (date.getHours() === 8 && date.getMinutes() === 32) { // Check the time
    const num = getRnd(0, pictures.morning.length);
    // START post a tweet with media
    var b64content = fs.readFileSync(`./pictures/morning/${pictures.morning[num]}`, { encoding: 'base64' });
    // first we must post the media to Twitter
    T.post('media/upload', { media_data: b64content }, (err, data, response) => {
      // now we can assign alt text to the media, for use by screen readers and
      // other text-based presentations and interpreters
      var mediaIdStr = data.media_id_string
      var altText = "Script made by nachomerino to tecnogeekies"
      var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }

      T.post('media/metadata/create', meta_params, (err, data, response) => {
        if (!err) {
          // now we can reference the media and post a tweet (media will attach to the tweet)
          var params = { status: `${phrMor.start[getRnd(0, phrMor.start.length)]} ${phrMor.middle[getRnd(0, phrMor.middle.length)]} ${phrMor.closing[getRnd(0, phrMor.closing.length)]} ${phrMor.hashtags[getRnd(0, phrMor.hashtags.length)]}`, media_ids: [mediaIdStr] }

          T.post('statuses/update', params, (err, data, response) => {
            console.log('Tweet posted with the following text:',data.text);
          })
        }
      })
    })
  }
}, 45000); // Repeat every 45000 milliseconds (45 sec)
