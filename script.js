let deferredPrompt=null;let canvasEl=null;let isAdminMode=false;
const ADMIN_EMAIL = 'bruh_ghost@hotmail.com';
const ADMIN_SENHA = 'Sofia919521*';

function initCanvas(){
  canvasEl=document.getElementById('sigCanvas');
  if(!canvasEl)return;
  const ctx=canvasEl.getContext('2d');
  let drawing=false;
  function pos(e){
    const r=canvasEl.getBoundingClientRect();
    const t=e.touches?e.touches[0]:e;
    return{x:t.clientX-r.left,y:t.clientY-r.top}
  }
  canvasEl.addEventListener('mousedown',e=>{drawing=true;const p=pos(e);ctx.beginPath();ctx.moveTo(p.x,p.y)});
  canvasEl.addEventListener('mousemove',e=>{if(!drawing)return;const p=pos(e);ctx.lineTo(p.x,p.y);ctx.stroke()});
  window.addEventListener('mouseup',()=>drawing=false);
  canvasEl.addEventListener('touchstart',e=>{e.preventDefault();drawing=true;const p=pos(e);ctx.beginPath();ctx.moveTo(p.x,p.y)},{passive:false});
  canvasEl.addEventListener('touchmove',e=>{e.preventDefault();if(!drawing)return;const p=pos(e);ctx.lineTo(p.x,p.y);ctx.stroke()},{passive:false});
  canvasEl.addEventListener('touchend',()=>drawing=false);
  ctx.lineWidth=2;ctx.lineCap='round';ctx.strokeStyle='#000'
}
function limparAss(){if(canvasEl)canvasEl.getContext('2d').clearRect(0,0,canvasEl.width,canvasEl.height)}
function salvarAss(){pop('Assinatura','Salva, vai aparecer no PDF')}

function show(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0,0);
  if(id==='os'){
    setTimeout(()=>{initCanvas();gerarQRCodeAuto();},200);
    carregarEmpresasNoSelect();
    carregarEquipNoSelect();
    if(!document.getElementById('osData').value)document.getElementById('osData').valueAsDate=new Date();
    preencherTabelasOS();
  }
  if(id==='cadEquip')carregarEmpresasParaEquip();
  if(id==='dashboardUser')carregarDashboardUser();
  if(id==='adminPanel'){carregarAdminTudo()}
  if(id==='menu'){atualizarStats()}
  if(id==='cadEmpresa')listarEmpresas();
  if(id==='cadEquip')listarEquip();
  if(id==='backupScreen')listarBackups();
}

function preencherTabelasOS(){
  let s=document.getElementById('servBody');
  if(s&&s.children.length==0){
    let h='';for(let i=1;i<=8;i++)h+=`<tr><td>${i}</td><td><textarea placeholder="Serviço ${i}"></textarea></td></tr>`;
    s.innerHTML=h;
  }
  let p=document.getElementById('pecaBody');
  if(p&&p.children.length==0){
    let h='';for(let i=1;i<=6;i++)h+=`<tr><td>${i}</td><td><input type="number"></td><td><input placeholder="Peça ${i}"></td></tr>`;
    p.innerHTML=h;
  }
}

function gerarQRCodeAuto(){
  let osNum=document.getElementById('numOS').value||'4072';
  let empresa=document.getElementById('osEmpresa').value||document.getElementById('osEmpresaDisplay').value||'BETHEC';
  let texto=`BETHEC OS:${osNum} | ${empresa} | ${new Date().toLocaleDateString('pt-BR')}`;
  let el1=document.getElementById('qrcode');
  if(el1){el1.innerHTML='';try{new QRCode(el1,{text:texto,width:70,height:70});}catch(e){}}
  ['qrcode2','qrcodePDF'].forEach(id=>{
    let el=document.getElementById(id);
    if(el){el.innerHTML='';try{new QRCode(el,{text:texto,width:80,height:80});}catch(e){}}
  });
  document.getElementById('osNumSpan').textContent=osNum;
}

