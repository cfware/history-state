export default function isNormalLeftClick(event) {
	return event.button === 0 && !event.ctrlKey && !event.shiftKey && !event.altKey && !event.metaKey;
}
