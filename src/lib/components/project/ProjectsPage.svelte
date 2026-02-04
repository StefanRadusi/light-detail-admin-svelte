<script lang="ts">
	import { uploadImage, getImageUrl, getImageId, deleteImage } from '$lib/api/images';
	import { deleteProject, updateProject, addProject } from '$lib/api/projects';
	import { PageContent, ProjectItem, Button } from '$lib';
	import type { Project, ProjectType } from '$lib/api/types';
	import { invalidateAll } from '$app/navigation';
	import { Plus } from '@lucide/svelte';

	let {
		title,
		type,
		projects: initialProjects
	}: {
		title: string;
		type: ProjectType;
		projects: Project[];
	} = $props();

	let newProject = $state<Project | null>(null);

	function handleStartCreate() {
		newProject = {
			id: -1,
			title: '',
			type
		};
	}

	function handleCancelCreate() {
		newProject = null;
	}

	async function handleAdd() {
		if (!newProject) return;
		const { id, ...input } = newProject;
		await addProject(input);
		await invalidateAll();
		newProject = null;
		projects = initialProjects;
	}

	function handleNewProjectUpdateTitle(_id: number, title: string) {
		if (newProject) newProject.title = title;
		return Promise.resolve();
	}

	function handleNewProjectUpdateDescription(_id: number, description: string) {
		if (newProject) newProject.description = description;
		return Promise.resolve();
	}

	function handleNewProjectUpdateTags(_id: number, tags: string[]) {
		if (newProject) newProject.tags = tags;
		return Promise.resolve();
	}

	function handleNewProjectUpdateOrder(_id: number, order: number) {
		if (newProject) newProject.order = order;
		return Promise.resolve();
	}

	// svelte-ignore state_referenced_locally
	let projects = $state(initialProjects);

	async function handleDelete(id: number) {
		await deleteProject(id);
		projects = projects.filter((p) => p.id !== id);
	}

	async function handleUploadImage(projectId: number, file: File) {
		const { filename } = await uploadImage(file);
		const imageUrl = getImageUrl(filename);

		const idx = projects.findIndex((p) => p.id === projectId);
		const updatedImgs = [imageUrl, ...(projects[idx]?.imgs ?? [])];
		await updateProject(projectId, { imgs: updatedImgs });
		projects[idx].imgs = updatedImgs;
	}

	async function handleDeleteImage(projectId: number, imageUrl: string) {
		await deleteImage(getImageId(imageUrl));
		const idx = projects.findIndex((p) => p.id === projectId);
		const updatedImgs = (projects[idx]?.imgs ?? []).filter((img: string) => img !== imageUrl);
		await updateProject(projectId, { imgs: updatedImgs });
		projects[idx].imgs = updatedImgs;
	}

	async function handleSetCover(projectId: number, imageUrl: string) {
		const idx = projects.findIndex((p) => p.id === projectId);
		await updateProject(projectId, { coverImageUrl: imageUrl });
		projects[idx].coverImageUrl = imageUrl;
	}

	async function handleUpdateTitle(projectId: number, title: string) {
		const idx = projects.findIndex((p) => p.id === projectId);
		await updateProject(projectId, { title });
		projects[idx].title = title;
	}

	async function handleUpdateDescription(projectId: number, description: string) {
		const idx = projects.findIndex((p) => p.id === projectId);
		await updateProject(projectId, { description });
		projects[idx].description = description;
	}

	async function handleUpdateTags(projectId: number, tags: string[]) {
		const idx = projects.findIndex((p) => p.id === projectId);
		await updateProject(projectId, { tags });
		projects[idx].tags = tags;
	}

	async function handleUpdateOrder(projectId: number, order: number) {
		const idx = projects.findIndex((p) => p.id === projectId);
		await updateProject(projectId, { order });
		projects[idx].order = order;
		await invalidateAll();
		projects = initialProjects;
	}
</script>

<PageContent {title} subtitle="PROJECTS">
	{#snippet action()}
		<Button variant="primary" onclick={handleStartCreate}>
			<Plus size={18} color="white" />
		</Button>
	{/snippet}
	<div class="flex-col projects-list">
		{#if newProject}
			<ProjectItem
				project={newProject}
				onAdd={handleAdd}
				onCancel={handleCancelCreate}
				onUpdateTitle={handleNewProjectUpdateTitle}
				onUpdateDescription={handleNewProjectUpdateDescription}
				onUpdateTags={handleNewProjectUpdateTags}
				onUpdateOrder={handleNewProjectUpdateOrder}
			/>
		{/if}
		{#each projects as project (project.id)}
			<ProjectItem
				{project}
				onDelete={handleDelete}
				onUploadImage={handleUploadImage}
				onDeleteImage={handleDeleteImage}
				onSetCover={handleSetCover}
				onUpdateTitle={handleUpdateTitle}
				onUpdateDescription={handleUpdateDescription}
				onUpdateTags={handleUpdateTags}
				onUpdateOrder={handleUpdateOrder}
			/>
		{/each}
	</div>
</PageContent>

<style>
	.projects-list {
		gap: 24px;
	}
</style>
