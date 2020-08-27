import path from 'path';
import {fileURLToPath} from 'url';
import {promisify} from 'util';

import t from 'libtap';
import {testBrowser} from '@cfware/tap-selenium-manager';
import {FastifyTestHelper, globToCustomGetters} from '@cfware/fastify-test-helper';

const delay = promisify(setTimeout);
const cwd = path.resolve(path.dirname(fileURLToPath(import.meta.url)));

const pages = {
	async 'no-intercept.html'(t, selenium) {
		const link = await selenium.findElement({id: 'link'});

		const eventCounts = {
			update: 1,
			refuse: 0,
			linkNotIntercepted: 0
		};

		const getEventCounts = () => selenium.executeScript(() => window.eventCounts);

		t.same(await getEventCounts(), eventCounts);

		await link.click();
		eventCounts.linkNotIntercepted++;
		t.same(await getEventCounts(), eventCounts);

		await selenium.executeScript(() => {
			window.historyState.linkInterceptor(document);
		});

		/* The link itself has an onclick event which should prevent the non-capturing
		 * interceptor from taking action. */
		await link.click();
		eventCounts.linkNotIntercepted++;
		t.same(await getEventCounts(), eventCounts);
	},
	async 'basic-info.html'(t, selenium) {
		const testResults = await selenium.executeScript(() => window.testResults);
		t.same(testResults, {
			links: {
				undef: false,
				notLink: false,
				download: false,
				target: false,
				noHistoryState: false,
				normal: true
			},
			clicks: {
				button1: false,
				ctrlKey: false,
				shiftKey: false,
				altKey: false,
				metaKey: false,
				normal: true
			},
			scrollRestoration: {
				initial: true,
				auto1: true,
				auto2: true,
				manual1: true,
				manual2: true
			}
		});
	},
	async 'closed-shadow.html'(t, selenium) {
		const eventCounts = {
			update: 1,
			linkNotBlocked: 0
		};
		const getEventCounts = () => selenium.executeScript(() => window.eventCounts);

		t.same(await getEventCounts(), eventCounts);

		await selenium.executeScript(() => window.shadowLink.click());
		eventCounts.linkNotBlocked++;
		t.same(await getEventCounts(), eventCounts);
		t.equal(await selenium.executeScript(() => location.pathname), '/closed-shadow.html');

		await selenium.executeScript(() => {
			window.setupIntercept();
			window.shadowLink.click();
		});
		eventCounts.update++;
		t.same(await getEventCounts(), eventCounts);
		t.equal(await selenium.executeScript(() => location.pathname), '/link/');
	},
	async 'history-state.html'(t, selenium) {
		const link = await selenium.findElement({id: 'link'});
		const flink = await selenium.findElement({id: 'flink'});
		const blocked = await selenium.findElement({id: 'blocked'});
		const getState = () => selenium.executeScript(() => ({
			loadTime: window.loadTime,
			index: history.state.index,
			state: window.historyState.state,
			dirty: window.historyState.dirty,
			location: location.pathname + location.search + location.hash
		}));
		const getEventCounts = () => selenium.executeScript(() => window.eventCounts);
		const initialState = {
			loadTime: await selenium.executeScript(() => window.loadTime),
			index: 0,
			state: null,
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
		const manualState1 = {
			...link2State,
			index: 3,
			location: '/link/manual/'
		};
		const manualState2 = {
			...manualState1,
			index: 4,
			location: '/manual/'
		};
		const link1Data = {
			...link1State,
			state: 'JSON Bourne',
			dirty: true
		};
		const eventCounts = {
			update: 1,
			refuse: 0,
			load: 1,
			linkNotBlocked: 0,
			blockedClick: 0,
			lengthError: 0
		};

		t.same(await getEventCounts(), eventCounts);
		t.same(await getState(), initialState);

		await link.click();
		eventCounts.update++;
		t.same(await getEventCounts(), eventCounts);
		t.same(await getState(), link1State);

		await selenium.executeScript(() => history.back());
		eventCounts.update++;
		t.same(await getEventCounts(), eventCounts);
		t.same(await getState(), initialState);

		await selenium.executeScript(() => history.forward());
		eventCounts.update++;
		t.same(await getEventCounts(), eventCounts);
		t.same(await getState(), link1State);

		await selenium.executeScript(() => {
			window.historyState.replaceState('JSON Bourne');
			window.historyState.dirty = true;
		});

		t.same(await getState(), link1Data);

		await selenium.executeScript(() => history.back());
		eventCounts.refuse++;
		t.same(await getEventCounts(), eventCounts);
		t.same(await getState(), link1Data);

		await selenium.executeScript(() => window.historyState.bypassDirty());
		eventCounts.update++;
		t.same(await getEventCounts(), eventCounts);
		t.same(await getState(), initialState);

		await selenium.executeScript(() => window.historyState.bypassDirty());
		t.same(await getEventCounts(), eventCounts);
		t.same(await getState(), initialState);

		await selenium.executeScript(() => history.forward());
		eventCounts.update++;
		t.same(await getEventCounts(), eventCounts);
		t.same(await getState(), link1Data);

		await link.click();
		eventCounts.refuse++;
		t.same(await getEventCounts(), eventCounts);
		t.same(await getState(), link1Data);

		await selenium.executeScript(() => window.historyState.bypassDirty());
		eventCounts.update++;
		t.same(await getEventCounts(), eventCounts);
		t.same(await getState(), link2State);

		await flink.click();
		await delay(100);
		t.equal(await selenium.executeScript(() => document.querySelector('#frame').contentWindow.location.pathname), '/404.json');
		t.same(await getEventCounts(), eventCounts);
		t.same(await getState(), link2State);

		await blocked.click();
		eventCounts.blockedClick++;
		t.same(await getEventCounts(), eventCounts);
		t.same(await getState(), link2State);

		/* Simulate beforeunload in dirty state. */
		t.ok(await selenium.executeScript(() => {
			let defaultPrevented = false;
			const event = new Event('beforeunload');
			event.preventDefault = () => {
				defaultPrevented = true;
			};

			window.historyState.dirty = true;
			window.dispatchEvent(event);

			return defaultPrevented;
		}));

		/* Simulate beforeunload in non-dirty state. */
		t.notOk(await selenium.executeScript(() => {
			let defaultPrevented = false;
			const event = new Event('beforeunload');
			event.preventDefault = () => {
				defaultPrevented = true;
			};

			window.historyState.dirty = false;
			window.dispatchEvent(event);

			return defaultPrevented;
		}));

		await selenium.executeScript(() => window.navigateTo('manual/'));
		t.same(await getState(), manualState1);

		await selenium.executeScript(() => window.navigateTo('../../manual/'));
		t.same(await getState(), manualState2);
	},
	async 'check-proxy.html'(t, selenium) {
		const state = {
			errors: 0,
			back: 0,
			forward: 0,
			go: 0,
			goDelta: undefined
		};
		const checkState = async () => {
			t.same(state, await selenium.executeScript(() => window.testState));
		};

		await selenium.executeScript(() => window.historyState.back());
		state.back++;
		await checkState();

		await selenium.executeScript(() => window.historyState.forward());
		state.forward++;
		await checkState();

		await selenium.executeScript(() => window.historyState.go(-1));
		state.go++;
		state.goDelta = [-1];
		await checkState();
	}
};

const daemon = new FastifyTestHelper({
	customGetters: globToCustomGetters('*.js', {cwd})}
);

t.test('browsers', async t => {
	await testBrowser(t, 'firefox', daemon, pages);
	await testBrowser(t, 'chrome', daemon, pages);
});
