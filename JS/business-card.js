document.querySelectorAll('[data-business-card]').forEach(viewer=>{
  const stage=viewer.querySelector('.business-card-stage');
  const card=viewer.querySelector('.business-card');
  const range=viewer.querySelector('[data-card-angle]');
  const output=viewer.querySelector('[data-card-degrees]');
  const faces=[...viewer.querySelectorAll('[data-card-face]')];
  if(!stage||!card||!range)return;

  const initial={x:8,y:-18};
  let rotation={...initial},drag=null,frame=0;
  const normalize=angle=>((angle%360)+360)%360;
  function paint(){
    frame=0;
    card.style.setProperty('--card-x',rotation.x+'deg');
    card.style.setProperty('--card-y',rotation.y+'deg');
    const degrees=Math.round(normalize(rotation.y))%360;
    range.value=String(degrees);
    if(output)output.textContent=degrees+'°';
    const back=degrees>90&&degrees<270;
    faces.forEach(face=>face.setAttribute('aria-hidden',String((face.dataset.cardFace==='back')!==back)));
    viewer.querySelector('[data-card-view="front"]')?.setAttribute('aria-pressed',String(!back));
    viewer.querySelector('[data-card-view="back"]')?.setAttribute('aria-pressed',String(back));
  }
  function schedulePaint(){if(!frame)frame=requestAnimationFrame(paint);}
  function stopDrag(){
    if(!drag)return;
    const pointerId=drag.id;
    drag=null;stage.classList.remove('is-dragging');
    if(stage.hasPointerCapture(pointerId))stage.releasePointerCapture(pointerId);
  }
  stage.addEventListener('pointerdown',event=>{
    if(!event.isPrimary||event.button!==0)return;
    stage.focus({preventScroll:true});
    drag={id:event.pointerId,x:event.clientX,y:event.clientY,rotation:{...rotation},width:stage.clientWidth};
    stage.setPointerCapture(event.pointerId);stage.classList.add('is-dragging');
  });
  stage.addEventListener('pointermove',event=>{
    if(!drag||drag.id!==event.pointerId)return;
    rotation.y=drag.rotation.y+(event.clientX-drag.x)*360/Math.max(drag.width,1);
    rotation.x=Math.max(-60,Math.min(60,drag.rotation.x-(event.clientY-drag.y)*.4));
    schedulePaint();
  });
  ['pointerup','pointercancel','lostpointercapture'].forEach(type=>stage.addEventListener(type,stopDrag));
  stage.addEventListener('dragstart',event=>event.preventDefault());
  stage.addEventListener('keydown',event=>{
    const changes={ArrowLeft:[0,-15],ArrowRight:[0,15],ArrowUp:[10,0],ArrowDown:[-10,0]};
    if(changes[event.key]){
      event.preventDefault();stopDrag();
      rotation.x=Math.max(-60,Math.min(60,rotation.x+changes[event.key][0]));
      rotation.y+=changes[event.key][1];schedulePaint();
    }else if(event.key==='Home'){
      event.preventDefault();stopDrag();rotation={...initial};schedulePaint();
    }
  });
  range.addEventListener('input',()=>{
    stopDrag();rotation.y=Number(range.value);schedulePaint();
  });
  viewer.querySelectorAll('[data-card-view]').forEach(button=>button.addEventListener('click',()=>{
    stopDrag();
    if(button.dataset.cardView==='reset')rotation={...initial};
    else{
      const target=button.dataset.cardView==='back'?180:0;
      rotation={x:0,y:rotation.y+((target-normalize(rotation.y)+540)%360)-180};
    }
    paint();
  }));
  viewer.classList.add('card-interactive');paint();
});