function preencherEmpresaOS(){
  let id=document.getElementById('osEmpresaSelect').value;
  if(!id)return;
  let lista=JSON.parse(localStorage.getItem('bethec_empresas')||'[]');
  let emp=lista.find(e=>e.id==id);
  if(emp){
    document.getElementById('osEmpresa').value=emp.nome;
    document.getElementById('osEmpresaDisplay').value=emp.nome;
    document.getElementById('osCidadeAuto').value=emp.cidade;
    setTimeout(gerarQRCodeAuto,200);
  }
}

function preencherEquipOS(){
  let id=document.getElementById('osMarcaSelect').value;
  if(!id)return;
  let lista=JSON.parse(localStorage.getItem('bethec_equipamentos')||'[]');
  let eq=lista.find(e=>e.id==id);
  if(eq){
    document.getElementById('osMarca').value=eq.marca;
    document.getElementById('osMarcaDisplay').value=eq.marca;
    document.getElementById('osModeloAuto').value=eq.modelo;
    document.getElementById('osFrotaAuto').value=eq.frota;
    setTimeout(gerarQRCodeAuto,200);
  }
}

function gerarPDF2Pag(){
  salvarOSNoHistorico(false);
  gerarQRCodeAuto();
  const osNum=document.getElementById('numOS').value||'4072';
  const area=document.getElementById('pdfArea');
  const botoes=document.getElementById('botoes');
  botoes.style.display='none';
  let opt={margin:2,filename:'OS-BETHEC-'+osNum+'.pdf',image:{type:'jpeg',quality:0.92},html2canvas:{scale:2,useCORS:true},jsPDF:{unit:'mm',format:'a4',orientation:'portrait'}};
  html2pdf().set(opt).from(area).save().then(()=>{
    botoes.style.display='flex';
    pop('PDF Gerado','PDF: OS-BETHEC-'+osNum+'.pdf');
  });
}

function previewFoto(input,num){
  if(input.files&&input.files[0]){
    let reader=new FileReader();
    reader.onload=function(e){
      let img=document.getElementById('p'+num);
      img.src=e.target.result;
      img.style.display='block';
    };
    reader.readAsDataURL(input.files[0]);
  }
}

