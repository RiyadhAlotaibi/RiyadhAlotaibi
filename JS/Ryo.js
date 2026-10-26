document.documentElement.classList.add('js');
const uiCopy=document.getElementById('ui-copy')?.content;
const copy=key=>uiCopy?.querySelector('[data-copy="'+key+'"]')?.textContent.trim()||'';
const numbered=(key,n)=>copy(key).replace('{n}',String(n));
document.querySelectorAll('.lang-picker a').forEach(link=>{
  link.addEventListener('click',()=>{const url=new URL(link.href);url.hash=location.hash;link.href=url.href;});
});


const toggle=document.getElementById('menu-toggle');
const links=document.getElementById('nav-links');
function closeNavigation(){
  links?.classList.remove('open');
  toggle?.setAttribute('aria-expanded','false');toggle?.setAttribute('aria-label',copy('navOpen'));
  const icon=toggle?.querySelector('.menu-fallback');if(icon)icon.textContent='☰';
}
if(toggle&&links){
  toggle.addEventListener('click',()=>{const open=links.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));const icon=toggle.querySelector('.menu-fallback');if(icon)icon.textContent=open?'×':'☰';toggle.setAttribute('aria-label',copy(open?'navClose':'navOpen'))});
  links.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeNavigation));
}
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeNavigation();});
document.addEventListener('click',event=>{if(!event.target.closest('header'))closeNavigation();});

const observer = 'IntersectionObserver' in window ? new IntersectionObserver((entries)=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}})}, {threshold:.12}) : null;
document.querySelectorAll('.reveal').forEach((el,index)=>{ if(!el.style.getPropertyValue('--delay')) el.style.setProperty('--delay', ((index%8)*0.06)+'s'); if(observer) observer.observe(el); else el.classList.add('visible'); });

const modal=document.getElementById('galleryModal');
const modalImg=document.getElementById('modalImage');
const modalCaption=document.getElementById('modalCaption');
const closeBtn=document.getElementById('modalClose');

document.querySelectorAll('.service-media').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const image=btn.querySelector('img');
    if(!modal||!modalImg||!image)return;
    modalImg.src=image.src;modalImg.alt=image.alt;
    if(modalCaption)modalCaption.textContent=btn.closest('.service-card')?.querySelector('h3')?.textContent||image.alt;
    if(!modal.open)modal.showModal();
    document.body.style.overflow='hidden';
  });
});

function closeModal(){
  modal?.close();
}
closeBtn?.addEventListener('click', closeModal);
modal?.addEventListener('click', e=>{ if(e.target===modal) closeModal(); });
modal?.addEventListener('close',()=>{document.body.style.overflow='';});

const emailToggle=document.getElementById('toggle-email');const emailPanel=document.getElementById('email-panel');
if(emailToggle&&emailPanel)emailToggle.addEventListener('click',()=>{const willOpen=emailPanel.hidden;emailPanel.hidden=!willOpen;emailToggle.setAttribute('aria-expanded',String(willOpen));if(willOpen)emailPanel.querySelector('input')?.focus();});

