import defaultState from './default-state.js';

const getIndex = state => (state && state.index) || 0;

export default function calculateState(delta, prevState) {
	return {
		...defaultState,
		...prevState,
		index: getIndex(history.state) + delta
	};
}
