export default function isNormalLink(node) {
	if (node?.tagName !== 'A') {
		return false;
	}

	for (const bannedAttribute of ['download', 'target', 'no-history-state']) {
		if (node.hasAttribute(bannedAttribute)) {
			return false;
		}
	}

	return true;
}
