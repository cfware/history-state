import defaultState from './default-state';

const getIndex = state => (state && state.index) || 0;

export default function calculateState(delta, prevState) {
	return {
		...defaultState,
		...prevState,
		index: getIndex(history.state) + delta
	};
}
