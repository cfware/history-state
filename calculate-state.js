import defaultState from './default-state.js';

export default function calculateState(delta, previousState) {
	return {
		...defaultState,
		...previousState,
		index: (history.state?.index || 0) + delta
	};
}
