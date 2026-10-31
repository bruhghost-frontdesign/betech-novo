function show(id){document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));document.getElementById(id).classList.add('active');window.scrollTo(0,0);if(id==='os')setTimeout(resizeCanvas,200)}
function toggle(id,btn){let i=document.getElementById(id);i.type=i.type==='password'?'text':'password';btn.textContent=i.type==='password'?'👁️':'🙈'}
function mask(el){let v=el.value.replace(/\D/g,'');if(v.length>11)v=v.slice(0,11);if(v.length>0)v='('+v;if(v.length>3)v=v.slice(0,3)+') '+v.slice(3);if(v.length>10)v=v.slice(0,10)+'-'+v.slice(10);el.value=v}
function checkS(s){let ok=/[A-Z]/.test(s)&&/[!@#$%^&*]/.test(s);let h=document.getElementById('hSenha');if(h){h.textContent=ok?'✅ Senha válida!':'• Precisa: MAIÚSCULA e !@#$%^&*';h.className=ok?'hint ok':'hint'}}
function validS(s){return /[A-Z]/.test(s)&&/[!@#$%^&*]/.test(s)}
function pop(t,m){document.getElementById('pTitle').textContent=t;document.getElementById('pMsg').textContent=m;document.getElementById('popup').classList.add('show')}
function closePop(){document.getElementById('popup').classList.remove('show')}
let deferredPrompt;window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;window.deferredPrompt=e});
function baixar(){if(deferredPrompt){deferredPrompt.prompt()}else{pop('📲 Instalar','Android: 3 pontos > Instalar app | iPhone: Compartilhar > Adicionar à Tela Inicial')}}
function doCad(){
let n=cNome.value.trim(),c=cCel.value.trim(),e=cEmail.value.trim(),s=cSenha.value,s2=cSenha2.value;
if(!n||!c||!e||!s){pop('⚠️','Preencha todos!');return}
if(!/^\(\d{2}\) \d{4,5}-\d{4}$/.test(c)){pop('⚠️','Use (15) 99141-7227');return}
if(!validS(s)){pop('⚠️','Senha precisa MAIÚSCULA + !@#$%^&*');return}
if(s!==s2){pop('⚠️','Senhas não conferem');return}
let u={nome:n,cel:c,email:e,senha:s,criado:new Date().toLocaleString('pt-BR')};
localStorage.setItem('bethec_user_'+e,JSON.stringify(u));
let all=JSON.parse(localStorage.getItem('bethec_users')||'[]');all.push(u);localStorage.setItem('bethec_users',JSON.stringify(all));
cNome.value='';cCel.value='';cEmail.value='';cSenha.value='';cSenha2.value='';lEmail.value=e;
pop('✅ Cadastro efetuado com sucesso!','Indo para login...');setTimeout(()=>{closePop();show('login')},1200);
}
function doLogin(){let e=lEmail.value.trim(),s=lSenha.value;let u=JSON.parse(localStorage.getItem('bethec_user_'+e)||'null');let all=JSON.parse(localStorage.getItem('bethec_users')||'[]');let f=all.find(x=>x.email===e&&x.senha===s);if((u&&u.senha===s)||f){userLog.textContent=(u||f).nome;show('menu')}else{pop('❌','Email ou senha incorretos')}}
function doAdmin(){let u=aUser.value.trim(),p=aPass.value;if(u==='admin'&&p==='Sofia919521*'){loadAdmin();show('adminPanel')}else{pop('❌','Admin inválido')}}
function loadAdmin(){let all=JSON.parse(localStorage.getItem('bethec_users')||'[]');totalUsers.textContent=all.length+' cadastros';listaUsers.innerHTML=all.length?all.map((u,i)=>`<div style="border:1px solid #ddd;border-radius:8px;padding:8px;margin-bottom:6px"><b>${i+1}. ${u.nome}</b><br>📞 ${u.cel}<br>✉️ ${u.email}<br><small>🕒 ${u.criado}</small></div>`).join(''):'<p style="color:#666">Nenhum usuário</p>'}
function exportJSON(){let d=localStorage.getItem('bethec_users')||'[]';let b=new Blob([d],{type:'application/json'});let u=URL.createObjectURL(b);let a=document.createElement('a');a.href=u;a.download='backup_bethec_'+new Date().toISOString().slice(0,10)+'.json';a.click()}
function exportCSV(){let all=JSON.parse(localStorage.getItem('bethec_users')||'[]');let csv='Nome,Celular,Email,Criado\n'+all.map(u=>`"${u.nome}","${u.cel}","${u.email}","${u.criado}"`).join('\n');let b=new Blob([csv],{type:'text/csv'});let u=URL.createObjectURL(b);let a=document.createElement('a');a.href=u;a.download='backup_bethec_'+new Date().toISOString().slice(0,10)+'.csv';a.click()}
function bindFoto(inputId,imgId){const inp=document.getElementById(inputId);if(!inp)return;inp.addEventListener('change',function(){const f=this.files[0];if(!f)return;const r=new FileReader();r.onload=e=>{const im=document.getElementById(imgId);im.src=e.target.result;im.style.display='block';};r.readAsDataURL(f);});}
setTimeout(()=>{bindFoto('fAntesCam','pAntes');bindFoto('fAntesGal','pAntes');bindFoto('fDepoisCam','pDepois');bindFoto('fDepoisGal','pDepois')},500);
const canvas=document.getElementById('sigCanvas');let ctx=null;function resizeCanvas(){if(!canvas)return;const rect=canvas.getBoundingClientRect();canvas.width=rect.width;canvas.height=130;ctx=canvas.getContext('2d');ctx.lineWidth=2;ctx.lineCap='round';ctx.strokeStyle='#000';}
window.addEventListener('load',resizeCanvas);window.addEventListener('resize',resizeCanvas);
let desenhando=false;function pos(e){const r=canvas.getBoundingClientRect();const t=e.touches?e.touches[0]:e;return{x:t.clientX-r.left,y:t.clientY-r.top};}
if(canvas){canvas.addEventListener('mousedown',e=>{desenhando=true;if(!ctx)resizeCanvas();ctx.beginPath();const p=pos(e);ctx.moveTo(p.x,p.y)});canvas.addEventListener('mousemove',e=>{if(!desenhando)return;const p=pos(e);ctx.lineTo(p.x,p.y);ctx.stroke()});canvas.addEventListener('mouseup',()=>desenhando=false);canvas.addEventListener('touchstart',e=>{e.preventDefault();desenhando=true;if(!ctx)resizeCanvas();ctx.beginPath();const p=pos(e);ctx.moveTo(p.x,p.y)},{passive:false});canvas.addEventListener('touchmove',e=>{e.preventDefault();if(!desenhando)return;const p=pos(e);ctx.lineTo(p.x,p.y);ctx.stroke()},{passive:false});canvas.addEventListener('touchend',()=>desenhando=false);}
function limparAssinatura(){if(!ctx)return;ctx.clearRect(0,0,canvas.width,canvas.height);}
function gerarPDF(){const b=document.getElementById('botoes');b.style.display='none';const opt={margin:[5,5,5,5],filename:'OS-BETHEC-'+(document.getElementById('numOS').value||Date.now())+'.pdf',image:{type:'jpeg',quality:0.92},html2canvas:{scale:1.5,useCORS:true},jsPDF:{unit:'mm',format:'a4',orientation:'portrait'},pagebreak:{mode:['avoid-all']}};html2pdf().set(opt).from(document.getElementById('folha')).save().then(()=>{b.style.display='flex';});}
const nOS=document.getElementById('numOS');if(nOS)nOS.value=Math.floor(Math.random()*9000+1000);
if('serviceWorker' in navigator){navigator.serviceWorker.register('./sw.js')}
