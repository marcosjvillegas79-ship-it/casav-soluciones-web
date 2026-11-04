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
