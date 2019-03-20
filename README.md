# @cfware/history-state

[![Travis CI][travis-image]][travis-url]
[![Greenkeeper badge][gk-image]](https://greenkeeper.io/)
[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![MIT][license-image]](LICENSE)

Browser History API state manager.

### Install @cfware/history-state

Testing this module requires node.js 8 or above.  This module makes no attempt to
directly support legacy browsers, it is tested with the current version of Firefox
and Chrome.

```sh
npm i --save @cfware/history-state
```

## Usage

```js
import historyState from '@cfware/history-state';

historyState.addEventListener('update', () => {
  /* An internal navigation has occurred with history API. */
});

historyState.addEventListener('refuse', () => {
  /* An internal navigation has been refused due to dirty state. */
  if (window.confirm('Do you really want to leave this page without saving?')) {
    /* honor the back/forward/link click requested by the user. */
    historyState.bypassDirty();
  }
});
```

### historyState.dirty

This can be set true or false to indicate if the current page has unsaved changes.

Default `false`

### historyState.data

This can be any serializable data.  This must be used instead of using
`history.replaceState` to set state for the current page.

Default `null`

### historyState.pushState(url)

This must be used in place of `history.pushState`.  Adds a new history entry with blank
data.  An `update` or `refuse` event will be dispatched.  This function is used internally
when an `<a>` link is clicked.

### historyState.linkInterceptor(element)

This attaches a `click` event listener to `element` which intercepts normal clicks
on any `<a>` element visible from `element`.  During startup this is run for `document`
so in most cases you will not need to run `historyState.linkInterceptor` manually.  The
exception is closed shadow roots, for example:
```js
const shadowRoot = this.attachShadow({mode: 'closed'});
this.shadowRoot.innerHTML = '<a href="/link/">link</a>';

/* The `<a>` inside shadowRoot is not visible to document because of
 * closed mode, so we have to add an interceptor directly.
 */
historyState.linkInterceptor(shadowRoot);
```


### historyState Events

#### update

This is dispatched when the current location is changed, including upon window `onload`.

#### refuse

This is dispatched when a location change is refused due to `historyState.dirty` being
true.  This will happen when the user hits back/forward without leaving the SPA or when
an internal link is clicked.

### window.beforeunload

This component listens for `beforeunload`.  If `historyState.dirty` is true the unload
will be canceled.

### <a> links

This module will intercept clicks on `<a>` links.  Links to pages within `document.baseURI`
will be treated as part of the SPA.  This is disabled by adding the `target`, `download` or
`no-history-state` attributes.

## Running tests

Tests are provided by xo and ava.

```sh
npm install
npm test
```

[npm-image]: https://img.shields.io/npm/v/@cfware/history-state.svg
[npm-url]: https://npmjs.org/package/@cfware/history-state
[travis-image]: https://travis-ci.org/cfware/history-state.svg?branch=master
[travis-url]: https://travis-ci.org/cfware/history-state
[gk-image]: https://badges.greenkeeper.io/cfware/history-state.svg
[downloads-image]: https://img.shields.io/npm/dm/@cfware/history-state.svg
[downloads-url]: https://npmjs.org/package/@cfware/history-state
[license-image]: https://img.shields.io/npm/l/@cfware/history-state.svg
