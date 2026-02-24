import { PUBLIC_API_BASE_URL } from '$env/static/public';
import { showSnackbar } from '$lib/state/snackbarState.svelte';

interface RequestOptions {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
	body?: unknown;
	fetch?: typeof fetch;
}

export async function apiRequest<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
	const { method = 'GET', body, fetch: customFetch = fetch } = options;

	try {
		const response = await customFetch(`${PUBLIC_API_BASE_URL}${endpoint}`, {
			method,
			headers: body ? { 'Content-Type': 'application/json' } : undefined,
			credentials: 'include',
			body: body ? JSON.stringify(body) : undefined
		});

		if (!response.ok) {
			const data = await response.json().catch(() => ({}));
			const message = data.msg || 'Something went wrong';
			showSnackbar(message, 'error');
			throw new Error(message);
		}

		return response.json();
	} catch {
		showSnackbar('Something went wrong', 'error');
		throw new Error('Something went wrong');
	}
}
