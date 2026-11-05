// bot.js - RIN WORLD FIXED FINAL
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const QRCode = require('qrcode');
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json({limit: '10mb'}));

// ده السطر السحري اللي هيشغل صفحتك
app.use(express.static(__dirname));

let lastJoin = null;
let lastQr = null;

app.get('/qr', async (req, res) => {
  if (!lastQr) return res.send('<center><h1>لسه مفيش QR .. Refresh بعد 10 ثواني</h1></center>');
  const qrImage = await QRCode.toDataURL(lastQr);
  res.send(`<center><img src="${qrImage}" style="width:350px;margin-top:50px"><h2>اعمل سكان بسرعة</h2></center>`);
});

app.post('/join', (req,res)=>{
  lastJoin = req.body;
  console.log(`واحد جديد: ${lastJoin.name}`);
  res.json({ok:true});
});

app.get('/last', (req,res)=> res.json(lastJoin || {}));

const client = new Client({
  authStrategy: new LocalAuth({clientId: "rin-bot"}),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox','--disable-setuid-sandbox','--disable-dev-shm-usage']
  }
});

client.on('qr', qr => {
  lastQr = qr;
  qrcode.generate(qr, {small: true});
});

client.on('ready', () => console.log('✅ بوت رين جاهز!'));
client.on('message', async msg => { console.log(msg.body); });
client.initialize();

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log(`شغال على ${PORT}`));