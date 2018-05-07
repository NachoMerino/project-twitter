// request to twitter
const Twit = require('twit');
const fs = require('fs');
const fetch = require('node-fetch');
// MORNING SENTENCES
const phrMor = require('./phrases/phrMor');
// RANDOM PHRASES
const phrFreak = require('./phrases/phrFreak');

// timing to check if is the right pst time
const timing = 55000; // 55 seconds

console.log('Twitter Bot activated...');
let osFolder = process.env.HOME + '/.twitter-conf';
let statusConfig = null;
if (!fs.existsSync(osFolder)) {
  fs.mkdirSync(osFolder);
  let initialConfig = {
    consumer_key: '',
    consumer_secret: '',
    access_token: '',
    access_token_secret: '',
    youtube_key: ''
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
// Contain the ids of the users we wanna retweet /saxoncorp y /DevFromScratch

const users = ['267956398'];
const stream = T.stream('statuses/filter', { follow: users });
stream.on('tweet', (tweet) => {
  if (users.indexOf(tweet.user.id_str) > -1) {
    console.log(`incoming tweet from ${tweet.user.name}`);
    T.post('statuses/retweet/:id', { id: tweet.id_str }, (err, data, response) => {
      console.log(`ReTweet of the tweet from `,data.text);
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

setInterval(() => { // Set interval for checking
  var date = new Date(); // Create a Date object to find out what time it is
  let weekDay = date.getDay();

  // Daily publish phrase

    if (date.getHours() === 19 && date.getMinutes() === 08) { // Check the time
      // START post a tweet with media
      var b64content = fs.readFileSync('./pictures/regular-publications/tg-picture.jpg', { encoding: 'base64' });
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
            var params = { status: `${phrFreak.start[getRnd(0, phrFreak.start.length)]} ${phrFreak.middle[getRnd(0, phrFreak.middle.length)]} ${phrFreak.closing[getRnd(0, phrFreak.closing.length)]} ${phrFreak.hashtags[0]}`, media_ids: [mediaIdStr] }

            T.post('statuses/update', params, (err, data, response) => {
              console.log('Tweet posted with the following text:', data.text);
            })
          }
        })
      })
    }

  // Daily adverteisment of the last YT video

    if (date.getHours() === 22 && date.getMinutes() === 27) { // Check the time
    // load the lastest info about our yt channel
    let num = 0;
    fetch(`https://www.googleapis.com/youtube/v3/search?key=${statusConfig.youtube_key}&channelId=UCKY9eC8A95wxeXt8PaqvMlw&part=snippet,id&order=date&maxResults=1`)
    .then(res => res.json())
    .then(videoInfo => {
      const desc = videoInfo.items[num].snippet.description
      if(desc.match('TheGeekShow')){
        num = num + 1
      }
      // now we can reference the media and post a tweet (media will attach to the tweet)
      var params = { status: `¿Viste ya nuestro último vídeo? ${videoInfo.items[num].snippet.description} http://www.youtube.com/watch?v=${videoInfo.items[num].id.videoId}`}

      T.post('statuses/update', params, (err, data, response) => {
        console.log('Tweet posted with the following text:', data.text);
      })
    })
  }

    // Daily adverteisment of a random YT video

    if (date.getHours() === 15 && date.getMinutes() === 49) { // Check the time
    // load the lastest info about our yt channel
    let num = getRnd(1, 50);
    fetch(`https://www.googleapis.com/youtube/v3/search?key=${statusConfig.youtube_key}&channelId=UCKY9eC8A95wxeXt8PaqvMlw&part=snippet,id&order=date&maxResults=50`)
    .then(res => res.json())
    .then(videoInfo => {
      const desc = videoInfo.items[num].snippet.description
      if(desc.match('TheGeekShow')){
        num = num + 1
      }
      // now we can reference the media and post a tweet (media will attach to the tweet)
      var params = { status: `Creemos que este video puede gustarte. ${videoInfo.items[num].snippet.description} http://www.youtube.com/watch?v=${videoInfo.items[num].id.videoId} #TGHemeroteca`}

      T.post('statuses/update', params, (err, data, response) => {
        console.log('Tweet posted with the following text:', data.text);
      })
    })
  }

    if (date.getHours() === 8 && date.getMinutes() === 02) {// Check the time
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
          // hastag for each day of the week '#felizweekDay'
          // now we can reference the media and post a tweet (media will attach to the tweet)
          var params = { status: `${phrMor.start[getRnd(0, phrMor.start.length)]} ${phrMor.closing[getRnd(0, phrMor.closing.length)]} ${phrMor.hashtags[weekDay - 1]}`, media_ids: [mediaIdStr] }

          T.post('statuses/update', params, (err, data, response) => {
            console.log('Tweet posted with the following text:', data.text);
          })
        }
      })
    })
  }

  // Weekly publish telegram chat (martes y sabado)

    if ((weekDay === 6 || weekDay === 2) && date.getHours() === 12 && date.getMinutes() === 39) {
    // START post a tweet with media
    var b64content = fs.readFileSync('./pictures/regular-publications/telegram.png', { encoding: 'base64' });
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
          var params = { status: `¡Tenemos un grupo de Telegram! ¿Te animas a entrar? Hablamos de hardware, software, resolvemos dudas y muchas otras cosas más. LINK: https://t.me/joinchat/CTROOguyCbY3nx-g8-kxYQ`, media_ids: [mediaIdStr] }

          T.post('statuses/update', params, (err, data, response) => {
            console.log('Tweet posted with the following text:', data.text);
          })
        }
      })
    })
  }
}, timing);

//statusConfig.youtube_key
setInterval(() => {console.log('gmail runs!')
}, 300000);