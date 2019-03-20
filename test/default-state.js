import test from 'ava';

import defaultState from '../default-state';

test('snapshot', t => {
	t.snapshot(defaultState);
});
