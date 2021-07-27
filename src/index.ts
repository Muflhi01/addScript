// @ts-nocheck

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
 * @param {function} - Callback    * REQUIRED
*/
var defaultOptions = {
    src: "",
    strategy: document.head ? "inject" : "eval",
    injectLocation: "head",
    async: false,
}

export async function addScript(scripts: typeof defaultOptions | Array<typeof defaultOptions>, callback: any): void {
    // make the single script an array
    if ('src' in scripts) scripts = [scripts]

    if (!callback) {
        throw new Error("addScripts requires a callback")
        return;
    }

    const jsLoaded = () => {
        callback(null, true)
    }

    // go through every script
    scripts.forEach((script) => {
        
        // checking values
        if (!script.strategy)
            // asigning default values if it does not exist
            // we can access variables outside from the function :( 
            script.strategy = document.head ? "inject" : "eval"

        if (!script.injectLocation)
            script.injectLocation = "head"

        if (!script.async)
            script.async = false

        // Make strategy lowercase
        var strategy = script.strategy.toLowerCase()

        if (strategy === "inject") {

            if (!(document.querySelector(script.injectLocation) || document.head)) callback(new ReferenceError("Unable to find element in document."), false)

            // Get the type of source
            let source = script.src;
            let injectLocation = script.injectLocation;

            const type = source.endsWith("css") ? "stylesheet" : "script"

            if (type === "script") {
                // Create script element
                const script_tag = document.createElement("script")

                // Set asyncronous status
                script_tag.async = script.async
                script_tag.src = source

                // When script loaded
                script_tag.addEventListener("load", () => jsLoaded())

                // If script fails to load
                script_tag.addEventListener("error", () => callback(new Error("Script failed to load.\n" + source), false))

                // If script load aborted
                script_tag.addEventListener("abort", () => callback(new Error("Script aborted.\n" + source), false))

                // Append script to head
                const el = document.querySelector(injectLocation) || document.head
                el.appendChild(script_tag)
            } else if (type === "stylesheet") {
                // Create script element
                const link = document.createElement("link")

                // Set link type
                link.rel = "stylesheet"

                // Set link source
                link.href = source

                // When link loaded
                link.addEventListener("load", () => jsLoaded())

                // If link fails to load
                link.addEventListener("error", () => callback(new Error("Link failed to load.\n" + source), false))

                // If link load aborted
                link.addEventListener("abort", () => callback(new Error("Link aborted.\n" + source), false))

                // Append link to head
                const el = document.querySelector(injectLocation) || document.head
                el.appendChild(link)
            } 
            else callback(new TypeError("Invalid resource type specified."), false)
        } else if (strategy === "eval") {
            // Fetch the content of the URL
            axios.get(script.src).then((res: any) => {
                try {
                    // Run the code
                    eval(res)
                    jsLoaded()
                } catch (_e) {
                    // If running code failed
                    callback(_e, false)
                }
            }).catch((e) => callback(e, false))
        } else if (strategy === "href") {
            if (!window.location.href) callback(new ReferenceError("Unable to find href object."), false)
            // Fetch the content of the URL
            axios.get(script.src).then((res: any) => {
                try {
                    // Run the code
                    window.location.href = "javascript:" + encodeURIComponent(res)
                    jsLoaded()
                } catch (_e) {
                    // If running code failed
                    callback(_e, false)
                }
            }).catch((e) => callback(e, false))
        } else {
            // If invalid strategy provided.
            callback(new ReferenceError(`Invalid strategy: ${script.strategy}. \nWith source: ${script.src}`), false)
        }
    })
}