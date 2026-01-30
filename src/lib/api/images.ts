import { PUBLIC_API_BASE_URL } from '$env/static/public';
import type { ImageUploadResponse } from './types';

export function getImageUrl(id: string): string {
	return `${PUBLIC_API_BASE_URL}/images/get/${id}`;
}

export async function uploadImage(file: File): Promise<ImageUploadResponse> {
	const formData = new FormData();
	formData.append('file', file);

	const response = await fetch(`${PUBLIC_API_BASE_URL}/images/upload`, {
		method: 'POST',
		credentials: 'include',
		body: formData
	});

	if (!response.ok) {
		const data = await response.json().catch(() => ({}));
		throw new Error(data.error || 'Upload failed');
	}

	return response.json();
}