function salvarEmpresa(){
  let nome=document.getElementById('empNome').value.trim();
  if(!nome)return pop('Erro','Nome obrigatório');
  let lista=JSON.parse(localStorage.getItem('bethec_empresas')||'[]');
  lista.push({id:Date.now(),nome,cidade:document.getElementById('empCidade').value,contato:document.getElementById('empContato').value});
  localStorage.setItem('bethec_empresas',JSON.stringify(lista));
  pop('Salvo','Empresa salva');
  listarEmpresas();
  document.getElementById('empNome').value='';
}
function listarEmpresas(){
  let lista=JSON.parse(localStorage.getItem('bethec_empresas')||'[]');
  let div=document.getElementById('listaEmpresas');
  if(div)div.innerHTML=lista.map(e=>`<div class="item"><b>${e.nome}</b> - ${e.cidade}<br><button onclick="delEmpresa(${e.id})" style="font-size:10px;margin-top:4px">Excluir</button></div>`).join('')||'<p style="color:#999">Nenhuma empresa</p>';
}
function delEmpresa(id){
  if(!confirm('Excluir empresa?'))return;
  let lista=JSON.parse(localStorage.getItem('bethec_empresas')||'[]');
  lista=lista.filter(e=>e.id!=id);
  localStorage.setItem('bethec_empresas',JSON.stringify(lista));
  listarEmpresas();
  atualizarStats();
}
function carregarEmpresasNoSelect(){
  let lista=JSON.parse(localStorage.getItem('bethec_empresas')||'[]');
  let sel=document.getElementById('osEmpresaSelect');
  if(sel)sel.innerHTML='<option value="">Selecione</option>'+lista.map(e=>`<option value="${e.id}">${e.nome} - ${e.cidade}</option>`).join('');
}
function carregarEmpresasParaEquip(){
  let lista=JSON.parse(localStorage.getItem('bethec_empresas')||'[]');
  let sel=document.getElementById('equipEmpresaSelect');
  if(sel)sel.innerHTML=lista.map(e=>`<option value="${e.nome}">${e.nome}</option>`).join('');
}
function salvarEquip(){
  let marca=document.getElementById('equipMarca').value.trim();
  if(!marca)return pop('Erro','Marca obrigatória');
  let lista=JSON.parse(localStorage.getItem('bethec_equipamentos')||'[]');
  lista.push({id:Date.now(),marca,modelo:document.getElementById('equipModelo').value,frota:document.getElementById('equipFrota').value});
  localStorage.setItem('bethec_equipamentos',JSON.stringify(lista));
  pop('Salvo','Equipamento salvo');
  listarEquip();
}
function listarEquip(){
  let lista=JSON.parse(localStorage.getItem('bethec_equipamentos')||'[]');
  let div=document.getElementById('listaEquip');
  if(div)div.innerHTML=lista.map(e=>`<div class="item"><b>${e.marca} ${e.modelo}</b> - ${e.frota}<br><button onclick="delEquip(${e.id})" style="font-size:10px;margin-top:4px">Excluir</button></div>`).join('')||'<p style="color:#999">Nenhum equipamento</p>';
}
function delEquip(id){
  if(!confirm('Excluir?'))return;
  let lista=JSON.parse(localStorage.getItem('bethec_equipamentos')||'[]');
  lista=lista.filter(e=>e.id!=id);
  localStorage.setItem('bethec_equipamentos',JSON.stringify(lista));
  listarEquip();
  atualizarStats();
}
function carregarEquipNoSelect(){
  let lista=JSON.parse(localStorage.getItem('bethec_equipamentos')||'[]');
  let sel=document.getElementById('osMarcaSelect');
  if(sel)sel.innerHTML='<option value="">Selecione</option>'+lista.map(e=>`<option value="${e.id}">${e.marca} ${e.modelo} - ${e.frota}</option>`).join('');
}
function salvarOSNoHistorico(mostrarPop=true){
  let osNum=document.getElementById('numOS').value||'4072';
  let os={id:Date.now(),num:osNum,empresa:document.getElementById('osEmpresa').value||document.getElementById('osEmpresaDisplay').value,data:document.getElementById('osData').value||new Date().toISOString().split('T')[0]};
  let lista=JSON.parse(localStorage.getItem('bethec_os')||'[]');
  lista.unshift(os);
  localStorage.setItem('bethec_os',JSON.stringify(lista.slice(0,200)));
  if(mostrarPop)pop('Salvo','OS '+osNum+' salva no histórico');
}
function filtrarOS(){
  let busca=document.getElementById('buscaOS').value.toLowerCase();
  let lista=JSON.parse(localStorage.getItem('bethec_os')||'[]');
  let filtrada=lista.filter(o=>!busca||o.empresa.toLowerCase().includes(busca)||o.num.toString().includes(busca));
  let div=document.getElementById('listaOS');
  if(div)div.innerHTML=filtrada.map(o=>`<div class="item"><b>OS ${o.num}</b> - ${o.empresa} - ${o.data}<br><button onclick="delOS(${o.id})" style="font-size:10px;margin-top:4px">Excluir</button></div>`).join('')||'<p style="color:#999">Nenhuma OS</p>';
}
function carregarDashboardUser(){filtrarOS();}
function delOS(id){
  if(!confirm('Excluir OS?'))return;
  let lista=JSON.parse(localStorage.getItem('bethec_os')||'[]');
  lista=lista.filter(o=>o.id!=id);
  localStorage.setItem('bethec_os',JSON.stringify(lista));
  filtrarOS();
  atualizarStats();
}
function atualizarStats(){
  let listaOS=JSON.parse(localStorage.getItem('bethec_os')||'[]');
  let listaEmp=JSON.parse(localStorage.getItem('bethec_empresas')||'[]');
  let listaEquip=JSON.parse(localStorage.getItem('bethec_equipamentos')||'[]');
  let el=document.getElementById('statOS');if(el)el.textContent=listaOS.length;
  let empEl=document.getElementById('statEmp');if(empEl)empEl.textContent=listaEmp.length;
  let equipEl=document.getElementById('statEquip');if(equipEl)equipEl.textContent=listaEquip.length;
}
function downloadOS(){
  gerarQRCodeAuto();
  const osNum=document.getElementById('numOS').value||'4072';
  const area=document.getElementById('pdfArea');
  const botoes=document.getElementById('botoes');
  botoes.style.display='none';
  let opt={margin:2,filename:'OS-BETHEC-'+osNum+'.pdf',image:{type:'jpeg',quality:0.95},html2canvas:{scale:2,useCORS:true},jsPDF:{unit:'mm',format:'a4',orientation:'portrait'}};
  html2pdf().set(opt).from(area).save().then(()=>{
    botoes.style.display='flex';
    pop('Download','PDF salvo: OS-BETHEC-'+osNum+'.pdf');
  });
}
function downloadBackupJSON(){
  let backup={empresas:JSON.parse(localStorage.getItem('bethec_empresas')||'[]'),equipamentos:JSON.parse(localStorage.getItem('bethec_equipamentos')||'[]'),os:JSON.parse(localStorage.getItem('bethec_os')||'[]')};
  let blob=new Blob([JSON.stringify(backup,null,2)],{type:'application/json'});
  let url=URL.createObjectURL(blob);
  let a=document.createElement('a');a.href=url;a.download='BETHEC-BACKUP-'+new Date().toISOString().split('T')[0]+'.json';a.click();URL.revokeObjectURL(url);
  pop('Backup','Backup baixado');
}
function downloadTodasOS(){
  let lista=JSON.parse(localStorage.getItem('bethec_os')||'[]');
  if(lista.length===0)return pop('Erro','Nenhuma OS');
  let csv='NUMERO,EMPRESA,DATA\n';
  lista.forEach(o=>{csv+=`"${o.num}","${o.empresa}","${o.data}"\n`;});
  let blob=new Blob([csv],{type:'text/csv'});
  let url=URL.createObjectURL(blob);
  let a=document.createElement('a');a.href=url;a.download='BETHEC-OS.csv';a.click();URL.revokeObjectURL(url);
  pop('CSV','CSV baixado');
}
function listarBackups(){}
function carregarAdminTudo(){
  let users=JSON.parse(localStorage.getItem('bethec_users')||'[]');
  let os=JSON.parse(localStorage.getItem('bethec_os')||'[]');
  let emp=JSON.parse(localStorage.getItem('bethec_empresas')||'[]');
  let equip=JSON.parse(localStorage.getItem('bethec_equipamentos')||'[]');
  document.getElementById('admUsers').textContent=users.length;
  document.getElementById('admOS').textContent=os.length;
  document.getElementById('admEmp').textContent=emp.length;
  document.getElementById('admEquip').textContent=equip.length;
  tabAdmin('users');
}
function tabAdmin(tipo){
  let div=document.getElementById('adminConteudo');
  if(tipo==='users'){
    let users=JSON.parse(localStorage.getItem('bethec_users')||'[]');
    div.innerHTML=users.map(u=>`<div class="item"><b>${u.nome}</b> - ${u.email} ${u.isAdmin?'👑 ADMIN':''}<br><button onclick="delUser(${u.id})" style="font-size:10px;margin-top:4px;background:#c81e1e;color:#fff;border:none;padding:6px 10px;border-radius:6px">Excluir</button></div>`).join('')||'<p>Nenhum usuário</p>';
  }else if(tipo==='os'){
    let lista=JSON.parse(localStorage.getItem('bethec_os')||'[]');
    div.innerHTML=lista.map(o=>`<div class="item"><b>OS ${o.num}</b> - ${o.empresa}<br><button onclick="delOS(${o.id})" style="font-size:10px;background:#c81e1e;color:#fff;border:none;padding:6px 10px;border-radius:6px">Excluir OS</button></div>`).join('')||'<p>Nenhuma OS</p>';
  }else if(tipo==='empresas'){
    let lista=JSON.parse(localStorage.getItem('bethec_empresas')||'[]');
    div.innerHTML=lista.map(e=>`<div class="item"><b>${e.nome}</b><br><button onclick="delEmpresa(${e.id})" style="font-size:10px;background:#c81e1e;color:#fff;border:none;padding:6px 10px;border-radius:6px">Excluir</button></div>`).join('')||'<p>Nenhuma</p>';
  }else{
    let lista=JSON.parse(localStorage.getItem('bethec_equipamentos')||'[]');
    div.innerHTML=lista.map(e=>`<div class="item"><b>${e.marca} ${e.modelo}</b><br><button onclick="delEquip(${e.id})" style="font-size:10px;background:#c81e1e;color:#fff;border:none;padding:6px 10px;border-radius:6px">Excluir</button></div>`).join('')||'<p>Nenhum</p>';
  }
}
function delUser(id){
  if(!confirm('Excluir usuário?'))return;
  let users=JSON.parse(localStorage.getItem('bethec_users')||'[]');
  users=users.filter(u=>u.id!=id);
  localStorage.setItem('bethec_users',JSON.stringify(users));
  carregarAdminTudo();
}

