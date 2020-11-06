import calculateState from './calculate-state.js';
import defaultState from './default-state.js';
import isNormalLeftClick from './is-normal-left-click.js';
import isNormalLink from './is-normal-link.js';

let dirtyAttempt = 0;
let inRevert = false;
let currentState = defaultState;
let defaultInterceptOptions;

const updateState = (newSettings, title, url) => {
	history.replaceState(calculateState(0, {...currentState, ...newSettings}), title, url);
	currentState = history.state;
};

class HistoryState extends EventTarget {
	replaceState(state, title, url) {
		updateState({state}, title, url);
	}

	pushState(state, title, url) {
		history.pushState(calculateState(1, {state}), title, url);
		spaUpdate();
	}

	get state() {
		return currentState.state;
	}

	get length() {
		return history.length;
	}

	get scrollRestoration() {
		return history.scrollRestoration;
	}

	set scrollRestoration(value) {
		history.scrollRestoration = value;
	}

	back() {
		history.back();
	}

	forward() {
		history.forward();
	}

	go(delta) {
		history.go(delta);
	}
}

updateState(history.state);

window.addEventListener('load', () => {
	if (defaultInterceptOptions !== false) {
		linkInterceptor(document, defaultInterceptOptions);
	}

	spaUpdate(true);
	setTimeout(() => window.addEventListener('popstate', onpopstate), 0);
});

window.addEventListener('beforeunload', event => {
	if (currentState.dirty) {
		event.preventDefault();
		event.returnValue = '';
	}
});

const historyState = new HistoryState();

const spaUpdate = initializing => {
	if (currentState.dirty && !initializing) {
		inRevert = true;
		dirtyAttempt = history.state.index - currentState.index;
		history.go(-dirtyAttempt);
		return;
	}

	currentState = history.state;
	historyState.dispatchEvent(new Event('update'));
};

const onpopstate = () => {
	if (inRevert) {
		inRevert = false;
		historyState.dispatchEvent(new Event('refuse'));
	} else {
		spaUpdate();
	}
};

export const navigateTo = url => historyState.pushState(null, '', new URL(url, location.href).href);

export const linkInterceptor = (listener, listenerOptions) => {
	listener.addEventListener('click', event => {
		if (event.defaultPrevented || !isNormalLeftClick(event)) {
			return;
		}

		const element = event.composedPath().find(element => element.tagName === 'A');
		if (!isNormalLink(element)) {
			return;
		}

		const destination = new URL(element.href, location.href).toString();
		if (destination.startsWith(document.baseURI.replace(/[?#].*/u, ''))) {
			element.blur();
			event.preventDefault();
			event.stopPropagation();
			historyState.pushState(null, '', destination);
		}
	}, listenerOptions);
};

export const setDefaultInterceptOptions = options => {
	defaultInterceptOptions = options;
};

export const bypassDirty = () => {
	if (dirtyAttempt !== 0) {
		const attempt = dirtyAttempt;
		dirtyAttempt = 0;
		currentState.dirty = false;
		history.go(attempt);
	}
};

export const setDirty = dirty => updateState({dirty});

export const isDirty = () => currentState.dirty;

export default historyState;
