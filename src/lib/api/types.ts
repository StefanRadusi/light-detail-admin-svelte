// Staff types
export interface Staff {
	id: number;
	name: string;
	author: string | null;
	description: string | null;
	coverImageUrl: string | null;
	updatedAt: number | null;
	createdAt: number | null;
}

export interface StaffInput {
	name: string;
	author?: string | null;
	description?: string | null;
	coverImageUrl?: string | null;
}

// Project types
export type ProjectType = 'residential' | 'commercial';

export interface Project {
	id: number;
	title: string;
	type: ProjectType;
	coverImageUrl: string | null;
	description: string | null;
	latestPosition: number | null;
	tags: unknown;
	imgs: unknown;
	updatedAt: number | null;
	createdAt: number | null;
	order: number | null;
}

export interface ProjectInput {
	title: string;
	type: ProjectType;
	coverImageUrl?: string | null;
	description?: string | null;
	latestPosition?: number | null;
	tags?: unknown;
	imgs?: unknown;
	order?: number | null;
}

export interface ProjectUpdate {
	id?: number;
	title?: string;
	type?: ProjectType;
	coverImageUrl?: string | null;
	description?: string | null;
	latestPosition?: number | null;
	tags?: unknown;
	imgs?: unknown;
	order?: number | null;
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
