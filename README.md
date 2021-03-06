# @cfware/history-state [![NPM Version][npm-image]][npm-url]

Browser History API state manager.

## Usage

```js
import historyState, * as historyFunctions from '@cfware/history-state';

historyState.addEventListener('update', () => {
  /* An internal navigation has occurred with history API. */
});

historyState.addEventListener('refuse', () => {
  /* An internal navigation has been refused due to dirty state. */
  if (window.confirm('Do you really want to leave this page without saving?')) {
    /* honor the back/forward/link click requested by the user. */
    historyFunctions.bypassDirty();
  }
});
```

### historyState.state

This should be used instead of `history.state` which will contain additional fields
that are internal to `@cfware/history-state`.

Use `historyState.pushState` or `historyState.replaceState` to modify.  `historyState.state`
should be treated as if it is frozen.

Default `null`

### historyState.pushState(state, title, url)

This must be used in place of `history.pushState`.  This function causes an `update` or
`refuse` event to be dispatched depending on `historyFunctions.isDirty()`.

### historyState.replaceState(state, title, url)

This must be used in place of `history.replaceState`.  This replaces the current history
entry.

Unlike `historyState.pushState` this function does not cause `update` or `refuse` to be
dispatched.  This function succeeds regardless of `dirty` status.

### historyState Events

#### update

This is dispatched when the current location is changed, including upon window `onload`.

#### refuse

This is dispatched when a location change is refused due to `historyState.dirty` being
true.  This will happen when the user hits back/forward without leaving the SPA or when
an internal link is clicked.

### historyFunctions.bypassDirty()

Calling this function after a `refuse` event will allow navigation that was blocked
by the dirty status.

### historyFunctions.setDirty(value)

This can be set true or false to indicate if the current page has unsaved changes.

Default `false`

### historyFunctions.isDirty()

Retrieve the current dirty status.

### historyFunctions.linkInterceptor(element, listenerOptions)

This attaches a `click` event listener to `element` which intercepts normal clicks
on any `<a>` element visible from `element`.  During startup this is run for `document`
so in most cases you will not need to run `historyFunctions.linkInterceptor` manually.  The
exception is closed shadow roots, for example:
```js
const shadowRoot = this.attachShadow({mode: 'closed'});
this.shadowRoot.innerHTML = '<a href="/link/">link</a>';

/* The `<a>` inside shadowRoot is not visible to document because of
 * closed mode, so we have to add an interceptor directly.
 */
historyFunctions.linkInterceptor(shadowRoot);
```

Any link click that is intercepted results in a call to `historyState.pushState`.

The `listenerOptions` argument is passed to `element.addEventListener` as the second
argument.

### window.onbeforeunload

This component listens for `beforeunload`.  If `historyState.isDirty()` is true the unload
will be canceled.

### <a> links

By default this module will intercept clicks on `<a>` links.  Links to pages within
`document.baseURI` will be treated as part of the SPA.  This is disabled per link by
adding the `target`, `download` or `no-history-state` attributes.

The default click listener can be disabled by calling `historyFunctions.setDefaultInterceptOptions(false)`
before window.onload occurs.  Values other than `false` will be used as the options argument to
the default interceptor.

The link interceptor will not take any action if `event.preventDefault()` has already
been run by another listener.

### window.onpopstate

This event should be ignored, monitor the `update` event of `historyState` instead.


[npm-image]: https://img.shields.io/npm/v/@cfware/history-state.svg
[npm-url]: https://npmjs.org/package/@cfware/history-state
