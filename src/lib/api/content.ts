import { apiRequest } from './client';
import type { ContentItem, ContentInput, ContentUpdate, ContentOrder, MessageResponse } from './types';

export async function getContent(customFetch?: typeof fetch): Promise<ContentItem[]> {
	return apiRequest<ContentItem[]>('/content', { fetch: customFetch });
}

export async function getContentTree(customFetch?: typeof fetch): Promise<ContentItem[]> {
	return apiRequest<ContentItem[]>('/content/tree', { fetch: customFetch });
}

export async function getContentTreeByKey(key: string, customFetch?: typeof fetch): Promise<ContentItem[]> {
	return apiRequest<ContentItem[]>(`/content/tree/${key}`, { fetch: customFetch });
}

export async function getContentItem(id: number, customFetch?: typeof fetch): Promise<ContentItem> {
	return apiRequest<ContentItem>(`/content/${id}`, { fetch: customFetch });
}

export async function addContent(data: ContentInput, customFetch?: typeof fetch): Promise<ContentItem> {
	return apiRequest<ContentItem>('/content/add', {
		method: 'POST',
		body: data,
		fetch: customFetch
	});
}

export async function updateContent(id: number, data: ContentUpdate, customFetch?: typeof fetch): Promise<ContentItem> {
	return apiRequest<ContentItem>(`/content/update/${id}`, {
		method: 'PUT',
		body: data,
		fetch: customFetch
	});
}

export async function deleteContent(id: number, customFetch?: typeof fetch): Promise<MessageResponse> {
	return apiRequest<MessageResponse>(`/content/delete/${id}`, {
		method: 'DELETE',
		fetch: customFetch
	});
}

export async function reorderContent(orders: ContentOrder[], customFetch?: typeof fetch): Promise<MessageResponse> {
	return apiRequest<MessageResponse>('/content/order', {
		method: 'PUT',
		body: orders,
		fetch: customFetch
	});
}
