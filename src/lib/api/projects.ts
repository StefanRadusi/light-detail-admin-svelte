import { apiRequest } from './client';
import type { Project, ProjectInput, ProjectUpdate, ProjectOrder, ProjectType, MessageResponse } from './types';

export async function getProjects(customFetch?: typeof fetch): Promise<Project[]> {
	return apiRequest<Project[]>('/projects', { fetch: customFetch });
}

export async function getProject(id: number, customFetch?: typeof fetch): Promise<Project> {
	return apiRequest<Project>(`/projects/${id}`, { fetch: customFetch });
}

export async function getProjectsByType(type: ProjectType, customFetch?: typeof fetch): Promise<Project[]> {
	return apiRequest<Project[]>(`/projects/type/${type}`, { fetch: customFetch });
}

export async function addProject(data: ProjectInput, customFetch?: typeof fetch): Promise<Project> {
	return apiRequest<Project>('/projects/add', {
		method: 'POST',
		body: data,
		fetch: customFetch
	});
}

export async function updateProject(id: number, data: ProjectUpdate, customFetch?: typeof fetch): Promise<Project> {
	return apiRequest<Project>(`/projects/update/${id}`, {
		method: 'PUT',
		body: data,
		fetch: customFetch
	});
}

export async function deleteProject(id: number, customFetch?: typeof fetch): Promise<MessageResponse> {
	return apiRequest<MessageResponse>(`/projects/delete/${id}`, {
		method: 'DELETE',
		fetch: customFetch
	});
}

export async function reorderProjects(orders: ProjectOrder[], customFetch?: typeof fetch): Promise<MessageResponse> {
	return apiRequest<MessageResponse>('/projects/order', {
		method: 'PUT',
		body: orders,
		fetch: customFetch
	});
}
