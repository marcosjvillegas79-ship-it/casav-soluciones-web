const m=document.getElementById('menu'),n=document.getElementById('nav');m.addEventListener('click',()=>n.classList.toggle('open'));document.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>n.classList.remove('open')));document.getElementById('year').textContent=new Date().getFullYear();

// Asistente automático CASAV: respuestas breves, enlaces legibles y navegación accesible.
(()=>{
 const panel=document.getElementById('casav-chat-panel');
 const open=document.getElementById('chat-open');
 const close=document.getElementById('chat-close');
 const messages=document.getElementById('chat-messages');
 const form=document.getElementById('chat-form');
 const input=document.getElementById('chat-input');
 const avatar=document.querySelector('.chat-avatar-mark');
 const logo=document.querySelector('.casav-mark');
 if(!panel||!open||!close||!messages||!form||!input)return;
 if(avatar&&logo){const mark=logo.cloneNode();mark.removeAttribute('alt');avatar.appendChild(mark);}
 const wa='https://wa.me/5491172815934?text='+encodeURIComponent('Hola CASAV, quisiera realizar una consulta.');
 const hours=()=>{
  const parts=new Intl.DateTimeFormat('es-AR',{timeZone:'America/Argentina/Buenos_Aires',weekday:'short',hour:'2-digit',hourCycle:'h23'}).formatToParts(new Date());
  const day=parts.find(p=>p.type==='weekday')?.value||'';
  const hour=Number(parts.find(p=>p.type==='hour')?.value||0);
  const weekday=!day.startsWith('sáb')&&!day.startsWith('dom');
  return weekday&&hour>=9&&hour<18
   ?'Estamos dentro del horario de atención informado: lunes a viernes, de 9 a 18 h.'
   :'En este momento estamos fuera del horario de atención informado. Podés dejarnos tu consulta y el equipo podrá responderte el próximo día hábil.';
 };
 const answers={
  servicios:'En CASAV brindamos servicios de electricidad, seguridad electrónica, mantenimiento general e industrial, obra y terminaciones, instalaciones, herrería, carpintería, soporte informático y soluciones para infraestructura y data centers. Si me contás qué necesitás, puedo orientarte hacia el servicio adecuado.',
  presupuesto:'Para pedir un presupuesto, ingresá en “Solicitar presupuesto” y completá el formulario. Te vamos a pedir una descripción del trabajo, la localidad y tus datos de contacto. También podés adjuntar fotos o documentación para ayudarnos a evaluar el pedido.',
  horarios:hours(),
  portal:'El Portal de clientes permite ingresar a tu cuenta y consultar tus solicitudes. Si todavía no tenés usuario, podés solicitar un acceso; el equipo de CASAV revisará el pedido antes de habilitarlo.\nIngresar al portal: https://portal.casavsoluciones.com.ar/login.php\nSolicitar acceso: https://portal.casavsoluciones.com.ar/registro.php',
  administrador:'El acceso de administración está reservado al personal autorizado de CASAV. Si sos cliente, utilizá el Portal de clientes.',
  whatsapp:'Podés escribirnos directamente por WhatsApp para realizar una consulta general o coordinar el contacto con nuestro equipo.',
  contacto:'Podés realizar una consulta general por WhatsApp o por correo electrónico a info@casavsoluciones.com.ar. Para solicitar un presupuesto formal, utilizá el formulario de la web.'
 };
 const linkLabel=(url)=>{
  if(url.includes('wa.me'))return 'Abrir conversación por WhatsApp';
  if(url.includes('/login.php'))return 'Ingresar al Portal de clientes';
  if(url.includes('/registro.php'))return 'Solicitar acceso al portal';
  return url;
 };
 const appendMessage=(el,value)=>{
  const re=/(https?:\/\/[^\s]+)/g;let last=0,match;
  while((match=re.exec(value))){
   el.appendChild(document.createTextNode(value.slice(last,match.index)));
   const a=document.createElement('a');a.href=match[0].replace(/[.,;]+$/,'');a.textContent=linkLabel(a.href);a.target='_blank';a.rel='noopener noreferrer';a.className='chat-inline-link';
   el.appendChild(a);
   const trailing=match[0].slice(a.href.length);if(trailing)el.appendChild(document.createTextNode(trailing));
   last=re.lastIndex;
  }
  el.appendChild(document.createTextNode(value.slice(last)));
 };
 const add=(value,kind)=>{
  const el=document.createElement('div');el.className='chat-msg '+(kind==='user'?'user-msg':'bot-msg');
  appendMessage(el,value);messages.appendChild(el);messages.scrollTop=messages.scrollHeight;
 };
 const addWhatsAppLink=()=>{
  const row=document.createElement('div');row.className='chat-action-row';
  const a=document.createElement('a');a.href=wa;a.target='_blank';a.rel='noopener noreferrer';a.className='chat-action-link';a.textContent='Continuar por WhatsApp';
  row.appendChild(a);messages.appendChild(row);messages.scrollTop=messages.scrollHeight;
 };
 const answer=(raw)=>{
  const q=raw.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();
  let key='contacto',reply=null;
  if(/presup|cotiz|precio|costo|valor|cuanto sale/.test(q))key='presupuesto';
  else if(/horario|atienden|abierto|abren/.test(q))key='horarios';
  else if(/portal|ingresar|registro|registr|acceso|cliente|ticket/.test(q))key='portal';
  else if(/admin/.test(q))key='administrador';
  else if(/whatsapp|telefono|celular|llamar/.test(q))key='whatsapp';
  else if(/seguridad|camara|cctv|alarma|videovigil|control de acceso/.test(q))reply='En seguridad electrónica realizamos videovigilancia con cámaras IP, grabación, alarmas y control de acceso. Podemos orientarte según el lugar, la cantidad de cámaras y si necesitás verlas desde el celular. Para cotizar, contanos la localidad y adjuntá fotos del sitio.';
  else if(/electric|tablero|disyuntor|termica|iluminacion/.test(q))reply='En electricidad hacemos instalaciones, diagnóstico de fallas, tableros, protecciones, iluminación y mantenimiento. Describí la falla y la localidad para evaluar el trabajo.';
  else if(/plomer|agua|canilla|bano|sanitari|perdida/.test(q))reply='En instalaciones atendemos trabajos de plomería, sanitarios, cañerías y adecuaciones. Indicá dónde está el problema y la localidad. Si es urgente, contactanos por WhatsApp.';
  else if(/aire|climat|refriger|calefaccion/.test(q))reply='Realizamos trabajos de climatización e instalaciones vinculadas. Decinos si es instalación, mantenimiento o reparación, el tipo de equipo y la localidad.';
  else if(/impermeabil|filtracion|humedad|terraza|techo/.test(q))reply='En obra y terminaciones hacemos impermeabilización, pintura, revestimientos, albañilería y trabajos en seco. Contanos qué superficie presenta el problema y adjuntá fotos para solicitar una evaluación.';
  else if(/herrer|soldad|carpinter|mueble|estructura metal/.test(q))reply='En herrería y carpintería realizamos reparaciones, ajustes, fabricación y trabajos a medida, incluyendo soldadura. Describí medidas, material y lugar del trabajo.';
  else if(/comput|notebook|pc|informat|ssd|memoria ram/.test(q))reply='El servicio técnico informático incluye diagnóstico y mantenimiento de PC y notebooks, actualización de RAM y SSD, instalación de sistemas y armado de equipos. Contanos marca/modelo, falla y localidad.';
  else if(/industrial|bomba|motor|generador|grupo electrogeno/.test(q))reply='En mantenimiento industrial atendemos equipos, bombas, motores, tableros e instalaciones. Indicá el equipo, la falla y si el servicio es preventivo o correctivo.';
  else if(/data center|datacenter|rack|cableado|ups|servidor/.test(q))reply='En data centers e infraestructura trabajamos con racks, cableado estructurado, energía crítica, UPS y climatización de salas técnicas. Describí el alcance y el sitio.';
  else if(/servicio|que hacen|que ofrecen|mantenim|trabajo/.test(q))key='servicios';
  else if(/hola|buen dia|buenas|gracias/.test(q)){add('¡Hola! Gracias por comunicarte con CASAV. Puedo orientarte sobre servicios, presupuestos, seguridad electrónica, instalaciones, mantenimiento, soporte informático o el portal de clientes. ¿Qué necesitás resolver?','bot');return;}
  if(reply){add(reply,'bot');addWhatsAppLink();return;}
  add(answers[key],'bot');
  if(key==='whatsapp'||key==='contacto')addWhatsAppLink();
  if(key==='presupuesto'){const a=document.createElement('a');a.href='#presupuesto';a.className='chat-action-link';a.textContent='Ir al formulario de presupuesto';a.addEventListener('click',()=>{panel.classList.remove('is-open');panel.setAttribute('aria-hidden','true');open.setAttribute('aria-expanded','false');});messages.appendChild(a);}
 };
 const show=()=>{panel.classList.add('is-open');panel.setAttribute('aria-hidden','false');open.setAttribute('aria-expanded','true');input.focus();};
 const hide=()=>{panel.classList.remove('is-open');panel.setAttribute('aria-hidden','true');open.setAttribute('aria-expanded','false');open.focus();};
 open.addEventListener('click',()=>panel.classList.contains('is-open')?hide():show());
 close.addEventListener('click',hide);
 form.addEventListener('submit',e=>{e.preventDefault();const value=input.value.trim();if(!value)return;add(value,'user');input.value='';answer(value);});
 messages.addEventListener('click',e=>{
  const b=e.target.closest('button[data-question]');if(!b)return;
  const key=b.dataset.question;add(b.textContent,'user');answer(key);
 });
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&panel.classList.contains('is-open'))hide();});
})();


