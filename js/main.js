/* Cozy Express : scripts (menu, mode sombre, calculateur, WhatsApp).
   Pour changer le taux de change ou le numéro WhatsApp, modifiez TAUX et WA ci-dessous. */
(function(){
  var WA = '50938715188';          // WhatsApp : +509 38 71 5188
  var TAUX = 130;                  // 1 USD = 130 HTG (5 $ = 650 HTG) : à modifier ici si le taux change
  var PRIX_LB = 5;

  function waLink(msg){ return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(msg); }
  document.querySelectorAll('[data-wa]').forEach(function(a){ a.href = waLink(a.getAttribute('data-wa')); });
  var rateTxt = document.getElementById('rateTxt'); if(rateTxt){ rateTxt.textContent = TAUX; }

  var navLinks = document.getElementById('navLinks');
  var burger = document.getElementById('burger');

  burger.addEventListener('click', function(){
    var open = navLinks.classList.toggle('open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  /* Mode clair / sombre (choix mémorisé dans le navigateur) */
  document.getElementById('themeBtn').addEventListener('click', function(){
    var root = document.documentElement;
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try{ localStorage.setItem('cozy-theme', next); }catch(e){}
  });

  /* Animation du colis : respecte la préférence « réduire les animations » */
  var parcel = document.getElementById('parcel');
  if(parcel && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    var anim = document.getElementById('parcelAnim');
    if(anim){ anim.remove(); }
    parcel.setAttribute('transform','translate(330,165)');
  }

  /* Calculateur */
  if(document.getElementById('lbs')){
  var lbsEl = document.getElementById('lbs');
  var kindEl = document.getElementById('kind');
  var resBody = document.getElementById('resBody');
  var calcWa = document.getElementById('calcWa');
  calcWa.href = waLink('Bonjour Cozy Express, je voudrais confirmer le prix de mon colis.');

  function fmt(n){ return n.toLocaleString('fr-FR'); }

  function calculer(){
    var lbs = parseFloat(String(lbsEl.value).replace(',','.'));
    if(!lbs || lbs <= 0){
      resBody.innerHTML = '<div class="notice">Entrez un poids pour voir le prix.</div>';
      return;
    }
    if(kindEl.value === 'fragile'){
      resBody.innerHTML = '<div class="notice">Les laptops, téléphones et objets fragiles ne sont pas comptés au poids : le prix dépend de la valeur du produit. Envoyez-nous un message pour l\'obtenir.</div>';
      calcWa.href = waLink('Bonjour Cozy Express, je voudrais le prix pour un objet fragile (laptop, téléphone) d\'environ ' + lbs + ' lbs.');
      return;
    }
    if(lbs > 70){
      resBody.innerHTML = '<div class="notice">Au-delà de 70 lbs, le prix est établi sur mesure. Écrivez-nous pour recevoir un devis.</div>';
      calcWa.href = waLink('Bonjour Cozy Express, je voudrais un devis pour un colis de ' + lbs + ' lbs.');
      return;
    }
    var livres = Math.ceil(lbs);                 // chaque livre entamée compte ; 0,1 à 1 lb = 5 $
    var base = livres * PRIX_LB;
    var taxe = lbs > 30 ? 30 : (lbs > 20 ? 15 : 0);
    var total = base + taxe;
    resBody.innerHTML =
      '<div class="line-r"><span>' + livres + ' lb × ' + PRIX_LB + ' $</span><strong>' + fmt(base) + ' $</strong></div>' +
      '<div class="line-r"><span>Taxe</span><strong>' + (taxe ? fmt(taxe) + ' $' : 'aucune') + '</strong></div>' +
      '<div class="total" style="margin-top:8px">' + fmt(total) + ' $<small>soit ' + fmt(total * TAUX) + ' HTG</small></div>';
    calcWa.href = waLink('Bonjour Cozy Express, je voudrais confirmer le prix de mon colis de ' + lbs + ' lbs (estimation : ' + total + ' $, soit ' + (total*TAUX) + ' HTG).');
  }
  lbsEl.addEventListener('input', calculer);
  kindEl.addEventListener('change', calculer);

  }

  /* Copier l'adresse de Miami */
  if(document.getElementById('copyAddr')){
  document.getElementById('copyAddr').addEventListener('click', function(){
    var txt = 'Nom : [votre nom complet]\nAdresse 1 : 8020 NW 66th Street\nAdresse 2 : BP-161417\nVille : Miami\nÉtat : Florida\nCode postal : 33166\nTéléphone : (786) 360-6446';
    var msg = document.getElementById('copyMsg');
    function ok(){ msg.textContent = 'Adresse copiée. Remplacez « votre nom complet » par votre nom.'; }
    function ko(){ msg.textContent = 'Copie impossible ici : sélectionnez l\'adresse et copiez-la manuellement.'; }
    try{
      if(navigator.clipboard && navigator.clipboard.writeText){ navigator.clipboard.writeText(txt).then(ok, ko); } else { ko(); }
    }catch(e){ ko(); }
  });

  }

  /* Formulaire de contact → WhatsApp */
  if(document.getElementById('cSend')){
  var cName = document.getElementById('cName'), cPhone = document.getElementById('cPhone'),
      cSubject = document.getElementById('cSubject'), cMsg = document.getElementById('cMsg'),
      cSend = document.getElementById('cSend'), cErr = document.getElementById('cErr');
  function majContact(){
    var m = 'Bonjour Cozy Express, je suis ' + (cName.value.trim() || '…') +
            (cPhone.value.trim() ? ' (tél. ' + cPhone.value.trim() + ')' : '') +
            '. Sujet : ' + cSubject.value + '.' + (cMsg.value.trim() ? ' ' + cMsg.value.trim() : '');
    cSend.href = waLink(m);
  }
  [cName,cPhone,cSubject,cMsg].forEach(function(el){ el.addEventListener('input', majContact); el.addEventListener('change', majContact); });
  majContact();
  cSend.addEventListener('click', function(e){
    if(!cName.value.trim()){ e.preventDefault(); cErr.style.display = 'block'; cName.focus(); }
    else { cErr.style.display = 'none'; }
  });
}
})();
