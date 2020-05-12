import calculateState from './calculate-state.js';
import defaultState from './default-state.js';
import isNormalLeftClick from './is-normal-left-click.js';
import isNormalLink from './is-normal-link.js';

class HistoryState extends EventTarget {
	_dirtyAttempt = 0;
	_inRevert = false;
	_currentState = defaultState;

	constructor() {
		super();

		this._updateState(history.state);

		window.addEventListener('load', () => {
			if (this.defaultIntercept !== false) {
				this.linkInterceptor(document, this.defaultInterceptOptions);
			}

			this._spaUpdate(true);
			setTimeout(() => {
				window.addEventListener('popstate', () => this._onpopstate());
			}, 0);
		});

		window.addEventListener('beforeunload', event => {
			if (this._currentState.dirty) {
				event.preventDefault();
				event.returnValue = '';
			}
		});
	}

	_onpopstate() {
		if (this._inRevert) {
			this._inRevert = false;
			this.dispatchEvent(new Event('refuse'));
			return;
		}

		this._spaUpdate();
	}

	_spaUpdate(initializing) {
		if (this.dirty && !initializing) {
			this._inRevert = true;
			this._dirtyAttempt = history.state.index - this._currentState.index;
			history.go(-this._dirtyAttempt);
			return;
		}

		this._currentState = history.state;
		this.dispatchEvent(new Event('update'));
	}

	_updateState(newSettings, title, url) {
		history.replaceState(calculateState(0, {...this._currentState, ...newSettings}), title, url);
		this._currentState = history.state;
	}

	replaceState(state, title, url) {
		this._updateState({state}, title, url);
	}

	pushState(state, title, url) {
		history.pushState(calculateState(1, {state}), title, url);
		this._spaUpdate();
	}

	get state() {
		return this._currentState.state;
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

	get dirty() {
		return this._currentState.dirty;
	}

	set dirty(dirty) {
		this._updateState({dirty});
	}

	bypassDirty() {
		const attempt = this._dirtyAttempt;
		if (attempt !== 0) {
			this._dirtyAttempt = 0;
			this._currentState.dirty = false;
			history.go(attempt);
		}
	}

	linkInterceptor(listener, listenerOptions) {
		listener.addEventListener('click', event => {
			if (event.defaultPrevented || !isNormalLeftClick(event)) {
				return;
			}

			const element = event.composedPath().filter(element => element.tagName === 'A')[0];
			if (!isNormalLink(element)) {
				return;
			}

			const destination = new URL(element.href, location.href).toString();
			if (destination.startsWith(document.baseURI.replace(/[?#].*/u, ''))) {
				element.blur();
				event.preventDefault();
				event.stopPropagation();
				this.pushState(null, '', destination);
			}
		}, listenerOptions);
	}
}

export default new HistoryState();
