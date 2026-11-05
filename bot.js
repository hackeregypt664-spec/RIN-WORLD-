// bot.js - RIN WORLD 24H
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({limit: '10mb'}));

let lastJoin = null;

// ده عشان UptimeRobot يصحي البوت كل 5 دقايق
app.get('/', (req,res)=> res.send('RIN WORLD Bot is Alive 👑🔥'));
app.get('/join', (req,res)=> res.send('alive'));

app.post('/join', (req,res)=>{
  lastJoin = req.body;
  console.log(`واحد جديد سجل: ${lastJoin.name}`);
  res.json({ok:true});
});

const client = new Client({
  authStrategy: new LocalAuth({clientId: "rin-bot"}),
  webVersionCache: {
    type: 'remote',
    remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html',
  },
  puppeteer: {
    headless: true,
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-dev-shm-usage']
  }
});

client.on('qr', qr => {
  console.log('اعمل سكان للـ QR ده:');
  qrcode.generate(qr, {small:true});
});

client.on('ready', () => console.log('✅ بوت رين جاهز!'));

client.on('group_membership', async (notification) => {
  if(notification.type !== 'add') return;
  if(!lastJoin) return;
  
  try {
    const chat = await notification.getChat();
    let caption = `🧠 أهلا بيك يا *${lastJoin.name}* في عالم RIN WORLD 👑\n\nنورت يا أوتاكو 🔥\nلقبك اتحجز للأبد ومحدش هياخده تاني!\n\nاستمتع يا أسطورة ✨`;

    if(lastJoin.image){
      const media = new MessageMedia('image/jpeg', lastJoin.image.split(',')[1], 'profile.jpg');
      await chat.sendMessage(media, {caption});
    } else {
      await chat.sendMessage(caption);
    }
    
    console.log(`رحبت بـ ${lastJoin.name}`);
    lastJoin = null;
  } catch(e){ console.log(e) }
});

client.initialize();
const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log(`السيرفر شغال على ${PORT}`));