// request to twitter
const Twit = require('twit');
const fs = require('fs');

// timing to check if is the right pst time
const timing = 55000;
/*
const TelegramBot = require('node-telegram-bot-api');
// tg321bot
// replace the value below with the Telegram token you receive from @BotFather
const token = '462645542:AAFymq4AkEz_zsySfKjNIDz5CScFAh5buQI';
*/
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
/*
const users = ['3548228416', '634401203'];
const stream = T.stream('statuses/filter', { follow: users });
stream.on('tweet', (tweet) => {
  if (users.indexOf(tweet.user.id_str) > -1) {
    console.log(`incoming tweet from ${tweet.user.name}`);
    T.post('statuses/retweet/:id', { id: tweet.id_str }, (err, data, response) => {
      console.log(`ReTweet of the tweet from `,data.text);
    })
  }
})
*/
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
/*
// MORNING SENTENCES
const phrMor = {
  start: [
    '¡Hola!',
    '¡Buenos días!',
    '¿Qué tal va todo?',
    'Propicios días,',
    'Por aqui andamos ya...',
    'Esta mañana Tecnogeekies dice:',
    '¡Buenos días locos del hardware!',
    'Un nuevo día comienza...',
    'Hora de levantarse... si aun no lo hiciste,',
    'John Spartan dice: ¡Buenos días!,',
    'Simón dice: ¡Buenos días!,',

  ],
  middle: [
    'hoy vamos a trabajar duro y a ver si podemos hacer algo de provecho',
    'estamos provando nuevo hardware, ya os diremos si funciona bien o no...',

  ],
  closing: [
    'Feliz día a todos!',
    'Buen día a todos!',
    'que tengaís un día genial!',
    'Fuerza para superarlo!',

  ],
  hashtags: [
    '#felizlunes',
    '#felizmartes',
    '#felizmiercoles',
    '#felizjueves',
    '#felizviernes',
    '#felizsabado',
    '#felizdomingo',
  ],
}
*/
/*
// EATING SENTENCES
const phrMor = {
  start: [],
  middle: [],
  closing: [],
  hashtags: [],
}
*/
// RANDOM PHRASES
const phrFreak = {
  start: [
  'Frase random del día:',
  'Ya llegó...la frase random del día',
  'El momento de la frase esta aqui:',
  'Atentos a esta frase random:',
  ],
  middle: [
  'El Tetris es un claro ejemplo de que los errores se acumulan, los triunfos desaparecen y tener un palo largo ayuda mucho.',
  'La mejor manera de obtener la respuesta correcta en Internet no es hacer una pregunta sino publicar la respuesta incorrecta.',
  'Me dolía la cabeza y he mirado en Internet a que podía deberse. Resulta que debería estar muerto hace dos meses.',
  'Si el Día del Trabajo se celebra con una fiesta, el Día de Internet se debería celebrar leyendo un periódico en árboles muertos.',
  'La privacidad se ha convertido en una moneda de cambio. Pagamos por servicios «gratuitos» con nuestra información personal.',
  'Prueba a retroceder 50 años al pasado y explicarle a alguien de allí que en el futuro la única forma de demostrar que eres humano es tecleando unos caracteres muy distorsionados que se muestran en la pantalla.',
  'El reto más difícil al que se tendrán que enfrentar nuestros hijos será encontrar un nickname que no esté ocupado.',
  'Lo único que no mejora en el mundo cuando le aplicas un filtro de Instagram es la comida que te dan en el avión.',
  'Voy a comprar el periódico para que me confirme todo lo que leí en Internet ayer y me contaron en Twitter hace dos días.',
  'Estos nuevos que se creen con derecho a estar en internet sin haber cumplido el n° de horas reglamentarias de mirada perdida en hoja Excel',
  'Mi novia no tiene twitter, facebook, whatsapp ni instagram, así que tengo que hablar con ella en persona, como los jodidos neandertales...',
  'Llamadme desconfiado pero no me fío del usuario que cada vez que pasas por detrás de él tiene siempre abierta la pagina principal de Google.',
  'Del mismo modo que nunca puedes volver a usar un ordenador más lento, nunca puedes retroceder y estar menos conectado.',
  'Me he quedado sin Internet en el teléfono en las últimas horas. Así que por fin he podido graduarme, casarme, perder algo de peso, leer quince libros y pegarme una ducha.',
  'Quería una vida fácil pero parece que he seleccionado el modo experto.',
  'La gente dice que no se puede vivir sin amor… Yo me preocuparía más por el oxígeno.',
  'Lo sentimos, tu contraseña debe tener al menos un número, un signo, un animal extinto, un Pokémon legendario y una cita famosa.',
  'Dicen que si pronuncias 3 veces "Voldemort" en una sala de cine, escucharás a lo lejos "CÁLLATE CABRÓN" y recibirás comida voladora gratis.',
  'Alguien debería proponer una moratoria de cinco años en Internet sin fotos de gatitos.',
  'El hardware es lo que puedes patear, y el software, lo que puedes maldecir.',
  'Cuando se queda pillado el ordenador, la solución está en dar golpes muy fuertes con el ratón sobre la mesa mientras dices "suputamadre".',
  '—¡Pero Melchor, llegas tarde, Jesús nació hace 10 días! —Un mago nunca llega tarde. Ni pronto. Llega exactamente cuando se lo propone.',
  'El uso de la Comic Sans solo esta permitido en una ocasión: cuando la usas en el currículum para que nadie te contrate y agotar el paro.',
  '¿Sabéis esas veces que vais a vuestro cuarto y se os olvida lo que ibais a hacer? A lo mejor sois Sims y os han cancelado la acción. Pensad.',
  '¿Cada cuantos años hay que llevar el DeLorean a que pase la ITV?',
  'Hacer una referencia friki en un entorno no-friki y pensar "Forever Alone".',
  'Si se deja pasar el tiempo suficiente, cualquier objeto que pueda generar notas musicales acabará siendo usado para tocar la banda sonora de Super Mario Brothers en un vídeo de YouTube.',
  'Qué Skynet envíe Terminators de uno en uno en lugar de enviar un ejército me hace pensar que es un Sistema Operativo basado en Windows 8.',
  'Huevos era llamar a la tía que te gustaba al fijo con 14 años y saber que lo iba a coger su padre y no ahora enviando putos whatsapp.',
  'La tecnología no es algo intrínsecamente bueno o malo; todo depende de para qué se utilice. Como por ejemplo, el Rayo de la muerte.',
  'El mayor enigma de Internet es qué pasa cuando le das al botón «no, no tengo la edad exigida». Nadie lo ha pulsado jamás.',
  'Cuando en las pelis, se meten bajo el agua, me gusta aguantar la respiración para ver si hubiese aguantado yo también. Casí muero en Nemo.',
  'Ayer llovió porque hoy he lavado el Delorean.',
  'No conozco a la mitad de vosotros ni la mitad de lo que querría, y lo que yo querría es menos de la mitad de lo que la mitad de vosotros merece.',
  'Aburrido nivel: estar en el baile de una boda buscando los nombres de los pasodobles con el Shazaam',
  'Yo aquí he venido hasta que se me acabe la batería.',
  'Don Pelayo. Él ya era "Rey en el Norte" antes de que Robb Stark lo pusiera de moda',
  'Cualquier inteligencia artificial suficientemente avanzada como para superar el test de Turing es también suficientemente inteligente como para saber cómo fallarlo.',
  'Leer los manuales de un ordenador sin el hardware es tan frustrante como la lectura de manuales de sexo sin el software.',
  'Estar más tranquilo que Johnny Depp en un casting para una película de Tim Burton.',
  'Antes de casarte con alguien haz que utilice Internet con una conexión lenta para comprobar su verdadero carácter.',
  'Yo para adelgazar sigo la dieta de la manzana: me he comprado un Iphone X y ya no tengo para comer.',
  'Desde que los smartphones existen ya no se lanza gente vestida a la piscina...',
  'Qué suerte poder ver los conciertos a los que vas en las pantallas de los teléfonos de los que tienes delante.',
  'La brecha digital es entre quienes usan el móvil sólo como teléfono y los que lo usan sólo para todo lo demás.',
  'Un Anillo para gobernarlos a todos, un Anillo para encontrarlos,un Anillo para atraerlos a todos y atarlos en las tinieblas.',
  'Voy por la página 7.952 de las condiciones de uso del servicio de PayPal y estoy enganchadísimo. Espero ver pronto la película.',
  'Aquí vamos todos muy de "Carpe Diem" y "Seize the day" pero luego nadie sale de casa sin el móvil cargado a tope.',
  'Gente estúpida que se pregunta porque las mujeres van juntas al baño: Hermione fue sola y le atacó un troll.',
  '-Dime tu número. -¿Así, sin más? Nos acabamos de conocer... Necesitamos un tiempo. -¿Va a querer la recarga o no?',
  'Cuando salió Toy Story sólo quería grabar los muñecos para ver si se movían, después salió Actividad Paranormal y se me quitaron las ganas.',
  'Decir "basada en hechos reales" es como decir "pasó más o menos así, pero con gente fea."',
  'Limpiar las gafas y pasar de TS-screener a FullHD 1080p.True Story',
  'Abrir una pestaña en tu navegador y olvidar por qué la abriste es el equivalente tecnológico a ir a la cocina y olvidar a por que ibas.',
  'Si la batería del móvil te dura más de un día, es porque nadie te quiere.',
  'Una hora de gimnasio y se me ha olvidado publicarlo en Twitter. ¡Tanto esfuerzo para nada!',
  'Las claves son como el papel higiénico. No lo reutilices, no compartas el que has usado, y nadie debería pedirte ver el que has usado.',
  'El 50% de los casos de infarto en gente joven se debe a tener el Avast Antivirus en el ordenador.',
  'Un investigador en aprendizaje automático, un experto en criptodivisas y un programador Erlang entran en un bar. Facebook los compra por 27.000 millones de dólares.',
  '-Tengo la sensación de haber estado antes aquí. -¿Cómo lo sabes? -El Wi-Fi se ha conectado solo.',
  'La vida es muy corta para "Retirar el dispositivo de forma segura".',
  'No te deseo ningún mal, pero ojalá quieras apagar el ordenador e irte a dormir ya y Windows te cuele un "Instalar actualizaciones y apagar".',
  'Cuenta la leyenda que si pones El diario de Noah a la vez que escuchas Pablo Alborán, luego meas mermelada.',
  'El periodo de tiempo más corto que puede ser medido es el intervalo entre que desenchufo mi iPhone del cargador y que pone que la batería está al 80%',
  '- Mierda, no tengo más espacio para el porno. - Pues borra cosas que no uses. - Oh, gracias. Borraré esta carpeta absurda de system 32',
  'Dicen que la NSA va a subsidiar las compras del iPhone X para quedarse con los datos biométricos de toda la gente.',
  'La ofimática se inventó para ahorrar tiempo en oficinas, y luego llegó Bill Gates e inventó el Powerpoint para que todo siguiera como antes.',
  'Los información ni se crea ni se destruye, la vas acumulando en el disco duro hasta que lo llenas y te compras otro de mayor capacidad',
  'Si Internet Explorer es lo suficientemente valiente como pedirte ser tu navegador por defecto, tú deberías ser igual de valiente para pedirle una cita a esa chica.',
  'Ojalá hicieran lavadoras con Windows como sistema operativo para que la ropa se colgase sola.',
  'He cerrado por accidente Chrome y he perdido todas las pestañas. Seré honesto, me siento más liberado que enfadado.',
  'Legalmente es el WiFi del vecino el que está allanando mi casa, yo no robo el WiFi, él viene a mi.',
  'Aprieto ENTER y que sea lo que dios quiera.',
  'Hogar es donde la WiFi se conecta automáticamente.',
  'Una casa no es un hogar hasta que no tiene Wi-Fi.',
  'Programador. n. Organismo pluricelular conocido por su costumbre de convertir la cafeína y la pizza en software informático.',
  'En el infierno de los informáticos sólo te dejan usar Windows Millenium en un Intel 80286 con 512 KB de memoria.',
  'No me da miedo volar, pero aún así me tomo un Trankimazin antes de volar por si el avión no tiene Wi-Fi.',
  'No sé si comprarme una tele nueva para el salón o esperarme un par de años al Samsung Galaxy de 50 pulgadas.',
  'Los chavales de hoy en día nunca conocerán el placer de colgar a lo bruto el teléfono tras una discusión. Todo lo que puedes hacer ahora es darle golpecitos con el dedo a la pantalla cuando estás cabreado.',
  'Mi móvil se quedo sin batería y durante dos horas tuve que enterarme de las noticias por la radio. Me sentí tan, tan del siglo XX…',
  'Este es mi ordenador. Hay muchos otros pero éste es el mío. Mi ordenador es mi mejor amigo y es mi vida…',
  '—Windows, apágate —¿Qué hago? ¿Me apago, me suspendo o me reinicio? —Que te apagues —Instalando actualizaciones 1 de 10...',
  'Que una enfermera te ponga la vacuna contra la gripe y te asustes al oír que dice: «La base de datos de virus ha sido actualizada».',
  'Si las horas que hemos perdido reiniciando Windows las hubiéramos dedicado a mejorar los viajes espaciales ya estaríamos viviendo Marte.',
  'Puede calcularse fácilmente la edad de una persona mediante el número de cargadores Nokia que acumula en su casa.',
  'Nunca se tiene suficiente carga de batería ni demasiados puertos USB.',
  'Si lo archivas y lo recuerdas sabes dónde está pero no lo necesitarás nunca y si lo archivas y lo necesitas, nunca recordarás dónde está.',
  '¿No os encanta esa sensación al teclear tan rápido la contraseña que piensas «no la he puesto bien ni de coña», y sin embargo, acceder?',
  'Mi teléfono autocorrige "jaja" por "jajaja", así que todos mis amigos creen que son 50% más graciosos de lo que realmente son.',
  'La inteligencia artificial no será un avance verdaderamente importante hasta que una máquina no me haga croquetas o bocatas de calamares.',
  'Ese momento «¡coño, ha funcionado!» es una parte muy agradable de programar.',
  'Si ignoro mi correo electrónico, puede que desaparezca.',
  '- Buenos días, un café con leche. - ¿Desea algo para acompañarlo? - Sí, la clave del wifi por favor.',
  'Los domingos por la mañana me encanta pasarlos viendo la F1. Mi mujer dice que parezco imbécil sentado durante horas mirando el teclado.',
  'Si no consigues encontrar el problema, seguro es el BIOS (Bichito Ignorante Operando Sistema).',
  'Publicar archivos con tal cantidad de metadatos que incluso se sabe lo que llevabas puesto cuando los escribiste.',
  'Si le hubieras preguntado a la gente en 1989 cómo podrían mejorar sus vidas es improbable que alguno hubiera dicho que mediante una red descentralizada de nodos de información enlazados usando hipertexto',
  'La oficina virtual permanece cerrada entre la 1:00 y las 6:00 horas.',
  'Si aún recuerdas la contraseña del ordenador del curro, no has tenido suficientes vacaciones.',
  'Los de sistemas hicimos un pacto con Dios: él no arregla computadoras y nosotros no hacemos milagros.',
  'Los que tenéis 8.000 tipografías en el ordenador ¿habéis usado alguna vez una más allá de la C?',
  'Ley del Software: Si aprenden a usarlo, saca otra versión.',
  '- ¿Que es el hardware? - Lo que recibe los golpes cuando el software no funciona',
  '11% de batería. Me va a dar para llegar a casa. Incluso puedo despilfarrar brillo.',
  'Hemos llegado a tal punto que podríamos ver los Simpsons en Taiwanés y sabríamos perfectamente lo que dicen.',


  ],
  closing: [
  '¿Os gustó?',
  '¿Qué os pareció?',
  '¿Otra más?',
  '¿Ḿañana más?',
  'Ḿañana posteamos otra',
  '¿Nos hemos pasado?',
  'Toma friki frase',
  'Con esta nos lucimos',
  'No nos mireis, otro escribió esta pedazo de frase',
  'Pues mira que chula es la frase',
],
  hashtags: [
  '#FraseDiariaTG'],
}
/*
// GOODNIGHT SENTENCES
const phrMor = {
  start: [],
  middle: [],
  closing: [
  'y acabamos por hoy',],
  hashtags: [],
}
*/
setInterval(() => { // Set interval for checking
  var date = new Date(); // Create a Date object to find out what time it is
  if (date.getHours() === 8 && date.getMinutes() === 02) { // Check the time
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
          let weekDay = now.getDay();
          switch (weekDay) {
            case 1:
              weekDay = phrMor.hashtags[0];
              break;
            case 2:
              weekDay = phrMor.hashtags[1];
              break;
            case 3:
              weekDay = phrMor.hashtags[2];
              break;
            case 4:
              weekDay = phrMor.hashtags[3];
              break;
            case 5:
              weekDay = phrMor.hashtags[4];
              break;
            case 6:
              weekDay = phrMor.hashtags[5];
              break;
            default:
              weekDay = phrMor.hashtags[6];
          }
          // now we can reference the media and post a tweet (media will attach to the tweet)
          var params = { status: `${phrMor.start[getRnd(0, phrMor.start.length)]} ${phrMor.middle[getRnd(0, phrMor.middle.length)]} ${phrMor.closing[getRnd(0, phrMor.closing.length)]} ${weekDay}`, media_ids: [mediaIdStr] }

          T.post('statuses/update', params, (err, data, response) => {
            console.log('Tweet posted with the following text:', data.text);
          })
        }
      })
    })
  }
}, timing);

// Weekly publish telegram chat

setInterval(() => { // Set interval for checking
  var date = new Date(); // Create a Date object to find out what time it is
  if (date.getDay() === 2 && date.getHours() === 12 && date.getMinutes() === 25) { // Check the time
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
          var params = { status: `¡Tenemos un grupo de Telegram! ¿Te animas a entrar? Hablamos de hardware, software, resolvemos dudas y muchas cosas más. LINK: https://t.me/joinchat/CTROOguyCbY3nx-g8-kxYQ`, media_ids: [mediaIdStr] }

          T.post('statuses/update', params, (err, data, response) => {
            console.log('Tweet posted with the following text:', data.text);
          })
        }
      })
    })
  }
}, timing);

// Daily publish phrase

setInterval(() => { // Set interval for checking
  var date = new Date(); // Create a Date object to find out what time it is
  if (date.getHours() === 19 && date.getMinutes() === 03) { // Check the time
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
}, timing);
