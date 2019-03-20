/* global window, document, location, history, Event */
import {setup, page} from '@cfware/ava-selenium-manager';
import {FastifyTestHelper} from '@cfware/fastify-test-helper';
import fastifyTestHelperConfig from './fastify-test-helper.config';

page('closed-shadow.html', async t => {
	const {selenium} = t.context;
	const eventCounts = {
		update: 1,
		linkNotBlocked: 0
	};
	const getEventCounts = () => selenium.executeScript(() => window.eventCounts);

	t.deepEqual(await getEventCounts(), eventCounts);

	await selenium.executeScript(() => window.shadowLink.click());
	eventCounts.linkNotBlocked++;
	t.deepEqual(await getEventCounts(), eventCounts);
	t.is(await selenium.executeScript(() => location.pathname), '/closed-shadow.html');

	await selenium.executeScript(() => {
		window.setupIntercept();
		window.shadowLink.click();
	});
	eventCounts.update++;
	t.deepEqual(await getEventCounts(), eventCounts);
	t.is(await selenium.executeScript(() => location.pathname), '/link/');
});

page('history-state.html', async t => {
	const {selenium} = t.context;
	const link = await selenium.findElement({id: 'link'});
	const flink = await selenium.findElement({id: 'flink'});
	const blocked = await selenium.findElement({id: 'blocked'});
	const getState = () => selenium.executeScript(() => ({
		loadTime: window.loadTime,
		index: history.state.index,
		data: window.historyState.data,
		dirty: window.historyState.dirty,
		location: location.pathname + location.search + location.hash
	}));
	const getEventCounts = () => selenium.executeScript(() => window.eventCounts);
	const initialState = {
		loadTime: await selenium.executeScript(() => window.loadTime),
		index: 0,
		data: null,
		dirty: false,
		location: '/history-state.html'
	};
	const link1State = {
		...initialState,
		index: 1,
		location: '/link/'
	};
	const link2State = {
		...link1State,
		index: 2
	};
	const link1Data = {
		...link1State,
		data: 'JSON Bourne',
		dirty: true
	};
	const eventCounts = {
		update: 1,
		refuse: 0,
		load: 1,
		linkNotBlocked: 0,
		blockedClick: 0
	};

	t.deepEqual(await getEventCounts(), eventCounts);
	t.deepEqual(await getState(), initialState);

	await link.click();
	eventCounts.update++;
	t.deepEqual(await getEventCounts(), eventCounts);
	t.deepEqual(await getState(), link1State);

	await selenium.executeScript(() => history.back());
	eventCounts.update++;
	t.deepEqual(await getEventCounts(), eventCounts);
	t.deepEqual(await getState(), initialState);

	await selenium.executeScript(() => history.forward());
	eventCounts.update++;
	t.deepEqual(await getEventCounts(), eventCounts);
	t.deepEqual(await getState(), link1State);

	await selenium.executeScript(() => {
		window.historyState.data = 'JSON Bourne';
		window.historyState.dirty = true;
	});

	t.deepEqual(await getState(), link1Data);

	await selenium.executeScript(() => history.back());
	eventCounts.refuse++;
	t.deepEqual(await getEventCounts(), eventCounts);
	t.deepEqual(await getState(), link1Data);

	await selenium.executeScript(() => window.historyState.bypassDirty());
	eventCounts.update++;
	t.deepEqual(await getEventCounts(), eventCounts);
	t.deepEqual(await getState(), initialState);

	await selenium.executeScript(() => window.historyState.bypassDirty());
	t.deepEqual(await getEventCounts(), eventCounts);
	t.deepEqual(await getState(), initialState);

	await selenium.executeScript(() => history.forward());
	eventCounts.update++;
	t.deepEqual(await getEventCounts(), eventCounts);
	t.deepEqual(await getState(), link1Data);

	await link.click();
	eventCounts.refuse++;
	t.deepEqual(await getEventCounts(), eventCounts);
	t.deepEqual(await getState(), link1Data);

	await selenium.executeScript(() => window.historyState.bypassDirty());
	eventCounts.update++;
	t.deepEqual(await getEventCounts(), eventCounts);
	t.deepEqual(await getState(), link2State);

	await flink.click();
	t.is(await selenium.executeScript(() => document.querySelector('#frame').contentWindow.location.pathname), '/404.json');
	t.deepEqual(await getEventCounts(), eventCounts);
	t.deepEqual(await getState(), link2State);

	await blocked.click();
	eventCounts.blockedClick++;
	t.deepEqual(await getEventCounts(), eventCounts);
	t.deepEqual(await getState(), link2State);

	/* Simulate beforeunload in dirty state. */
	t.deepEqual(await selenium.executeScript(() => {
		let defaultPrevented = false;
		const event = new Event('beforeunload');
		event.returnValue = true;
		event.preventDefault = () => {
			defaultPrevented = true;
		};

		window.historyState.dirty = true;
		window.dispatchEvent(event);

		return {
			defaultPrevented,
			returnValue: event.returnValue || false
		};
	}), {
		defaultPrevented: true,
		returnValue: false
	});

	/* Simulate beforeunload in non-dirty state. */
	t.deepEqual(await selenium.executeScript(() => {
		let defaultPrevented = false;
		const event = new Event('beforeunload');
		event.returnValue = true;
		event.preventDefault = () => {
			defaultPrevented = true;
		};

		window.historyState.dirty = false;
		window.dispatchEvent(event);

		return {
			defaultPrevented,
			returnValue: event.returnValue || false
		};
	}), {
		defaultPrevented: false,
		returnValue: true
	});
});

export function setupTesting(browserBuilder) {
	setup(new FastifyTestHelper(browserBuilder, fastifyTestHelperConfig));
}
