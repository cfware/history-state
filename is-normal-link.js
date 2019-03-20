export default function isNormalLink(node) {
	const bannedAttrs = ['download', 'target', 'no-history-state'];

	return node && node.tagName === 'A' && bannedAttrs.every(attr => !node.hasAttribute(attr));
}
