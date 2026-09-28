(() => {
const stamp=document.getElementById('archive-stamp'), sun=document.getElementById('archive-sun'), stain=document.getElementById('honey-stain');
let active=null, point, offset, frame, start=null, melted=false, armed=false, spacer;
function cool(){start=null;stamp.classList.remove('heating');sun.classList.remove('warm');}
function reset(){cancelAnimationFrame(frame);active=null;armed=false;cool();['position','left','top','zIndex','margin'].forEach(k=>stamp.style[k]='');if(spacer){spacer.remove();spacer=null;}}
function melt(){melted=true;reset();stamp.hidden=true;stain.hidden=false;try{sessionStorage.setItem('honey-stamp-melted','yes');}catch(_){}stain.scrollIntoView({block:'nearest'});}
function warm(now){if(start===null){start=now;stamp.classList.add('heating');sun.classList.add('warm');}if(now-start>=1400)melt();}
function tick(now){
 if(melted||(active===null&&!armed))return;
 if(active!==null){
  if(point.y<70)window.scrollBy(0,-9);else if(point.y>window.innerHeight-55)window.scrollBy(0,9);
  stamp.style.left=(point.x-offset.x)+'px';stamp.style.top=(point.y-offset.y)+'px';
  const a=stamp.getBoundingClientRect(),b=sun.getBoundingClientRect();
  if(a.right>b.left-10&&a.left<b.right+10&&a.bottom>b.top-10&&a.top<b.bottom+10)warm(now);else cool();
 }else warm(now);
 if(!melted)frame=requestAnimationFrame(tick);
}
stamp.addEventListener('pointerdown',e=>{
 if(melted||active!==null||(e.pointerType==='mouse'&&e.button!==0))return;
 e.preventDefault();const box=stamp.getBoundingClientRect();point={x:e.clientX,y:e.clientY};offset={x:e.clientX-box.left,y:e.clientY-box.top};active=e.pointerId;
 spacer=document.createElement('span');spacer.style.cssText='display:inline-block;width:'+box.width+'px;height:'+box.height+'px';stamp.before(spacer);
 Object.assign(stamp.style,{position:'fixed',margin:'0',left:box.left+'px',top:box.top+'px',zIndex:'102'});
 stamp.setPointerCapture(e.pointerId);frame=requestAnimationFrame(tick);
});
stamp.addEventListener('pointermove',e=>{if(e.pointerId===active){e.preventDefault();point={x:e.clientX,y:e.clientY};}});
['pointerup','pointercancel','lostpointercapture'].forEach(k=>stamp.addEventListener(k,()=>{if(!melted)reset();}));
stamp.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();armed=true;sun.focus();}});
sun.addEventListener('keydown',e=>{if(armed&&!e.repeat&&(e.key==='Enter'||e.key===' ')){e.preventDefault();frame=requestAnimationFrame(tick);}});
sun.addEventListener('keyup',()=>{cancelAnimationFrame(frame);cool();});sun.addEventListener('blur',reset);
window.addEventListener('pagehide',reset);
try{if(sessionStorage.getItem('honey-stamp-melted')==='yes'){melted=true;stamp.hidden=true;stain.hidden=false;}}catch(_){}
})();
