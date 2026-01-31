let preview = $state<{ images: string[]; index: number } | null>(null);

export function openPreview(images: string[], index = 0) {
	preview = { images, index };
}

export function closePreview() {
	preview = null;
}

export function getPreview() {
	return preview;
}

export function nextImage() {
	if (preview && preview.index < preview.images.length - 1) {
		preview.index++;
	}
}

export function prevImage() {
	if (preview && preview.index > 0) {
		preview.index--;
	}
}
