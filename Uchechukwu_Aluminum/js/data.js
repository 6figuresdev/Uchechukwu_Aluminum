/* ==========================================================================
   Uchechukwu Aluminum – site data
   Edit this file to change contact details, products or photos.
   ========================================================================== */
(function () {
  'use strict';
  var UA = (window.UA = window.UA || {});

  UA.config = {
    name: 'Uchechukwu Aluminum',
    phoneIntl: '2348108016023',   // used for tel: and WhatsApp links
    phoneDisplay: '0810 801 6023'
  };

  UA.categories = [
    { id: 'all', label: 'All' },
    { id: 'windows', label: 'Windows' },
    { id: 'partitions', label: 'Partitions and demarcation' },
    { id: 'doors', label: 'Doors and nets' }
  ];

  /* photos: files in /images. The first photo is the cover.
     pos: optional CSS object-position for the cover crop. */
  UA.products = [
    { id: 'sliding', cat: 'windows', name: 'Sliding windows', text: 'Panes glide on a track. Good where space is tight.', photos: ['images/sliding.jpg'] },
    { id: 'casement', cat: 'windows', name: 'Casement windows', text: 'Side-hinged panes that open fully for air.', photos: ['images/casement.jpg'] },
    { id: 'ebm', cat: 'windows', name: 'EBM windows', text: 'Framed windows with divided panes, in several colors and styles.', photos: ['images/ebm1.jpg', 'images/ebm2.jpg', 'images/ebm3.jpg', 'images/ebm4.jpg', 'images/ebm5.jpg'] },
    { id: 'pvc', cat: 'windows', name: 'PVC windows', text: 'White uPVC frames in single or double panes.', photos: ['images/pvc1.jpg', 'images/pvc2.jpg', 'images/pvc3.jpg'] },
    { id: 'louvre', cat: 'windows', name: 'Louvre windows', text: 'Adjustable slats for ventilation and privacy.', photos: ['images/louvre.jpg'] },
    { id: 'fixed', cat: 'windows', name: 'Fixed windows', text: 'Glass in aluminum frames, made in the design you choose.', photos: ['images/fixed1.jpg', 'images/fixed2.jpg', 'images/fixed3.jpg', 'images/fixed4.jpg'] },
    { id: 'awning', cat: 'windows', name: 'Awning windows', text: 'Top-hinged so they stay open in light rain.', photos: ['images/awn1.jpg', 'images/awn2.jpg', 'images/awn3.jpg', 'images/awn4.jpg'] },
    { id: 'tilt', cat: 'windows', name: 'Tilt-and-turn windows', text: 'Tilts in for air or swings open fully.', photos: ['images/tilt.jpg'] },
    { id: 'partition', cat: 'partitions', name: 'Office partitions', text: 'Glass and aluminum panels with a door, to divide open floors.', photos: ['images/partition.jpg'] },
    { id: 'frosted', cat: 'partitions', name: 'Frosted glass partitions', text: 'Frosted lower glass for privacy, clear glass above for light.', photos: ['images/frosted.jpg'] },
    { id: 'demarcation', cat: 'partitions', name: 'Demarcation', text: 'Aluminum-framed dividers for workstations, shops and counters.', photos: ['images/demarcation.jpg'] },
    { id: 'door', cat: 'doors', name: 'Aluminum doors', text: 'Glass doors with side and top panels for shops, offices and entrances.', photos: ['images/door.jpg'], pos: '50% 40%' },
    { id: 'toilet', cat: 'doors', name: 'Toilet doors', text: 'Aluminum frame with a composite panel below and glass above.', photos: ['images/toilet-door.jpg'], pos: '50% 35%' },
    { id: 'net', cat: 'doors', name: 'Mosquito nets', text: 'Fixed, sliding and pleated nets for windows and doors.', photos: ['images/net1.jpg', 'images/net2.jpg', 'images/net3.jpg', 'images/net4.jpg', 'images/net5.jpg', 'images/screen.jpg'] }
  ];

  /* Products shown in the hero slider, in order. */
  UA.hero = ['partition', 'sliding', 'door', 'casement', 'frosted'];
})();
