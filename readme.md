# clipboard.js

This is a fork of the [original clipboard.js](https://github.com/zenorocha/clipboard.js), written by [Zeno Rocha](https://github.com/zenorocha). This fork currently has two modifications:

1. The main `clipboard.js` file and class has been refactored and abstracted to separate the code for handling clipboard operations from the code creating event listeners. The modified classes are in `clipboard-handlers.js`
2. A modified version of the `clipboard-action.js` file has been created, implementing copy operations using the **Clipboard API**. This file is located in a different branch of this fork

The reason for these modifications are a) to better integrate with JavaScript frameworks that provide their own event handlers, and b) to support the use of a cleaner and more modern clipboard interface. *Theoretically*, the built file should be a drop-in replacement for the original `clipboard.js`, but it might not be, so test before you commit. [There are more details about these modifications at the bottom of this file.](#modifications)

***

![Killing Flash](https://img.shields.io/badge/killing-flash-brightgreen.svg?style=flat)

> Modern copy to clipboard. No Flash. Just 3kb gzipped.

<a href="https://clipboardjs.com/"><img width="728" src="https://cloud.githubusercontent.com/assets/398893/16165747/a0f6fc46-349a-11e6-8c9b-c5fd58d9099c.png" alt="Demo"></a>

## Why

Copying text to the clipboard shouldn't be hard. It shouldn't require dozens of steps to configure or hundreds of KBs to load. But most of all, it shouldn't depend on Flash or any bloated framework.

That's why clipboard.js exists.

## Install

You can get it on npm.

```
npm install clipboard --save
```

Or if you're not into package management, just [download a ZIP](https://github.com/zenorocha/clipboard.js/archive/master.zip) file.

## Setup

First, include the script located on the `dist` folder or load it from [a third-party CDN provider](https://github.com/zenorocha/clipboard.js/wiki/CDN-Providers).

```html
<script src="dist/clipboard.min.js"></script>
```

Now, you need to instantiate it by [passing a DOM selector](https://github.com/zenorocha/clipboard.js/blob/master/demo/constructor-selector.html#L18), [HTML element](https://github.com/zenorocha/clipboard.js/blob/master/demo/constructor-node.html#L16-L17), or [list of HTML elements](https://github.com/zenorocha/clipboard.js/blob/master/demo/constructor-nodelist.html#L18-L19).

```js
new ClipboardJS('.btn');
```

Internally, we need to fetch all elements that matches with your selector and attach event listeners for each one. But guess what? If you have hundreds of matches, this operation can consume a lot of memory.

For this reason we use [event delegation](https://stackoverflow.com/questions/1687296/what-is-dom-event-delegation) which replaces multiple event listeners with just a single listener. After all, [#perfmatters](https://twitter.com/hashtag/perfmatters).

# Usage

We're living a _declarative renaissance_, that's why we decided to take advantage of [HTML5 data attributes](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Using_data_attributes) for better usability.

### Copy text from another element

A pretty common use case is to copy content from another element. You can do that by adding a `data-clipboard-target` attribute in your trigger element.

The value you include on this attribute needs to match another's element selector.

<a href="https://clipboardjs.com/#example-target"><img width="473" alt="example-2" src="https://cloud.githubusercontent.com/assets/398893/9983467/a4946aaa-5fb1-11e5-9780-f09fcd7ca6c8.png"></a>

```html
<!-- Target -->
<input id="foo" value="https://github.com/zenorocha/clipboard.js.git">

<!-- Trigger -->
<button class="btn" data-clipboard-target="#foo">
    <img src="assets/clippy.svg" alt="Copy to clipboard">
</button>
```

### Cut text from another element

Additionally, you can define a `data-clipboard-action` attribute to specify if you want to either `copy` or `cut` content.

If you omit this attribute, `copy` will be used by default.

<a href="https://clipboardjs.com/#example-action"><img width="473" alt="example-3" src="https://cloud.githubusercontent.com/assets/398893/10000358/7df57b9c-6050-11e5-9cd1-fbc51d2fd0a7.png"></a>

```html
<!-- Target -->
<textarea id="bar">Mussum ipsum cacilds...</textarea>

<!-- Trigger -->
<button class="btn" data-clipboard-action="cut" data-clipboard-target="#bar">
    Cut to clipboard
</button>
```

As you may expect, the `cut` action only works on `<input>` or `<textarea>` elements.

### Copy text from attribute

Truth is, you don't even need another element to copy its content from. You can just include a `data-clipboard-text` attribute in your trigger element.

<a href="https://clipboardjs.com/#example-text"><img width="147" alt="example-1" src="https://cloud.githubusercontent.com/assets/398893/10000347/6e16cf8c-6050-11e5-9883-1c5681f9ec45.png"></a>

```html
<!-- Trigger -->
<button class="btn" data-clipboard-text="Just because you can doesn't mean you should — clipboard.js">
    Copy to clipboard
</button>
```

## Events

There are cases where you'd like to show some user feedback or capture what has been selected after a copy/cut operation.

That's why we fire custom events such as `success` and `error` for you to listen and implement your custom logic.

```js
var clipboard = new ClipboardJS('.btn');

clipboard.on('success', function(e) {
    console.info('Action:', e.action);
    console.info('Text:', e.text);
    console.info('Trigger:', e.trigger);

    e.clearSelection();
});

clipboard.on('error', function(e) {
    console.error('Action:', e.action);
    console.error('Trigger:', e.trigger);
});
```

For a live demonstration, go to this [site](https://clipboardjs.com/) and open your console.

## Tooltips

Each application has different design needs, that's why clipboard.js does not include any CSS or built-in tooltip solution.

The tooltips you see on the [demo site](https://clipboardjs.com/) were built using [GitHub's Primer](https://primer.style/css/components/tooltips). You may want to check that out if you're looking for a similar look and feel.

## Advanced Options

If you don't want to modify your HTML, there's a pretty handy imperative API for you to use. All you need to do is declare a function, do your thing, and return a value.

For instance, if you want to dynamically set a `target`, you'll need to return a Node.

```js
new ClipboardJS('.btn', {
    target: function(trigger) {
        return trigger.nextElementSibling;
    }
});
```

If you want to dynamically set a `text`, you'll return a String.

```js
new ClipboardJS('.btn', {
    text: function(trigger) {
        return trigger.getAttribute('aria-label');
    }
});
```

For use in Bootstrap Modals or with any other library that changes the focus you'll want to set the focused element as the `container` value.

```js
new ClipboardJS('.btn', {
    container: document.getElementById('modal')
});
```

Also, if you are working with single page apps, you may want to manage the lifecycle of the DOM more precisely. Here's how you clean up the events and objects that we create.

```js
var clipboard = new ClipboardJS('.btn');
clipboard.destroy();
```

## Browser Support

This library relies on both [Selection](https://developer.mozilla.org/en-US/docs/Web/API/Selection) and [execCommand](https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand) APIs. The first one is [supported by all browsers](https://caniuse.com/#search=selection) while the second one is supported in the following browsers.

| <img src="https://clipboardjs.com/assets/images/chrome.png" width="48px" height="48px" alt="Chrome logo"> | <img src="https://clipboardjs.com/assets/images/edge.png" width="48px" height="48px" alt="Edge logo"> | <img src="https://clipboardjs.com/assets/images/firefox.png" width="48px" height="48px" alt="Firefox logo"> | <img src="https://clipboardjs.com/assets/images/ie.png" width="48px" height="48px" alt="Internet Explorer logo"> | <img src="https://clipboardjs.com/assets/images/opera.png" width="48px" height="48px" alt="Opera logo"> | <img src="https://clipboardjs.com/assets/images/safari.png" width="48px" height="48px" alt="Safari logo"> |
|:---:|:---:|:---:|:---:|:---:|:---:|
| 42+ ✔ | 12+ ✔ | 41+ ✔ | 9+ ✔ | 29+ ✔ | 10+ ✔ |

The good news is that clipboard.js gracefully degrades if you need to support older browsers. All you have to do is show a tooltip saying `Copied!` when `success` event is called and `Press Ctrl+C to copy` when `error` event is called because the text is already selected.

You can also check if clipboard.js is supported or not by running `ClipboardJS.isSupported()`, that way you can hide copy/cut buttons from the UI.

## Modifications

As explained at the top, this fork modifies the ordinary `clipboard.js` in two ways:

1. The [main clipboard.js file](#refactored-clipboard.js) and class has been refactored and abstracted to separate the code for handling clipboard operations from the code creating event listeners. The modified classes are in `clipboard-handlers.js`
2. A [modified version of the `clipboard-action.js` file](#modified-clipboard-action.js) has been created, implementing copy operations using the **Clipboard API**. This file is located in a different branch of this fork

The modifications to the `clipboard.js` file are explained below:

### Refactored clipboard.js

The original version of clipboard.js exports a single class named `Clipboard`. When a new instance of this class is created (with `new Clipboard(selector)`), the constructor will set up a listener for click events on the selected elements which will then create an instance of the `ClipboardActions` class to add the appropriate text to the clipboard.

In the modified `clipboard-handlers.js` file, the single class has been broken up into two. The first class, currently named `Clip`, takes one optional parameter `options`, which the same object original version, and returns an instantiated object, which contains the necessary functions to trigger a copy or cut operation. If you attach the `onClick` function to an event handler, it will operate exactly the same as the original. Keep in mind that browsers only permit clipboard access to be initiated by the user, so the triggering event cannot be synthetic, and instead must be a native event like `onclick`.

The second class is named `ClipboardListener`, and extends the `Clip` class. The class constructor requires a mandatory parameter `trigger`, in addition to the optional parameter `options`. The class contains functions to add and remove the appropriate event listeners. This class *should* work identically to the original `Clipboard` class exported by `clipboard.js`.

For compatibility with the original `clipboard.js`, there is also a `clipboard.js` file that imports the `ClipboardListener` class as `Clipboard` and exports that class as the default. This file is used as the root for builds of this project, and *should* allow for the resulting bundle to be used as a drop-in replacement for the original `clipboard.js`

### Roadmap

- [ ] Further modify `clipboard-actions.js` to use the Clipboard API without the Selection API
- [ ] Look at providing further access to the internals of the `Clipboard` classes

If anybody has ideas for further functionality, don't hesitate to create an issue.

## License

[MIT License](https://zenorocha.mit-license.org/) © Zeno Rocha
