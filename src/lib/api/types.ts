// Staff types
export interface Staff {
	id: number;
	name: string;
	author?: string;
	description?: string;
	coverImageUrl?: string;
	updatedAt?: number;
	createdAt?: number;
}

export interface StaffInput {
	name: string;
	author?: string;
	description?: string;
	coverImageUrl?: string;
}

// Project types
export type ProjectType = 'residential' | 'commercial';

export interface Project {
	id: number;
	title: string;
	type: ProjectType;
	coverImageUrl?: string;
	description?: string;
	latestPosition?: number;
	tags?: string[];
	imgs?: string[];
	updatedAt?: number;
	createdAt?: number;
	order?: number;
}

export interface ProjectInput {
	title: string;
	type: ProjectType;
	coverImageUrl?: string;
	description?: string;
	latestPosition?: number;
	tags?: string[];
	imgs?: string[];
	order?: number;
}

export interface ProjectUpdate {
	id?: number;
	title?: string;
	type?: ProjectType;
	coverImageUrl?: string;
	description?: string;
	latestPosition?: number;
	tags?: string[];
	imgs?: string[];
	order?: number;
}

export interface ProjectOrder {
	id: number;
	order: number;
}

// Image types
export interface ImageUploadResponse {
	message: string;
	filename: string;
	size: string;
}

// Common types
export interface MessageResponse {
	msg: string;
}