// Animaciones discretas, barra de progreso y respeto por movimiento reducido.
(()=>{
 const reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const header=document.querySelector('header'),progress=document.querySelector('.page-progress');
 const update=()=>{if(header)header.classList.toggle('scrolled',window.scrollY>12);if(progress){const max=document.documentElement.scrollHeight-window.innerHeight;progress.style.width=(max>0?(window.scrollY/max)*100:0)+'%';}};
 window.addEventListener('scroll',update,{passive:true});update();
 if(reduce||!('IntersectionObserver'in window))return;
 const targets=document.querySelectorAll('.hero>div,.hero>aside,.section>small,.section>h2,.section>.intro,.cards article,.portal>div,.portal>aside,.placeholder,.work div,.about,.contact>div,footer');
 targets.forEach((el,i)=>{el.classList.add('reveal');if(el.matches('.cards article,.work div'))el.classList.add('reveal-delay-'+((i%3)+1));});
 document.documentElement.classList.add('reveal-ready');
 const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}});},{threshold:.12,rootMargin:'0px 0px -35px 0px'});
 targets.forEach(el=>observer.observe(el));
})();


// Fichas interactivas de servicios: fotos ilustrativas y logotipos sin rótulos.
(()=> {
 const modal=document.getElementById('service-modal');
 const content=document.getElementById('service-detail-content');
 if(!modal||!content)return;
 const photo=(id)=>'https://images.unsplash.com/'+id+'?auto=format&fit=crop&w=1100&q=82';
 const brandDomains={siemens:'siemens.com',schneiderelectric:'se.com',philips:'philips.com',hikvision:'hikvision.com',dahuatechnology:'dahuasecurity.com',tplink:'tp-link.com',uniview:'uniview.com',avigilon:'avigilon.com',motorola:'motorolasolutions.com',pelco:'pelco.com',amag:'amag.com',tiandy:'tiandy.com',imou:'imoulife.com',suprema:'supremainc.com',apc:'apc.com',kingstontechnology:'kingston.com',samsung:'samsung.com',sika:'arg.sika.com',lg:'lg.com',viewsonic:'viewsonic.com',dell:'dell.com',hp:'hp.com',logitech:'logitech.com',amd:'amd.com',intel:'intel.com',abb:'global.abb',legrand:'legrand.com',weg:'weg.net',chint:'chintglobal.com',phoenixcontact:'phoenixcontact.com',finder:'findernet.com',prysmian:'prysmiangroup.com',ledvance:'ledvance.com',cambre:'cambre.com.ar',sica:'sicaelec.com',hellermanntyton:'hellermanntyton.com',intelbras:'intelbras.com',ezviz:'ezviz.com',ajax:'ajax.systems',zkteco:'zkteco.com',sherwinwilliams:'sherwin-williams.com',alba:'alba.com.ar',weber:'ar.weber',knauf:'knauf.com',durlock:'durlock.com',fv:'fvsa.com',ferrum:'ferrum.com',tigre:'tigre.com.ar',ips:'ips.com.ar',rotoplas:'rotoplas.com',carrier:'carrier.com',surrey:'surrey.com.ar',bgh:'bgh.com.ar',daikin:'daikin.com',midea:'midea.com',bosch:'bosch.com',dewalt:'dewalt.com',makita:'makita.com',hafele:'hafele.com',masisa:'masisa.com',faplac:'faplac.com.ar',lincolnelectric:'lincolnelectric.com',esab:'esab.com',infra:'infra.com.mx'};
 const brand=(slug,alt)=>({src:'https://www.google.com/s2/favicons?domain='+(brandDomains[slug]||slug+'.com')+'&sz=128',alt});
 const electricalBrands=[
  brand('schneiderelectric','Schneider Electric'),brand('siemens','Siemens'),brand('abb','ABB'),brand('legrand','Legrand'),brand('weg','WEG'),
  brand('chint','CHINT'),brand('phoenixcontact','Phoenix Contact'),brand('finder','Finder'),brand('prysmian','Prysmian'),brand('ledvance','LEDVANCE'),
  brand('cambre','Cambre'),brand('sica','SICA'),brand('hellermanntyton','HellermannTyton'),brand('philips','Philips'),brand('ledvance','LEDVANCE')
 ];
 const data={
  'Electricidad':{desc:'Instalaciones eléctricas residenciales, comerciales e industriales; montaje de tableros, protecciones, iluminación, canalizaciones, diagnóstico y mantenimiento.',photos:['photo-1621905251189-08b45d6a269e','photo-1621905252507-b35492cc74b4','photo-1581092160562-40aa08e78837','photo-1621905251918-48416bd8575a'],brands:electricalBrands},
  'Seguridad electrónica':{desc:'Diseño e instalación de videovigilancia, cámaras IP, grabación, alarmas y soluciones de control de acceso.',photos:['photo-1557597774-9d273605dfa9','photo-1558008258-3256797b43f3','photo-1582139329536-e7284fece509','photo-1563013544-bd5a0b7d9e4b'],brands:[brand('hikvision','Hikvision'),brand('dahuatechnology','Dahua'),brand('tplink','TP-Link'),brand('uniview','Uniview'),brand('avigilon','Avigilon'),brand('motorola','Motorola Solutions'),brand('pelco','Pelco'),brand('amag','AMAG Technology'),brand('tiandy','Tiandy'),brand('imou','Imou'),brand('suprema','Suprema'),brand('intelbras','Intelbras'),brand('ezviz','EZVIZ'),brand('ajax','Ajax Systems'),brand('zkteco','ZKTeco')]},
  'Mantenimiento general':{desc:'Mantenimiento preventivo y correctivo de edificios, instalaciones y equipamiento; inspecciones, reparaciones y seguimiento de incidencias.',photos:['photo-1581578731548-c64695cc6952','photo-1504307651254-35680f356dfd','photo-1523413651479-597eb2da0ad6','photo-1581093458791-9d42e3c2b7f4'],brands:[...electricalBrands,brand('apc','APC')]},
  'Mantenimiento industrial':{desc:'Mantenimiento industrial preventivo y correctivo de máquinas, bombas, motores, tableros, instalaciones y sistemas auxiliares.',photos:['photo-1581092160607-ee22621dd758','photo-1581092334651-ddf26d9a09d0','photo-1581092162384-8987c1d64718','photo-1581092795360-fd1ca04f0952'],brands:[brand('siemens','Siemens'),brand('abb','ABB'),brand('weg','WEG'),brand('schneiderelectric','Schneider Electric'),brand('phoenixcontact','Phoenix Contact'),brand('finder','Finder')]},
  'Obra y terminaciones':{desc:'Pintura profesional, revestimientos, impermeabilización, albañilería y construcción en seco para renovar y proteger espacios.',photos:['photo-1562259949-e8e7689d7828','photo-1589939705384-5185137a7f0f','photo-1503387762-592deb58ef4e','photo-1600607687939-ce8a6c25118c'],brands:[brand('sika','Sika'),brand('sherwinwilliams','Sherwin-Williams'),brand('alba','Alba'),brand('weber','Weber'),brand('knauf','Knauf'),brand('durlock','Durlock')]},
  'Instalaciones':{desc:'Instalaciones de plomería, climatización, cableado y adecuaciones técnicas, con diagnóstico y terminaciones prolijas.',photos:['photo-1607472586893-edb57bdc0e39','photo-1631545806609-1b4b4f1f1f7d','photo-1600566753086-00f18fb6b3ea','photo-1600585154340-be6161a56a0c'],brands:[brand('fv','FV'),brand('ferrum','Ferrum'),brand('tigre','Tigre'),brand('ips','IPS'),brand('rotoplas','Rotoplas'),brand('carrier','Carrier'),brand('surrey','Surrey'),brand('bgh','BGH'),brand('daikin','Daikin'),brand('midea','Midea'),brand('lg','LG'),brand('samsung','Samsung')]},
  'Herrería y carpintería':{desc:'Fabricación, reparación y ajuste de elementos de herrería y carpintería, trabajos de soldadura y fabricación de estructuras y piezas metálicas a medida.',photos:['photo-1504148455328-c376907d081c','photo-1620626011761-996317b8d101','photo-1504917595217-d4dc5ebe6122','photo-1518709268805-4e9042af9f23'],brands:[brand('bosch','Bosch'),brand('dewalt','DeWalt'),brand('makita','Makita'),brand('hafele','Häfele'),brand('masisa','Masisa'),brand('faplac','Faplac'),brand('lincolnelectric','Lincoln Electric'),brand('esab','ESAB'),brand('infra','Infra')]},
  'Data centers e infraestructura':{desc:'Instalación y adecuación de racks, cableado estructurado, organización de salas técnicas, energía crítica, UPS y climatización para infraestructura IT.',photos:['photo-1558494949-ef010cbdcc31','photo-1597852074816-d933c7d2b988','photo-1581091226825-a6a2a5aee158','photo-1518770660439-4636190af475'],brands:[brand('apc','APC'),brand('schneiderelectric','Schneider Electric'),brand('siemens','Siemens'),brand('dell','Dell'),brand('hp','HP'),brand('kingstontechnology','Kingston'),brand('intel','Intel')]},
  'Servicio técnico informático especializado':{desc:'Diagnóstico, reparación y mantenimiento de PC y notebooks, actualización de memoria RAM y SSD, instalación de sistemas y armado de equipos.',photos:['photo-1519389950473-47ba0277781c','photo-1517336714731-489689fd1ca8','photo-1496171367470-9ed9a91ea931','photo-1587202372775-e229f172b9d7'],brands:[brand('lg','LG'),brand('samsung','Samsung'),brand('viewsonic','ViewSonic'),brand('dell','Dell'),brand('hp','HP'),brand('logitech','Logitech'),brand('amd','AMD'),brand('intel','Intel'),brand('kingstontechnology','Kingston')]}
 };
 const open=(name)=>{
  const item=data[name];if(!item)return;
  const gallery=item.photos.map((id,i)=>'<img src="'+photo(id)+'" alt="Imagen '+(i+1)+' de '+name+'" loading="lazy">').join('');
  const logos=item.brands.length?item.brands.map(b=>'<div class="service-brand-item"><img src="'+b.src+'" alt="Logotipo '+b.alt+'" loading="lazy" onerror="this.style.display=\'none\'"><span>'+b.alt+'</span></div>').join(''):'<span class="service-brand-empty">Consultanos por las marcas y materiales disponibles para este servicio.</span>';
  const set='<div class="service-brand-set">'+logos+'</div>';
  const ticker=item.brands.length?'<div class="service-brand-marquee"><div class="service-brand-track">'+set+set+'</div></div>':'';
  content.innerHTML='<div class="service-detail"><div class="service-detail-head"><small>CASAV SOLUCIONES · SERVICIOS</small><h2 id="service-modal-title">'+name+'</h2><p>'+item.desc+'</p></div><div class="service-photo-grid">'+gallery+'</div><div class="service-detail-copy"><h3>¿Qué podemos resolver?</h3><p>Evaluamos cada necesidad y coordinamos una solución acorde al espacio, al uso y al alcance del trabajo. Contactanos para contarnos qué necesitás y solicitar un presupuesto.</p></div><div class="service-brand-area"><h3>Marcas y tecnologías relacionadas</h3>'+ticker+ (item.brands.length?'':'<p class="service-brand-empty">Trabajamos con materiales y equipamiento adecuados a cada proyecto.</p>')+'</div></div>';
  modal.classList.add('is-open');modal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';
 };
 const close=()=>{modal.classList.remove('is-open');modal.setAttribute('aria-hidden','true');document.body.style.overflow='';};
 document.querySelectorAll('.service-card').forEach(card=>{
  const name=card.dataset.service;
  card.addEventListener('click',()=>open(name));
  card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open(name);}});
 });
 modal.addEventListener('click',e=>{if(e.target.closest('[data-close-service]'))close();});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal.classList.contains('is-open'))close();});
})();


