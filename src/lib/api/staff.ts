import { apiRequest } from './client';
import type { Staff, StaffInput, MessageResponse } from './types';

export async function getStaff(): Promise<Staff[]> {
	return apiRequest<Staff[]>('/staff');
}

export async function addStaff(data: StaffInput): Promise<Staff> {
	return apiRequest<Staff>('/staff/add', {
		method: 'POST',
		body: data
	});
}

export async function updateStaff(id: number, data: Partial<StaffInput>): Promise<Staff> {
	return apiRequest<Staff>(`/staff/update/${id}`, {
		method: 'PUT',
		body: data
	});
}

export async function deleteStaff(id: number): Promise<MessageResponse> {
	return apiRequest<MessageResponse>(`/staff/delete/${id}`, {
		method: 'DELETE'
	});
}
