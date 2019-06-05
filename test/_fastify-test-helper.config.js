import path from 'path';
import {globToCustomGetters} from '@cfware/fastify-test-helper';

const cwd = path.resolve(__dirname, '..');

export default {
	customGetters: globToCustomGetters('*.js', {cwd})
};
