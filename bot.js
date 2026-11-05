// bot.js - RIN WORLD 24H FIXED
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const QRCode = require('qrcode');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({limit: '10mb'}));

let lastJoin = null;
let lastQr = null; // هنحفظ الـ QR هنا

app.get('/', (req,res)=> res.send('RIN WORLD Bot is Alive 👑🔥'));
app.get('/join', (req,res)=> res.send('alive'));

// صفحة الـ QR لازم تكون بره خالص مش جوه الـ client.on
app.get('/qr', async (req, res) => {
  if (!lastQr) return res.send('<center><h1>لسه مفيش QR .. استنى ثواني واعمل Refresh</h1></center>');
  const qrImage = await QRCode.toDataURL(lastQr);
  res.send(`<center><img src="${qrImage}" style="width:350px;margin-top:50px"><h2>اعمل سكان بالواتساب بسرعة</h2></center>`);
});

app.post('/join', (req,res)=>{
  lastJoin = req.body;
  console.log(`واحد جديد سجل: ${lastJoin.name}`);
  res.json({ok:true});
});

const client = new Client({
  authStrategy: new LocalAuth({clientId: "rin-bot"}),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-dev-shm-usage']
  }
});

client.on('qr', qr => {
  lastQr = qr; // حفظناه عشان صفحة /qr تشوفه
  console.log('اعمل سكان للـ QR ده:');
  qrcode.generate(qr, {small: true});
});

client.on('ready', () => console.log('✅ بوت رين جاهز!'));

client.on('message', async msg => {
  console.log(msg.body);
});

client.initialize();
const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log(`السيرفر شغال على ${PORT}`));
