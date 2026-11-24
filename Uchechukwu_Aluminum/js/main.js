(function(){
'use strict';
/* ====== EDIT HERE: contact details ====== */
var CONFIG={phoneIntl:'2348108016023',phoneDisplay:'0810 801 6023'};
/* ======================================== */

var F='fill="var(--glass)" stroke="var(--frame)" stroke-width="4"';
var BASE='<rect x="12" y="20" width="176" height="110" fill="var(--frame)"/>';
var DASH='fill="none" stroke="var(--accent)" stroke-width="2" stroke-dasharray="5 4"';
var D={
ebm:BASE+'<rect x="20" y="28" width="160" height="94" fill="var(--glass)"/><path d="M73 28v94M127 28v94M20 75h160" stroke="var(--frame)" stroke-width="5"/>',
pvc:'<rect x="12" y="20" width="176" height="110" rx="3" fill="#f2f4f5" stroke="#9aa3a8" stroke-width="2"/><rect x="26" y="34" width="70" height="82" fill="var(--glass)" stroke="#d6dbde" stroke-width="7"/><rect x="104" y="34" width="70" height="82" fill="var(--glass)" stroke="#d6dbde" stroke-width="7"/><path d="M100 60v30" stroke="var(--accent)" stroke-width="4"/>',
fixed:BASE+'<rect x="20" y="28" width="160" height="94" fill="var(--glass2)"/><path d="M50 122L110 28M80 122L130 44" stroke="#fff" stroke-opacity=".45" stroke-width="6"/>',
awning:BASE+'<rect x="20" y="28" width="160" height="94" '+F+'/><path d="M20 122L100 28L180 122" '+DASH+'/>',
tilt:BASE+'<rect x="20" y="28" width="160" height="94" '+F+'/><path d="M20 28L180 75L20 122" '+DASH+'/><path d="M100 28L180 122" fill="none" stroke="var(--accent)" stroke-width="2"/>',
door:'<rect x="52" y="10" width="96" height="130" fill="var(--frame)"/><rect x="60" y="18" width="40" height="114" fill="var(--glass2)"/><rect x="100" y="18" width="40" height="114" fill="var(--glass)"/><rect x="96" y="70" width="5" height="26" fill="var(--accent)"/>'
};

/* Add or change products here. img = file in /images (leave out to show a drawing). */
var ITEMS=[
{id:'sliding',cat:'windows',name:'Sliding windows',text:'Panes glide on a track. Good where space is tight.',img:'images/sliding.jpg'},
{id:'casement',cat:'windows',name:'Casement windows',text:'Side-hinged panes that open fully for air.',img:'images/casement.jpg'},
{id:'ebm',cat:'windows',name:'EBM windows',text:'Framed window with divided panes.'},
{id:'pvc',cat:'windows',name:'PVC windows',text:'White uPVC frames in single or double panes.'},
{id:'partition',cat:'partitions',name:'Office partitions',text:'Glass and aluminum panels with a door, to divide open floors.',img:'images/partition.jpg'},
{id:'frosted',cat:'partitions',name:'Frosted glass partitions',text:'Frosted lower glass for privacy, clear glass above for light.',img:'images/frosted.jpg'},
{id:'demarcation',cat:'partitions',name:'Demarcation',text:'Aluminum-framed dividers for workstations, shops and counters.',img:'images/demarcation.jpg'},
{id:'louvre',cat:'windows',name:'Louvre windows',text:'Adjustable slats for ventilation and privacy.',img:'images/louvre.jpg'},
{id:'fixed',cat:'windows',name:'Fixed windows',text:'Non-opening glass for light and views.'},
{id:'awning',cat:'windows',name:'Awning windows',text:'Top-hinged so they stay open in light rain.'},
{id:'tilt',cat:'windows',name:'Tilt-and-turn windows',text:'Tilts in for air or swings open fully.'},
{id:'screen',cat:'doors',name:'Insect screens',text:'Mesh screens fitted into sliding windows to keep insects out.',img:'images/screen.jpg'},
{id:'door',cat:'doors',name:'Aluminum doors',text:'Sliding and hinged doors for patios and entrances.'}
];

var $=function(s,c){return (c||document).querySelector(s)};
var $$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
var esc=function(s){return String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;')};

/* contact links */
$$('[data-tel]').forEach(function(a){a.href='tel:+'+CONFIG.phoneIntl});
$$('[data-wa]').forEach(function(a){a.href='https://wa.me/'+CONFIG.phoneIntl});

/* gallery */
var g=$('#gallery');
g.innerHTML=ITEMS.map(function(i){
  var media=i.img
    ?'<button class="media" data-src="'+esc(i.img)+'" data-cap="'+esc(i.name)+'" aria-label="View '+esc(i.name)+' photo larger"><img src="'+esc(i.img)+'" alt="'+esc(i.name)+'" loading="lazy"></button>'
    :'<div class="media"><svg viewBox="0 0 200 150" role="img" aria-label="'+esc(i.name)+' drawing" preserveAspectRatio="xMidYMid slice"><rect width="200" height="150" fill="var(--bg)"/>'+D[i.id]+'</svg></div>';
  return '<figure class="reveal" data-cat="'+i.cat+'">'+media+'<figcaption><h3>'+esc(i.name)+'</h3><p>'+esc(i.text)+'</p></figcaption></figure>';
}).join('');

/* marquee */
var names=ITEMS.map(function(i){return '<span>'+esc(i.name)+'</span>'}).join('');
$('#track').innerHTML=names+names;

/* quote form product list */
$('select[name=product]').insertAdjacentHTML('beforeend',ITEMS.map(function(i){return '<option>'+esc(i.name)+'</option>'}).join('')+'<option>Something else</option>');

/* scroll reveal */
var rev=$$('.reveal');
if('IntersectionObserver' in window){
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12});
  rev.forEach(function(el,n){el.style.transitionDelay=(el.closest('.grid,.steps')?(n%4)*80:0)+'ms';io.observe(el)});
}else{rev.forEach(function(el){el.classList.add('in')})}

/* filters */
$('#filters').addEventListener('click',function(e){
  var b=e.target.closest('.chip');if(!b)return;
  $$('.chip').forEach(function(c){c.setAttribute('aria-pressed',c===b)});
  var f=b.dataset.f;
  $$('figure',g).forEach(function(fig){
    var show=f==='all'||fig.dataset.cat===f;
    fig.classList.toggle('hide',!show);
    if(show){fig.classList.remove('in');void fig.offsetWidth;fig.style.transitionDelay='0ms';requestAnimationFrame(function(){fig.classList.add('in')})}
  });
});

/* lightbox */
var lb=$('#lb');
g.addEventListener('click',function(e){
  var b=e.target.closest('button.media');if(!b)return;
  $('#lbImg').src=b.dataset.src;$('#lbImg').alt=b.dataset.cap;$('#lbCap').textContent=b.dataset.cap;
  if(lb.showModal)lb.showModal();
});
$('#lbClose').addEventListener('click',function(){lb.close()});
lb.addEventListener('click',function(e){if(e.target===lb)lb.close()});

/* mobile menu */
var nav=$('#nav'),mb=$('#menuBtn');
mb.addEventListener('click',function(){var o=nav.classList.toggle('open');mb.setAttribute('aria-expanded',o)});
nav.addEventListener('click',function(e){if(e.target.tagName==='A'){nav.classList.remove('open');mb.setAttribute('aria-expanded','false')}});

/* header shadow, progress bar, active link */
var hdr=$('.site-header'),bar=$('#progress');
var secs=$$('main section[id]');
function onScroll(){
  var y=window.scrollY,h=document.documentElement.scrollHeight-window.innerHeight;
  bar.style.transform='scaleX('+(h>0?y/h:0)+')';
  hdr.classList.toggle('stuck',y>10);
  var cur='';secs.forEach(function(s){if(s.getBoundingClientRect().top<120)cur=s.id});
  $$('nav a').forEach(function(a){a.classList.toggle('on',a.getAttribute('href')==='#'+cur)});
}
window.addEventListener('scroll',onScroll,{passive:true});onScroll();

/* quote form -> WhatsApp */
$('#quoteForm').addEventListener('submit',function(e){
  e.preventDefault();
  var f=e.target,n=f.elements.name.value.trim(),p=f.elements.product.value,err=$('#formErr');
  if(!n||!p){err.hidden=false;return}
  err.hidden=true;
  var m='Hello Uchechukwu Aluminum, my name is '+n+'. I need: '+p+'.';
  if(f.elements.size.value.trim())m+=' Approximate size: '+f.elements.size.value.trim()+'.';
  if(f.elements.loc.value.trim())m+=' Location: '+f.elements.loc.value.trim()+'.';
  window.open('https://wa.me/'+CONFIG.phoneIntl+'?text='+encodeURIComponent(m),'_blank','noopener');
});

$('#yr').textContent=new Date().getFullYear();
})();