document.getElementById('github-list')?.setAttribute('aria-busy','true');
const contentCounters=[
  ['stat-services','#services .services-grid','.service-card'],
  ['stat-projects','#github-list','.github-card'],
  ['stat-ai','#ai-dots','.gallery-dot'],
  ['stat-tech','#technologies .tech-grid','.tech-card']
].map(([id,selector,itemSelector])=>({counter:document.getElementById(id),container:document.querySelector(selector),itemSelector}));
function updateContentStats(){
  for(const {counter,container,itemSelector} of contentCounters){
    if(!counter||!container)continue;
    const count=container.querySelectorAll(itemSelector).length;
    const value=!count&&container.getAttribute('aria-busy')==='true'?'—':String(count);
    if(counter.textContent!==value)counter.textContent=value;
  }
}
updateContentStats();
if('MutationObserver' in window){
  const counterObserver=new MutationObserver(updateContentStats);
  for(const {container} of contentCounters){
    if(container)counterObserver.observe(container,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
  }
}

const GITHUB_FALLBACK=[
 {name:'NumberBookSA',description:'بحث عن الارقام , واخراج الاسماء',language:'Python',stargazers_count:1,forks_count:0,html_url:'https://github.com/RiyadhAlotaibi/NumberBookSA'},
 {name:'Freeroam-MTA-SA-',description:'Freeroam MTA:SA guiweb',language:'Lua',stargazers_count:1,forks_count:0,html_url:'https://github.com/RiyadhAlotaibi/Freeroam-MTA-SA-'},
 {name:'FiveM-Online-PHP',description:'For Get Player Nickname in Server & Discord name',language:'PHP',stargazers_count:1,forks_count:0,html_url:'https://github.com/RiyadhAlotaibi/FiveM-Online-PHP'},
 {name:'Freeroam-FiveM-MTA-SA',description:'Freeroam TEAM-Root | New Design',language:'Lua',stargazers_count:1,forks_count:0,html_url:'https://github.com/RiyadhAlotaibi/Freeroam-FiveM-MTA-SA'}
];
function renderGithub(repos){
 const holder=document.getElementById('github-list');
 if(!holder)return;holder.replaceChildren();
 const items=(Array.isArray(repos)?repos:[]).filter(repo=>!repo.private&&!repo.archived);
 for(const repo of items){
   const card=document.createElement('article');card.className='github-card reveal visible';
   const top=document.createElement('div');top.className='github-card-top';top.innerHTML='<i class="fa-brands fa-github" aria-hidden="true"></i>';
   const heading=document.createElement('h3');heading.textContent=repo.name;top.append(heading);
   const description=document.createElement('p');description.textContent=repo.description||'—';
   const metadata=document.createElement('div');metadata.className='github-meta';
   const lang=document.createElement('span');lang.textContent='● '+(repo.language||'Code');
   const stars=document.createElement('span');stars.textContent='★ '+(repo.stargazers_count||0);
   const forks=document.createElement('span');forks.textContent='⑂ '+(repo.forks_count||0);
   metadata.append(lang,stars,forks);
   const link=document.createElement('a');link.href=repo.html_url;link.target='_blank';link.rel='noopener noreferrer';
   link.innerHTML='<i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i> ';
   const label=document.createElement('span');label.textContent=copy('githubRepo');link.append(label);
   card.append(top,description,metadata,link);holder.append(card);
 }
 if(!items.length){
   const empty=document.createElement('p');empty.textContent=copy('githubEmpty');holder.append(empty);
 }
 holder.setAttribute('aria-busy','false');
 updateContentStats();
}
async function loadGithub(){
 const holder=document.getElementById('github-list');
 if(!holder)return;
 holder.setAttribute('aria-busy','true');updateContentStats();
 try{
   const repos=[];
   for(let page=1;;page++){
     const signal=typeof AbortSignal!=='undefined'&&typeof AbortSignal.timeout==='function'?AbortSignal.timeout(15000):undefined;
     const response=await fetch('https://api.github.com/users/RiyadhAlotaibi/repos?per_page=100&sort=updated&page='+page,{headers:{'Accept':'application/vnd.github+json'},signal});
     if(!response.ok)throw Error('GitHub API '+response.status);
     const batch=await response.json();
     if(!Array.isArray(batch))throw Error('Invalid GitHub repository response');
     repos.push(...batch);
     if(batch.length<100)break;
   }
   renderGithub(repos.sort((a,b)=>new Date(b.updated_at)-new Date(a.updated_at)));
 }catch(e){renderGithub(GITHUB_FALLBACK);}
}
loadGithub();



(function(){
  const AI_VIDEO_FILES=[
    '1.mp4','2.mp4','3.mp4','4.mp4','5.mp4','6.mp4',
    '7.mp4','8.mp4','9.mp4','10.mp4','11.mp4','12.mp4'
  ];
  const videoBase=new URL('../Vid/',document.currentScript.src);
  const aiStage=document.getElementById('ai-media-stage');
  const aiPlayerHost=document.getElementById('ai-player-host');
  const aiPrev=document.getElementById('ai-prev'),aiNext=document.getElementById('ai-next'),aiIndexLabel=document.getElementById('ai-slide-index'),aiDots=document.getElementById('ai-dots'),aiVideoLink=document.getElementById('ai-video-link');
  const aiStatus=aiStage?.querySelector('[data-video-status]');
  let aiIndex=0,aiVideo=null;
  function setAiLoading(loading){
    aiStage?.classList.toggle('media-loading',loading);
    aiStage?.setAttribute('aria-busy',String(loading));
    if(loading&&aiStatus)aiStatus.textContent=copy('aiLoading');
  }
  function pauseAiVideo(){aiVideo?.pause();setAiLoading(false);}
  function releaseAiVideo(){
    const previous=aiVideo;aiVideo=null;
    if(!previous)return;
    previous.pause();previous.removeAttribute('src');previous.load();previous.remove();
  }
  function updateAiGallery(index){
    if(!AI_VIDEO_FILES.length||!aiStage||!aiPlayerHost)return;
    aiIndex=(index+AI_VIDEO_FILES.length)%AI_VIDEO_FILES.length;
    releaseAiVideo();setAiLoading(false);aiStage.classList.remove('media-error');
    const src=new URL(AI_VIDEO_FILES[aiIndex],videoBase).href;
    const video=document.createElement('video');
    video.id='ai-player';video.controls=true;video.playsInline=true;video.preload='none';
    video.setAttribute('aria-label',numbered('aiPlayerTitle',aiIndex+1));
    video.title=numbered('aiPlayerTitle',aiIndex+1);
    video.src=src;
    for(const type of ['loadstart','waiting','play'])video.addEventListener(type,()=>{
      if(aiVideo===video&&!video.paused)setAiLoading(true);
    });
    for(const type of ['canplay','playing','pause','ended'])video.addEventListener(type,()=>{
      if(aiVideo!==video)return;
      setAiLoading(false);
      if(type==='canplay'||type==='playing')aiStage.classList.remove('media-error');
    });
    video.addEventListener('error',()=>{
      if(aiVideo!==video)return;
      setAiLoading(false);aiStage.classList.add('media-error');
      if(aiStatus)aiStatus.textContent=copy('aiError');
    });
    aiVideo=video;aiPlayerHost.replaceChildren(video);
    if(aiVideoLink)aiVideoLink.href=src;
    if(aiIndexLabel)aiIndexLabel.textContent=String(aiIndex+1).padStart(2,'0')+' / '+String(AI_VIDEO_FILES.length).padStart(2,'0');
    if(aiDots)[...aiDots.children].forEach((d,i)=>{d.classList.toggle('active',i===aiIndex);d.setAttribute('aria-pressed',String(i===aiIndex));});
  }
  if(aiDots){aiDots.replaceChildren();AI_VIDEO_FILES.forEach((_,i)=>{const b=document.createElement('button');b.type='button';b.className='gallery-dot'+(i===0?' active':'');b.setAttribute('aria-label',numbered('aiWork',i+1));b.addEventListener('click',()=>updateAiGallery(i));aiDots.append(b);});}
  updateContentStats();
  aiPrev?.addEventListener('click',()=>updateAiGallery(aiIndex-1));aiNext?.addEventListener('click',()=>updateAiGallery(aiIndex+1));
  [aiPrev,aiNext].forEach(button=>{if(button)button.disabled=AI_VIDEO_FILES.length<2;});
  if(aiVideoLink)aiVideoLink.hidden=!AI_VIDEO_FILES.length;
  if(aiStage&&'IntersectionObserver'in window){
    const aiVisibilityObserver=new IntersectionObserver(entries=>{if(!entries[entries.length-1]?.isIntersecting)pauseAiVideo();},{threshold:0});
    aiVisibilityObserver.observe(aiStage);
  }
  document.addEventListener('visibilitychange',()=>{if(document.hidden)pauseAiVideo();});
  updateAiGallery(0);

  const form=document.getElementById('email-form'),status=document.getElementById('form-status');
  const nameInput=form?.querySelector('[name="name"]'),phoneInput=form?.querySelector('[name="phone"]'),emailInput=form?.querySelector('[name="email"]');
  function showFormStatus(type,key){if(!status)return;status.className='form-status show '+type;status.textContent=copy(key);}
  function validEmail(value){
    if(value.length>254||!value.includes('@'))return false;
    const parts=value.split('@');if(parts.length!==2)return false;
    const [local,domain]=parts;if(!local||!domain||local.startsWith('.')||local.endsWith('.')||local.includes('..'))return false;
    if(!/^[^\s@]+$/.test(local))return false;
    if(!/^[A-Za-z0-9.-]+$/.test(domain)||domain.startsWith('.')||domain.endsWith('.')||domain.includes('..'))return false;
    const labels=domain.split('.');if(labels.length<2||labels.some(x=>!x||x.startsWith('-')||x.endsWith('-')))return false;
    return /^[A-Za-z]{2,63}$/.test(labels[labels.length-1]);
  }
  function setFieldState(input,valid,message){if(!input)return true;input.classList.toggle('invalid',!valid);input.setAttribute('aria-invalid',String(!valid));input.setCustomValidity(valid?'':message);return valid;}
  function validateName(){return setFieldState(nameInput,!nameInput||nameInput.value.trim().length>=Math.max(1,nameInput.minLength),copy('invalidName'));}
  function validatePhone(){return setFieldState(phoneInput,!phoneInput||(!phoneInput.required&&!phoneInput.value.trim())||/^\+?[0-9]{7,15}$/.test(phoneInput.value.trim()),copy('invalidPhone'));}
  function validateEmail(){return setFieldState(emailInput,!emailInput||validEmail(emailInput.value.trim()),copy('invalidEmail'));}
  if(phoneInput){phoneInput.addEventListener('input',()=>{let v=phoneInput.value;const plus=v.startsWith('+');v=v.replace(/\D/g,'').slice(0,15);phoneInput.value=(plus?'+':'')+v;validatePhone();});}
  nameInput?.addEventListener('input',validateName);emailInput?.addEventListener('input',validateEmail);
  [nameInput,phoneInput,emailInput].forEach(el=>el?.addEventListener('blur',()=>{if(el===nameInput)validateName();else if(el===phoneInput)validatePhone();else validateEmail();}));

  if(form){form.addEventListener('submit',async function(e){
    e.preventDefault();
    const submit=form.querySelector('button[type="submit"]');
    const valid=[validateName(),validatePhone(),validateEmail(),form.checkValidity()].every(Boolean);
    if(!valid){form.reportValidity();return;}
    if(location.protocol==='file:'){showFormStatus('info','emailLocal');return;}
    showFormStatus('sending','emailSending');if(submit)submit.disabled=true;
    try{
      const fd=new FormData(form),subject=String(fd.get('subject')||'').trim();
      const payload={name:String(fd.get('name')||'').trim(),email:String(fd.get('email')||'').trim(),phone:String(fd.get('phone')||'').trim(),subject,message:String(fd.get('message')||'').trim(),_subject:copy('emailSubject')+(subject?' - '+subject:''),_template:'table',_captcha:'false',_url:location.href};
      const response=await fetch('https://formsubmit.co/ajax/RiadAlruqi@gmail.com',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(payload)});
      const data=await response.json();
      if(!response.ok||(data?.success!==true&&data?.success!=='true'))throw new Error(data?.message||('HTTP '+response.status));
      form.reset();[nameInput,phoneInput,emailInput].forEach(el=>{el?.classList.remove('invalid');el?.removeAttribute('aria-invalid');el?.setCustomValidity('');});showFormStatus('success','emailSuccess');
    }catch(err){console.error('Email form error:',err);showFormStatus('error','emailError');}finally{if(submit)submit.disabled=false;}
  });}
})();
