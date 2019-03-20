import test from 'ava';
import isNormalLeftClick from '../is-normal-left-click';

test('button 0', t => {
	t.true(isNormalLeftClick({button: 0}));
});

test('button 1', t => {
	t.false(isNormalLeftClick({button: 1}));
});

['ctrlKey', 'shiftKey', 'altKey', 'metaKey'].forEach(key => {
	test(key, t => {
		t.false(isNormalLeftClick({button: 0, [key]: true}));
	});
});
