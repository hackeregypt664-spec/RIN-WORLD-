// RIN WORLD - Final Static
let hasImg=false;
const particles = document.getElementById('particles');
for(let i=0;i<25;i++){let d=document.createElement('div');d.className='p';d.style.left=Math.random()*100+'%';d.style.animationDuration=(5+Math.random()*10)+'s';d.style.animationDelay=Math.random()*5+'s';particles.appendChild(d)}

const fileInput=document.getElementById('file'), preview=document.getElementById('preview'), txt=document.getElementById('txt'), box=document.getElementById('uploadBox'), nick=document.getElementById('nickname'), btn=document.getElementById('join');

const COMMUNITY_LINK = "https://chat.whatsapp.com/F7t3WUsKaL6IIujfTge7Je";

box.onclick=()=> fileInput.click();

fileInput.onchange=e=>{
  let f=e.target.files[0]; if(!f) return;
  let reader=new FileReader();
  reader.onload=ev=>{
    preview.src=ev.target.result; preview.style.display="block";
    txt.innerHTML="✅ تم حفظ صورتك"; box.classList.add('has-img'); hasImg=true; check();
  };
  reader.readAsDataURL(f);
}
nick.oninput=check;
function check(){
  let v=nick.value.trim();
  if(hasImg && v.length>=2){btn.disabled=false; btn.innerText=`ادخل كـ ${v} 🔥`}else{btn.disabled=true; btn.innerText=hasImg?"اكتب لقب أنمي":"اختار صورة ولقب"}
}
btn.onclick=()=>{
  let name=nick.value.trim();
  if(!hasImg || !name) return;
  btn.disabled=true; btn.innerText="جاري الدخول..."; document.getElementById('status').style.display="block";
  setTimeout(()=>{ window.location.href=COMMUNITY_LINK; }, 900);
}