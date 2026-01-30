import { PUBLIC_API_BASE_URL } from '$env/static/public';

interface RequestOptions {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
	body?: unknown;
}

export async function apiRequest<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
	const { method = 'GET', body } = options;

	const response = await fetch(`${PUBLIC_API_BASE_URL}${endpoint}`, {
		method,
		headers: body ? { 'Content-Type': 'application/json' } : undefined,
		credentials: 'include',
		body: body ? JSON.stringify(body) : undefined
	});

	if (!response.ok) {
		const data = await response.json().catch(() => ({}));
		throw new Error(data.msg || data.message || 'Request failed');
	}

	return response.json();
}
