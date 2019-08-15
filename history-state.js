import calculateState from './calculate-state.js';
import defaultState from './default-state.js';
import isNormalLeftClick from './is-normal-left-click.js';
import isNormalLink from './is-normal-link.js';

class HistoryState extends EventTarget {
	constructor() {
		super();

		this._dirtyAttempt = 0;
		this._inRevert = false;

		this._currentState = defaultState;
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

	linkInterceptor(listener, listenerOptions) {
		listener.addEventListener('click', event => {
			if (event.defaultPrevented) {
				return;
			}

			const ele = event.composedPath().filter(ele => ele.tagName === 'A')[0];

			if (!isNormalLeftClick(event) || !isNormalLink(ele)) {
				return;
			}

			const dest = new URL(ele.href, location.href).toString();
			if (dest.startsWith(document.baseURI.replace(/[?#].*/, ''))) {
				ele.blur();
				event.preventDefault();
				event.stopPropagation();
				this.pushState(null, '', dest);
			}
		}, listenerOptions);
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

	get dirty() {
		return this._currentState.dirty;
	}

	set dirty(value) {
		this._updateState({dirty: value});
	}

	get state() {
		return this._currentState.state;
	}

	bypassDirty() {
		const attempt = this._dirtyAttempt;
		if (attempt !== 0) {
			this._dirtyAttempt = 0;
			this._currentState.dirty = false;
			history.go(attempt);
		}
	}
}

export default new HistoryState();
