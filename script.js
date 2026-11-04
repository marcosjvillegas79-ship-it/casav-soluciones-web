const m=document.getElementById('menu'),n=document.getElementById('nav');m.addEventListener('click',()=>n.classList.toggle('open'));document.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>n.classList.remove('open')));document.getElementById('year').textContent=new Date().getFullYear();

// Asistente automático de preguntas frecuentes CASAV (sin API ni costos de IA).
(()=>{
 const panel=document.getElementById('casav-chat-panel');
 const open=document.getElementById('chat-open');
 const close=document.getElementById('chat-close');
 const messages=document.getElementById('chat-messages');
 const form=document.getElementById('chat-form');
 const input=document.getElementById('chat-input');
 if(!panel||!open||!close||!messages||!form||!input)return;
 const wa='https://wa.me/5491172815934?text='+encodeURIComponent('Hola CASAV, quisiera realizar una consulta.');
 const hours=()=>{
  const now=new Date();
  const parts=new Intl.DateTimeFormat('es-AR',{timeZone:'America/Argentina/Buenos_Aires',weekday:'short',hour:'2-digit',hourCycle:'h23'}).formatToParts(now);
  const day=parts.find(p=>p.type==='weekday')?.value||'';
  const hour=Number(parts.find(p=>p.type==='hour')?.value||0);
  const weekday=!day.startsWith('sáb')&&!day.startsWith('dom');
  return weekday&&hour>=9&&hour<18?'Ahora estamos dentro del horario de atención (lunes a viernes, de 9 a 18 hs).':'En este momento estamos fuera del horario de atención. Atendemos de lunes a viernes, de 9 a 18 hs. Podés dejarnos tu consulta y te responderemos el próximo día hábil.';
 };
 const answers={
  servicios:'En CASAV ofrecemos electricidad, seguridad electrónica, mantenimiento general, pintura, albañilería, trabajos en seco, impermeabilización, plomería, climatización, herrería, carpintería y servicio técnico informático especializado para PC y notebooks. Realizamos diagnóstico, mantenimiento, reparación y actualización de hardware. Contanos qué necesitás y te orientamos.',
  presupuesto:'¡Claro! Para solicitar un presupuesto, contanos brevemente qué trabajo necesitás, en qué localidad se realiza y cómo podemos contactarte. También podés escribirnos directamente por WhatsApp.',
  horarios:hours(),
  portal:'Desde el Portal de clientes podés ingresar con tu cuenta. Si todavía no tenés acceso, seleccioná “Solicitar acceso”. Las altas son revisadas y autorizadas por el equipo de CASAV.\nIngresar: https://portal.casavsoluciones.com.ar/login.php\nSolicitar acceso: https://portal.casavsoluciones.com.ar/registro.php',
  administrador:'El acceso de administración está reservado al equipo autorizado de CASAV. Los clientes deben ingresar desde el Portal de clientes.',
  whatsapp:'Podés comunicarte con CASAV por WhatsApp desde este enlace: '+wa,
  contacto:'Podés comunicarte por WhatsApp al +54 9 11 7281-5934 o escribir a info@casavsoluciones.com.ar. '+hours()
 };
 const add=(text,kind)=>{
  const el=document.createElement('div');el.className='chat-msg '+(kind==='user'?'user-msg':'bot-msg');el.textContent=text;messages.appendChild(el);messages.scrollTop=messages.scrollHeight;
 };
 const answer=(raw)=>{
  const q=raw.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  let key='contacto';
  if(/servicio|que hacen|que ofrecen|electric|plomer|pintur|impermeabil|camara|alarma|climat|herrer|carpinter|mantenim|trabajo/.test(q))key='servicios';
  else if(/presup|cotiz|precio|costo|valor/.test(q))key='presupuesto';
  else if(/horario|atienden|abierto|abren|cuando/.test(q))key='horarios';
  else if(/portal|ingresar|registro|registr|acceso|cliente|autoriza/.test(q))key='portal';
  else if(/admin/.test(q))key='administrador';
  else if(/whatsapp|telefono|celular|contact/.test(q))key='whatsapp';
  add(answers[key]+'\n\n'+(key==='presupuesto'||key==='contacto'?' '+hours()+'\n':'')+'Si necesitás atención personal, podés continuar por WhatsApp: '+wa,'bot');
 };
 const show=()=>{panel.classList.add('is-open');panel.setAttribute('aria-hidden','false');open.setAttribute('aria-expanded','true');input.focus();};
 const hide=()=>{panel.classList.remove('is-open');panel.setAttribute('aria-hidden','true');open.setAttribute('aria-expanded','false');open.focus();};
 open.addEventListener('click',()=>panel.classList.contains('is-open')?hide():show());
 close.addEventListener('click',hide);
 form.addEventListener('submit',e=>{e.preventDefault();const value=input.value.trim();if(!value)return;add(value,'user');input.value='';answer(value);});
 messages.addEventListener('click',e=>{const b=e.target.closest('button[data-question]');if(!b)return;const key=b.dataset.question;add(b.textContent,'user');add(answers[key]+'\n\nSi necesitás atención personal, podés continuar por WhatsApp: '+wa,'bot');});
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
 const brandDomains={siemens:'siemens.com',schneiderelectric:'se.com',philips:'philips.com',hikvision:'hikvision.com',dahuatechnology:'dahuasecurity.com',tplink:'tp-link.com',uniview:'uniview.com',avigilon:'avigilon.com',motorola:'motorolasolutions.com',imou:'imoulife.com',suprema:'supremainc.com',apc:'apc.com',kingstontechnology:'kingston.com',samsung:'samsung.com',sika:'arg.sika.com',lg:'lg.com',viewsonic:'viewsonic.com',dell:'dell.com',hp:'hp.com',logitech:'logitech.com',amd:'amd.com',intel:'intel.com',abb:'global.abb',legrand:'legrand.com',weg:'weg.net',chint:'chintglobal.com',phoenixcontact:'phoenixcontact.com',finder:'findernet.com',prysmian:'prysmiangroup.com',ledvance:'ledvance.com',cambre:'cambre.com.ar',sica:'sicaelec.com',hellermanntyton:'hellermanntyton.com'};
 const brand=(slug,alt)=>({src:'https://www.google.com/s2/favicons?domain='+(brandDomains[slug]||slug+'.com')+'&sz=128',alt});
 const electricalBrands=[
  brand('schneiderelectric','Schneider Electric'),brand('siemens','Siemens'),brand('abb','ABB'),brand('legrand','Legrand'),brand('weg','WEG'),
  brand('chint','CHINT'),brand('phoenixcontact','Phoenix Contact'),brand('finder','Finder'),brand('prysmian','Prysmian'),brand('ledvance','LEDVANCE'),
  brand('cambre','Cambre'),brand('sica','SICA'),brand('hellermanntyton','HellermannTyton')
 ];
 const data={
  'Electricidad':{desc:'Instalaciones eléctricas residenciales, comerciales e industriales; montaje de tableros, protecciones, iluminación, canalizaciones, diagnóstico y mantenimiento.',photos:['photo-1621905251189-08b45d6a269e','photo-1621905252507-b35492cc74b4'],brands:electricalBrands},
  'Seguridad electrónica':{desc:'Diseño e instalación de videovigilancia, cámaras IP, grabación, alarmas y soluciones de control de acceso.',photos:['photo-1557597774-9d273605dfa9','photo-1558008258-3256797b43f3'],brands:[brand('hikvision','Hikvision'),brand('dahuatechnology','Dahua'),brand('tplink','TP-Link'),brand('uniview','Uniview'),brand('avigilon','Avigilon'),brand('motorola','Motorola Solutions'),brand('imou','Imou'),brand('suprema','Suprema')]},
  'Mantenimiento general':{desc:'Mantenimiento preventivo y correctivo de edificios, instalaciones y equipamiento; inspecciones, reparaciones y seguimiento de incidencias.',photos:['photo-1581578731548-c64695cc6952','photo-1581092160562-40aa08e78837'],brands:[...electricalBrands,brand('apc','APC')]},
  'Mantenimiento industrial':{desc:'Mantenimiento industrial preventivo y correctivo de máquinas, bombas, motores, tableros, instalaciones y sistemas auxiliares.',photos:['photo-1581092160562-40aa08e78837','photo-1581092580497-e0d23cbdf1dc'],brands:[brand('siemens','Siemens'),brand('abb','ABB'),brand('weg','WEG'),brand('schneiderelectric','Schneider Electric'),brand('phoenixcontact','Phoenix Contact'),brand('finder','Finder')]},
  'Obra y terminaciones':{desc:'Pintura profesional, revestimientos, impermeabilización, albañilería y construcción en seco para renovar y proteger espacios.',photos:['photo-1562259949-e8e7689d7828','photo-1589939705384-5185137a7f0f'],brands:[brand('sika','Sika')]},
  'Instalaciones':{desc:'Instalaciones de plomería, climatización, cableado y adecuaciones técnicas, con diagnóstico y terminaciones prolijas.',photos:['photo-1607472586893-edb57bdc0e39','photo-1631545806609-1b4b4f1f1f7d'],brands:electricalBrands},
  'Herrería y carpintería':{desc:'Fabricación, reparación y ajuste de elementos de herrería y carpintería, con soluciones adaptadas a cada necesidad.',photos:['photo-1504148455328-c376907d081c','photo-1620626011761-996317b8d101'],brands:[]},
  'Soldadura':{desc:'Trabajos de soldadura y reparación de piezas, soportes, estructuras y componentes metálicos. Evaluación de cada trabajo según material y aplicación.',photos:['photo-1504917595217-d4dc5ebe6122','photo-1504307651254-35680f356dfd'],brands:[]},
  'Data centers e infraestructura':{desc:'Instalación y adecuación de racks, cableado estructurado, organización de salas técnicas, energía crítica, UPS y climatización para infraestructura IT.',photos:['photo-1558494949-ef010cbdcc31','photo-1597852074816-d933c7d2b988'],brands:[brand('apc','APC'),brand('schneiderelectric','Schneider Electric'),brand('siemens','Siemens'),brand('dell','Dell'),brand('hp','HP'),brand('kingstontechnology','Kingston'),brand('intel','Intel')]},
  'Servicio técnico informático especializado':{desc:'Diagnóstico, reparación y mantenimiento de PC y notebooks, actualización de memoria RAM y SSD, instalación de sistemas y armado de equipos.',photos:['photo-1581091226825-a6a2a5aee158','photo-1519389950473-47ba0277781c'],brands:[brand('lg','LG'),brand('samsung','Samsung'),brand('viewsonic','ViewSonic'),brand('dell','Dell'),brand('hp','HP'),brand('logitech','Logitech'),brand('amd','AMD'),brand('intel','Intel'),brand('kingstontechnology','Kingston')]}
 };
 const open=(name)=>{
  const item=data[name];if(!item)return;
  const logos=item.brands.length?item.brands.map(b=>'<img src="'+b.src+'" alt="'+b.alt+'" title="'+b.alt+'" loading="lazy" onerror="this.remove()">').join(''):'<span class="service-brand-empty">Consultanos por las marcas y materiales disponibles para este servicio.</span>';
  const set='<div class="service-brand-set">'+logos+'</div>';
  const ticker=item.brands.length?'<div class="service-brand-marquee"><div class="service-brand-track">'+set+set+'</div></div>':'';
  content.innerHTML='<div class="service-detail"><div class="service-detail-head"><small>CASAV SOLUCIONES · SERVICIOS</small><h2 id="service-modal-title">'+name+'</h2><p>'+item.desc+'</p></div><div class="service-photo-grid"><img src="'+photo(item.photos[0])+'" alt="Profesional trabajando en '+name+'" loading="lazy"><img src="'+photo(item.photos[1])+'" alt="Trabajo y herramientas de '+name+'" loading="lazy"></div><div class="service-detail-copy"><h3>¿Qué podemos resolver?</h3><p>Evaluamos cada necesidad y coordinamos una solución acorde al espacio, al uso y al alcance del trabajo. Contactanos para contarnos qué necesitás y solicitar un presupuesto.</p></div><div class="service-brand-area"><h3>Marcas y tecnologías relacionadas</h3>'+ticker+ (item.brands.length?'':'<p class="service-brand-empty">Trabajamos con materiales y equipamiento adecuados a cada proyecto.</p>')+'</div></div>';
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