function fazerLogin(){
  let email=document.getElementById('lEmail').value.trim().toLowerCase();
  let senha=document.getElementById('lSenha').value;
  let users=JSON.parse(localStorage.getItem('bethec_users')||'[]');
  let user=users.find(u=>u.email===email&&u.senha===senha);
  if(!user){document.getElementById('loginHint').textContent='E-mail ou senha incorretos';return}
  localStorage.setItem('bethec_logged_user',JSON.stringify(user));
  isAdminMode = (user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase());
  document.getElementById('cardAdmin').style.display = isAdminMode ? 'flex' : 'none';
  document.getElementById('userRoleInfo').textContent = isAdminMode ? '👑 MODO ADMIN TOTAL - Bruh_ghost@hotmail.com' : 'Usuário: '+user.email;
  document.getElementById('userEmailLog').textContent='Logado: '+user.email;
  show('menu');
}

function loginAdmin(){
  let email=document.getElementById('aEmail').value.trim().toLowerCase();
  let senha=document.getElementById('aSenha').value;
  if(email.toLowerCase()===ADMIN_EMAIL.toLowerCase() && senha===ADMIN_SENHA){
    isAdminMode=true;
    let admin={id:9999,nome:'Admin Bruh_ghost',email:ADMIN_EMAIL,senha:ADMIN_SENHA,isAdmin:true};
    localStorage.setItem('bethec_logged_user',JSON.stringify(admin));
    let users=JSON.parse(localStorage.getItem('bethec_users')||'[]');
    if(!users.find(u=>u.email.toLowerCase()===ADMIN_EMAIL.toLowerCase())){
      users.push(admin);
      localStorage.setItem('bethec_users',JSON.stringify(users));
    }
    document.getElementById('cardAdmin').style.display='flex';
    document.getElementById('userRoleInfo').textContent='👑 MODO ADMIN TOTAL - Bruh_ghost@hotmail.com';
    document.getElementById('userEmailLog').textContent='Logado como ADMIN TOTAL: '+ADMIN_EMAIL;
    show('adminPanel');
  }else{
    pop('Erro','Credenciais inválidas\nUse:\nBruh_ghost@hotmail.com\nSofia919521*');
  }
}