// Panel lateral de solicitud de presupuesto: conserva el formulario y lo abre sobre la página.
(()=>{
 const section=document.getElementById('presupuesto');
 if(!section||document.getElementById('budget-drawer'))return;
 const overlay=document.createElement('div');
 overlay.id='budget-drawer';
 overlay.className='budget-drawer';
 overlay.setAttribute('aria-hidden','true');
 overlay.innerHTML='<div class="budget-drawer-backdrop" data-budget-close></div><aside class="budget-drawer-panel" role="dialog" aria-modal="true" aria-labelledby="budget-drawer-title"><div class="budget-drawer-top"><strong id="budget-drawer-title">Solicitar presupuesto</strong><button type="button" class="budget-drawer-close" data-budget-close aria-label="Cerrar formulario">×</button></div><div class="budget-drawer-content"></div></aside>';
 document.body.appendChild(overlay);
 const content=overlay.querySelector('.budget-drawer-content');
 content.appendChild(section);
 const launcher=document.createElement('button');
 launcher.type='button';launcher.className='budget-drawer-launcher';launcher.textContent='Solicitar presupuesto';
 launcher.setAttribute('aria-controls','budget-drawer');launcher.setAttribute('aria-expanded','false');
 document.body.appendChild(launcher);
 const open=()=>{
  overlay.classList.add('is-open');overlay.setAttribute('aria-hidden','false');
  launcher.setAttribute('aria-expanded','true');document.body.classList.add('budget-drawer-open');
  const first=section.querySelector('input:not([type=hidden]),select,textarea');
  if(first)first.focus();
 };
 const close=()=>{
  overlay.classList.remove('is-open');overlay.setAttribute('aria-hidden','true');
  launcher.setAttribute('aria-expanded','false');document.body.classList.remove('budget-drawer-open');
  launcher.focus();
 };
 launcher.addEventListener('click',open);
 overlay.addEventListener('click',e=>{if(e.target.closest('[data-budget-close]'))close();});
 document.querySelectorAll('a[href="#presupuesto"]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();open();}));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&overlay.classList.contains('is-open'))close();});
})();
