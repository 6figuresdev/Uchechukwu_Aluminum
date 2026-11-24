# Uchechukwu Aluminum

Website for Uchechukwu Aluminum: aluminum and PVC windows, glass doors, office partitions, demarcation and mosquito nets.

Plain HTML, CSS and JavaScript. No build step and no dependencies.

## Structure

```
index.html        page markup
css/style.css     all styles, in numbered sections
js/data.js        phone number, categories, products and photos  <- edit this most
js/slider.js      swipeable slider (touch, mouse, keyboard, autoplay)
js/lightbox.js    full-screen photo viewer with swipe
js/main.js        page behaviour (hero, product rail, form, scroll effects)
images/           photos
```

## Run it
Open `index.html` in a browser, or run `npx serve` in this folder.

## Update things
- **Phone and WhatsApp:** `config` in `js/data.js`.
- **Add a product or photo:** put the image in `images/`, then add it to `UA.products` in `js/data.js`. The first photo in `photos` is the cover.
- **Hero slider:** `UA.hero` in `js/data.js` lists the product ids shown.
- **Colors and fonts:** the variables at the top of `css/style.css`.
- **Address and opening hours:** add them to the Contact section in `index.html`.

## Deploy
Static site. Import the repo on Vercel or Netlify with no build command, or turn on GitHub Pages for the `main` branch.