function fazerCadastro(){
  let nome=document.getElementById('cNome').value.trim();
  let email=document.getElementById('cEmail').value.trim().toLowerCase();
  let senha=document.getElementById('cSenha').value;
  if(!nome||!email||!senha){document.getElementById('cadHint').textContent='Preencha tudo';return}
  let users=JSON.parse(localStorage.getItem('bethec_users')||'[]');
  if(users.find(u=>u.email===email)){document.getElementById('cadHint').textContent='E-mail já cadastrado';return}
  let isAdmin = (email.toLowerCase()===ADMIN_EMAIL.toLowerCase());
  users.push({id:Date.now(),nome,email,senha,isAdmin:isAdmin});
  localStorage.setItem('bethec_users',JSON.stringify(users));
  pop('Sucesso','Conta criada! Faça login');
  show('login');
}

function fazerLogout(){
  localStorage.removeItem('bethec_logged_user');
  isAdminMode=false;
  document.getElementById('cardAdmin').style.display='none';
  show('login');
}

function pop(t,m){
  document.getElementById('popT').textContent=t;
  document.getElementById('popM').textContent=m;
  document.getElementById('pop').classList.add('show');
}
function closePop(){document.getElementById('pop').classList.remove('show');}

// BOTÃO DISCRETO - SEMPRE VISÍVEL + MELHORA QUANDO CHROME LIBERA
window.addEventListener('beforeinstallprompt',(e)=>{
  e.preventDefault();
  deferredPrompt=e;
  let btn=document.getElementById('btnInstalarCantinho');
  if(btn){
    btn.style.opacity='1';
    btn.style.color='#22c55e';
    btn.style.fontWeight='bold';
    btn.innerHTML='📲 instalar app (clique aqui)';
  }
});

