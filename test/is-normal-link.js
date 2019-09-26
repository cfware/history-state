import test from 'ava';
import isNormalLink from '../is-normal-link';

test('is undefined', t => {
	t.is(isNormalLink(), undefined);
});

test('is not a link', t => {
	t.false(isNormalLink({tagName: 'DIV'}));
});

test('is download link', t => {
	t.false(isNormalLink({
		tagName: 'A',
		hasAttribute: name => name === 'download'
	}));
});

test('is target link', t => {
	t.false(isNormalLink({
		tagName: 'A',
		hasAttribute: name => name === 'target'
	}));
});

test('is no-history-state link', t => {
	t.false(isNormalLink({
		tagName: 'A',
		hasAttribute: name => name === 'no-history-state'
	}));
});
