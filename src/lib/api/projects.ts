import { apiRequest } from './client';
import type { Project, ProjectInput, ProjectUpdate, ProjectOrder, ProjectType, MessageResponse } from './types';

export async function getProjects(): Promise<Project[]> {
	return apiRequest<Project[]>('/projects');
}

export async function getProject(id: number): Promise<Project> {
	return apiRequest<Project>(`/projects/${id}`);
}

export async function getProjectsByType(type: ProjectType): Promise<Project[]> {
	return apiRequest<Project[]>(`/projects/type/${type}`);
}

export async function addProject(data: ProjectInput): Promise<Project> {
	return apiRequest<Project>('/projects/add', {
		method: 'POST',
		body: data
	});
}

export async function updateProject(id: number, data: ProjectUpdate): Promise<Project> {
	return apiRequest<Project>(`/projects/update/${id}`, {
		method: 'PUT',
		body: data
	});
}

export async function deleteProject(id: number): Promise<MessageResponse> {
	return apiRequest<MessageResponse>(`/projects/delete/${id}`, {
		method: 'DELETE'
	});
}

export async function reorderProjects(orders: ProjectOrder[]): Promise<MessageResponse> {
	return apiRequest<MessageResponse>('/projects/order', {
		method: 'PUT',
		body: orders
	});
}
