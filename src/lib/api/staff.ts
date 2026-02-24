import { apiRequest } from './client';
import type { Staff, StaffInput, MessageResponse } from './types';

export async function getStaff(customFetch?: typeof fetch): Promise<Staff[]> {
	return apiRequest<Staff[]>('/staff', { fetch: customFetch });
}

export async function addStaff(data: StaffInput, customFetch?: typeof fetch): Promise<Staff> {
	return apiRequest<Staff>('/staff/add', {
		method: 'POST',
		body: data,
		fetch: customFetch
	});
}

export async function updateStaff(id: number, data: Partial<StaffInput>, customFetch?: typeof fetch): Promise<Staff> {
	return apiRequest<Staff>(`/staff/update/${id}`, {
		method: 'PUT',
		body: data,
		fetch: customFetch
	});
}

export async function deleteStaff(id: number, customFetch?: typeof fetch): Promise<MessageResponse> {
	return apiRequest<MessageResponse>(`/staff/delete/${id}`, {
		method: 'DELETE',
		fetch: customFetch
	});
}
