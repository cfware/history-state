import calculateState from './calculate-state';
import defaultState from './default-state';
import isNormalLeftClick from './is-normal-left-click';
import isNormalLink from './is-normal-link';

class HistoryState extends EventTarget {
	constructor() {
		super();

		this._dirtyAttempt = 0;
		this._inRevert = false;

		this._currentState = defaultState;
		this._replaceState(history.state);

		this.linkInterceptor(document);

		window.addEventListener('load', () => {
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

	linkInterceptor(listener) {
		listener.addEventListener('click', event => {
			const ele = event.composedPath().filter(ele => ele.tagName === 'A')[0];

			if (!isNormalLeftClick(event) || !isNormalLink(ele)) {
				return;
			}

			const dest = new URL(ele.href, location.href).toString();
			if (dest.startsWith(document.baseURI.replace(/[?#].*/, ''))) {
				ele.blur();
				event.preventDefault();
				event.stopPropagation();
				this.pushState(dest);
			}
		}, true);
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

	_replaceState(newSettings) {
		history.replaceState(calculateState(0, {...this._currentState, ...newSettings}), '', location.href);
		this._currentState = history.state;
	}

	pushState(url) {
		history.pushState(calculateState(1, {}), '', url);
		this._spaUpdate();
	}

	get dirty() {
		return this._currentState.dirty;
	}

	set dirty(value) {
		this._replaceState({dirty: value});
	}

	get data() {
		return this._currentState.data;
	}

	set data(value) {
		this._replaceState({data: value});
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