function instalarApp(){
  let btn=document.getElementById('btnInstalarCantinho');
  let isIOS=/iPad|iPhone|iPod/.test(navigator.userAgent);
  let isInStandalone=window.navigator.standalone===true||window.matchMedia('(display-mode: standalone)').matches;
  if(isInStandalone){
    pop('✅ Já instalado','O app BETHEC já está instalado como aplicativo nativo na sua tela inicial!');
    if(btn)btn.style.display='none';
    return
  }
  if(isIOS){
    pop('📲 Instalar no iPhone','1 - Toque no botão Compartilhar ⬆️ (quadrado com seta na barra inferior)\n2 - Role para baixo e toque em "Adicionar à Tela de Início"\n3 - Toque em "Adicionar" no canto superior direito\n\nPronto! Ícone BETHEC na tela inicial.');
    return
  }
  if(deferredPrompt){
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(choice=>{
      if(choice.outcome==='accepted'){
        pop('✅ Instalando...','App BETHEC sendo instalado! Procure o ícone BETHEC na sua tela inicial. Ele funciona offline.');
        if(btn)btn.style.display='none';
      }else{
        pop('Instalação cancelada','Você pode instalar depois clicando no botão discreto no cantinho.');
      }
      deferredPrompt=null;
    });
  }else{
    // Mesmo sem prompt, mostra como instalar manualmente
    pop('📲 Como instalar o App BETHEC','Para instalar:\n\nANDROID CHROME:\n1 - Clique nos 3 pontinhos ⋮ no canto superior direito\n2 - Clique em "Instalar app" ou "Adicionar à tela inicial"\n3 - Clique em Instalar\n\nSe não aparecer "Instalar app", clique em "Adicionar à tela inicial".\n\nO app vai para sua tela inicial com sua logo original e funciona OFFLINE como app nativo!\n\nLink: https://bruhghost-frontdesign.github.io/betech-novo/');
  }
}

window.addEventListener('load',()=>{
  initCanvas();
  let u=JSON.parse(localStorage.getItem('bethec_logged_user')||'null');
  if(u){
    isAdminMode=(u.email.toLowerCase()===ADMIN_EMAIL.toLowerCase());
    document.getElementById('cardAdmin').style.display=isAdminMode?'flex':'none';
    document.getElementById('userEmailLog').textContent='Logado: '+u.email;
    document.getElementById('userRoleInfo').textContent=isAdminMode?'👑 MODO ADMIN TOTAL - Bruh_ghost@hotmail.com':'Usuário: '+u.email;
    show('menu');
  }
  atualizarStats();
  // Verifica se já está instalado
  if(window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone===true){
    let btn=document.getElementById('btnInstalarCantinho');
    if(btn)btn.style.display='none';
  }
});
