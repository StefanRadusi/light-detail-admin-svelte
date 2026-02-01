import { PUBLIC_API_BASE_URL } from '$env/static/public';
import type { ImageUploadResponse, MessageResponse } from './types';

export function getImageUrl(id: string): string {
	return `${PUBLIC_API_BASE_URL}/images/get/${id}`;
}

export function getImageId(url: string): string {
	return url.split('/').pop() ?? '';
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

export async function deleteImage(id: string): Promise<MessageResponse> {
	const response = await fetch(`${PUBLIC_API_BASE_URL}/images/delete/${id}`, {
		method: 'DELETE',
		credentials: 'include'
	});

	if (!response.ok) {
		const data = await response.json().catch(() => ({}));
		throw new Error(data.error || 'Delete failed');
	}

	return response.json();
}
