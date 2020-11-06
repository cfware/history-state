export default node => {
	if (node?.tagName !== 'A' || !node.href) {
		return false;
	}

	for (const bannedAttribute of ['download', 'target', 'no-history-state']) {
		if (node.hasAttribute(bannedAttribute)) {
			return false;
		}
	}

	return true;
};
