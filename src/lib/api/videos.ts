import { PUBLIC_API_BASE_URL } from '$env/static/public';
import type { VideoUploadResponse, MessageResponse } from './types';

export function getVideoUrl(id: string): string {
	return `${PUBLIC_API_BASE_URL}/videos/get/${id}`;
}

export async function uploadVideo(file: File): Promise<VideoUploadResponse> {
	const formData = new FormData();
	formData.append('file', file);

	const response = await fetch(`${PUBLIC_API_BASE_URL}/videos/upload`, {
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

export async function deleteVideo(id: string): Promise<MessageResponse> {
	const response = await fetch(`${PUBLIC_API_BASE_URL}/videos/delete/${id}`, {
		method: 'DELETE',
		credentials: 'include'
	});

	if (!response.ok) {
		const data = await response.json().catch(() => ({}));
		throw new Error(data.error || 'Delete failed');
	}

	return response.json();
}
