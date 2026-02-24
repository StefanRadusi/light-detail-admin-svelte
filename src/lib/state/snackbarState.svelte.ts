export type SnackbarType = 'info' | 'success' | 'error';

interface SnackbarItem {
	id: number;
	message: string;
	type: SnackbarType;
}

let items = $state<SnackbarItem[]>([]);
let nextId = 0;

export function showSnackbar(message: string, type: SnackbarType = 'info', duration = 3000) {
	const id = nextId++;
	items.push({ id, message, type });

	setTimeout(() => {
		dismissSnackbar(id);
	}, duration);
}

export function dismissSnackbar(id: number) {
	items = items.filter((item) => item.id !== id);
}

export function getSnackbarItems() {
	return items;
}
