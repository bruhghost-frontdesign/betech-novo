const maoObra=document.getElementById('maoObra'),maoView=document.getElementById('maoView');
maoObra.addEventListener('input',()=>{
  let w=maoObra.value.trim()===''?[]:maoObra.value.trim().split(/\s+/);
  if(w.length>1000){maoObra.value=w.slice(0,1000).join(' ');w=w.slice(0,1000);}
  document.getElementById('contPalavras').textContent=w.length+'/1000';
  maoObra.style.height='auto';maoObra.style.height=Math.max(100,maoObra.scrollHeight)+'px';
});
function addFotos(inp,gid,cid){
  const grid=document.getElementById(gid);
  Array.from(inp.files).forEach(f=>{
    if(grid.children.length>=5){alert('Máx 5');return;}
    const r=new FileReader();
    r.onload=e=>{
      const d=document.createElement('div');
      d.className='prev-item';
      d.innerHTML=`<img src="${e.target.result}"><b>${grid.children.length+1}</b><button>×</button>`;
      d.querySelector('button').onclick=()=>{d.remove();renumera(gid,cid);};
      grid.appendChild(d);renumera(gid,cid);
    };r.readAsDataURL(f);
  });inp.value='';
}
function renumera(g,c){
  const gr=document.getElementById(g);
  Array.from(gr.children).forEach((d,i)=>d.querySelector('b').textContent=i+1);
  document.getElementById(c).textContent=gr.children.length+'/5';
}
['fAntesCam','fAntesGal'].forEach(id=>document.getElementById(id).addEventListener('change',function(){addFotos(this,'gridAntes','contAntes');}));
['fDepoisCam','fDepoisGal'].forEach(id=>document.getElementById(id).addEventListener('change',function(){addFotos(this,'gridDepois','contDepois');}));
const canvas=document.getElementById('sigCanvas'),ctx=canvas.getContext('2d');let des=false;
function init(){const r=canvas.getBoundingClientRect(),d=window.devicePixelRatio||1;canvas.width=r.width*d;canvas.height=120*d;ctx.setTransform(d,0,0,d,0,0);ctx.lineWidth=2;ctx.lineCap='round';ctx.strokeStyle='#111';}
window.addEventListener('load',init);window.addEventListener('resize',init);
function pos(e){const r=canvas.getBoundingClientRect(),t=e.touches?e.touches[0]:e;return{x:t.clientX-r.left,y:t.clientY-r.top};}
canvas.addEventListener('mousedown',e=>{des=true;const p=pos(e);ctx.beginPath();ctx.moveTo(p.x,p.y);});
canvas.addEventListener('mousemove',e=>{if(!des)return;const p=pos(e);ctx.lineTo(p.x,p.y);ctx.stroke();});
addEventListener('mouseup',()=>des=false);
canvas.addEventListener('touchstart',e=>{e.preventDefault();des=true;const p=pos(e);ctx.beginPath();ctx.moveTo(p.x,p.y);},{passive:false});
canvas.addEventListener('touchmove',e=>{e.preventDefault();if(!des)return;const p=pos(e);ctx.lineTo(p.x,p.y);ctx.stroke();},{passive:false});
canvas.addEventListener('touchend',()=>des=false);
function limparAssinatura(){ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,canvas.width,canvas.height);ctx.restore();init();}
function montaPdf(o,d){
  const org=document.getElementById(o),dst=document.getElementById(d);
  dst.innerHTML='';const im=org.querySelectorAll('img');
  if(!im.length){dst.innerHTML='<div class="sem">Nenhuma foto</div>';return;}
  im.forEach((i,n)=>{
    const el=document.createElement('div');el.className='pdf-item';
    el.innerHTML=`<span>${n+1}</span>`;
    const ni=document.createElement('img');ni.src=i.src;el.appendChild(ni);dst.appendChild(el);
  });
}
async function gerarPDF(){
  const folha=document.getElementById('folha'),pagFotos=document.getElementById('paginaFotos'),botoes=document.getElementById('botoes'),bloco=document.getElementById('blocoFotos');
  botoes.style.display='none';bloco.style.display='none';
  maoView.textContent=maoObra.value;maoView.style.display='block';maoObra.style.display='none';
  await new Promise(r=>setTimeout(r,300));
  try{
    const {jsPDF}=window.jspdf;const pdf=new jsPDF('p','mm','a4');
    const pageW=210,pageH=297,margin=10;const maxW=pageW-margin*2,maxH=pageH-margin*2;
    const opt={scale:2,useCORS:true,logging:false,windowWidth:850,backgroundColor:'#ffffff'};
    const c1=await html2canvas(folha,opt);
    let w1=maxW,h1=c1.height*w1/c1.width;if(h1>maxH){h1=maxH;w1=c1.width*h1/c1.height;}
    pdf.addImage(c1.toDataURL('image/jpeg',0.92),'JPEG',(pageW-w1)/2,margin,w1,h1);
    document.getElementById('numOSFoto').textContent=document.getElementById('numOS').value;
    document.getElementById('dataFoto').textContent=document.getElementById('dataTopo').textContent;
    montaPdf('gridAntes','pdfGridAntes');montaPdf('gridDepois','pdfGridDepois');
    pagFotos.style.display='block';await new Promise(r=>setTimeout(r,300));
    const c2=await html2canvas(pagFotos,opt);
    let w2=maxW,h2=c2.height*w2/c2.width;if(h2>maxH){h2=maxH;w2=c2.width*h2/c2.height;}
    pdf.addPage();pdf.addImage(c2.toDataURL('image/jpeg',0.92),'JPEG',(pageW-w2)/2,margin,w2,h2);
    pagFotos.style.display='none';
    pdf.save(`OS-BETHEC-${document.getElementById('numOS').value}.pdf`);
  }catch(e){alert('Erro: '+e.message);}
  botoes.style.display='flex';bloco.style.display='grid';maoView.style.display='none';maoObra.style.display='block';
}
const hoje=new Date().toLocaleDateString('pt-BR');
document.getElementById('numOS').value=Math.floor(Math.random()*9000+1000);
document.getElementById('dataTopo').textContent=hoje;
document.getElementById('dataFoto').textContent=hoje;

// PWA INSTALL
let deferredPrompt;
window.addEventListener('beforeinstallprompt',(e)=>{
  e.preventDefault();deferredPrompt=e;
  document.getElementById('pwaBar').style.display='flex';
});
document.getElementById('btnInstalar').addEventListener('click',async()=>{
  if(deferredPrompt){
    deferredPrompt.prompt();
    const {outcome}=await deferredPrompt.userChoice;
    if(outcome==='accepted')document.getElementById('pwaBar').style.display='none';
    deferredPrompt=null;
  }
});
if('serviceWorker' in navigator){
  navigator.serviceWorker.register('sw.js');
}
