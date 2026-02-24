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

export type StaffState = Omit<Staff, 'createdAt' | 'updatedAt'>;

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
	tags: string[];
	imgs: string[];
	updatedAt: number;
	createdAt: number;
	order: number;
}

export type ProjectState = Omit<Project, 'createdAt' | 'updatedAt'>;

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

// Content types
export type ContentType = 'text' | 'image' | 'video' | 'section';

export interface ContentItem {
	id: number;
	key: string;
	value?: string;
	type: ContentType;
	parentId?: number;
	order?: number;
	metadata?: Record<string, unknown>;
	createdAt?: number;
	updatedAt?: number;
	children?: ContentItem[];
}

export type ContentItemState = Omit<ContentItem, 'createdAt' | 'updatedAt'>;

export interface ContentInput {
	key: string;
	type: ContentType;
	value?: string;
	parentId?: number;
	order?: number;
	metadata?: Record<string, unknown>;
}

export interface ContentUpdate {
	key?: string;
	value?: string;
	type?: ContentType;
	parentId?: number;
	order?: number;
	metadata?: Record<string, unknown>;
}

export interface ContentOrder {
	id: number;
	order: number;
}

// Video types
export interface VideoUploadResponse {
	message: string;
	filename: string;
	size: string;
}

// Common types
export interface MessageResponse {
	msg: string;
}
