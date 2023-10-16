import defaultState from './default-state.js';

export default (delta, previousState) => {
    return {
        ...defaultState,
        ...previousState,
        index: (history.state?.index || 0) + delta
    };
};
