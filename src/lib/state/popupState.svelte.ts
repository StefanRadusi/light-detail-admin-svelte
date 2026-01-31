interface PopupConfig {
	title: string;
	description: string;
	cancelText?: string;
	okText?: string;
	onCancel?: () => void;
	onOk?: () => void | Promise<void>;
}

interface PopupState extends PopupConfig {
	loading: boolean;
}

let popup = $state<PopupState | null>(null);

export function openPopup(config: PopupConfig) {
	popup = { ...config, loading: false };
}

export function closePopup() {
	popup = null;
}

export function getPopup() {
	return popup;
}

export function handleCancel() {
	if (popup?.loading) return;
	popup?.onCancel?.();
	closePopup();
}

export async function handleOk() {
	if (!popup || popup.loading) return;

	const result = popup.onOk?.();

	if (result instanceof Promise) {
		popup.loading = true;
		await result;
	}

	closePopup();
}
