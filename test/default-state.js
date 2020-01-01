import test from 'ava';

import defaultState from '../default-state.js';

test('snapshot', t => {
	t.snapshot(defaultState);
});
