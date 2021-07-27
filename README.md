# addScript (1.0.1)

you can add any script or stylesheet to your website!

## Instalation

```sh
$ # Add axios also!
$ npm i @wonoly/addScript axios
```

or

```html
<!-- before the addScript tag! -->
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
```

The package should be loaded in the client side. you can add it by **CDN**

```html
<script src=""></script>
```

or requiring it.

```js
const { addScript } = require("@wonoly/addScript")
```

## Usage

```js
/**
 * Inject scripts into any website.
 * Script options information:
 *   `strategy`: The strategy to use to run the JavaScript. Can be `inject`, `eval` or `href`. Default is automatically detected.
 *   `injectLocation`: The `document.querySelector` argument for where to inject the resources. Default is `head`.
 *   `async`: Load the script asyncronausly
 *   `src`: Source of the script    * REQUIRED
 * 
 * @method
 * @param {typeof defaultOptions |  Array<typeof defaultOptions>} scripts - Options for a script
 * @param {Function} - Callback    * REQUIRED
*/

// Single script tag loading
addScript({
    src: "https://code.jquery.com/jquery-3.5.0.js"
}, (err, res) => {
    if (err)
        console.log(err)

    console.log(res)
})

// you can add multiple loads
addScript([{
    src: "https://code.jquery.com/jquery-3.5.0.js"
}, {
    src: "https://code.jquery.com/jquery-3.2.0.js",
    async: true
}, {
    src: "https://code.jquery.com/jquery-3.3.0.js",
    async: true,
    injectLocation: '#main div.test',
}, {
    src: "https://code.jquery.com/jquery-3.4.0.js",
    strategy: 'eval',
}, {
    // link tag
    // css autodetected
    src: "https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.0.2/css/bootstrap-grid.min.css",
}], (err, res) => {
    if (err)
        console.log(err)

    console.log(res)
})
```

### Screenshot

