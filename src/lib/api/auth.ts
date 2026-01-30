import { PUBLIC_API_BASE_URL } from '$env/static/public';

export interface SignInResponse {
	message?: string;
}

export async function signIn(email: string, password: string): Promise<SignInResponse> {
	const response = await fetch(`${PUBLIC_API_BASE_URL}/api/auth/sign-in/email`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		credentials: 'include',
		body: JSON.stringify({ email, password })
	});

	if (!response.ok) {
		const data = await response.json();
		throw new Error(data.message || 'Invalid email or password');
	}

	return response.json().catch(() => ({}));
}
