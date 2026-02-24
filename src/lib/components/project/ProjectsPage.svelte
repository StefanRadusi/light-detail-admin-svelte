<script lang="ts">
	import { uploadImage, getImageId, deleteImage } from '$lib/api/images';
	import { deleteProject, updateProject, addProject } from '$lib/api/projects';
	import { PageContent, ProjectItem, Button } from '$lib';
	import type { Project, ProjectState, ProjectType } from '$lib/api/types';
	import { invalidateAll } from '$app/navigation';
	import { Plus } from '@lucide/svelte';
	import { showSnackbar } from '$lib/state/snackbarState.svelte';

	let {
		title,
		type,
		projects: initialProjects
	}: {
		title: string;
		type: ProjectType;
		projects: Project[];
	} = $props();

	let newProject = $state<ProjectState | null>(null);
	// svelte-ignore state_referenced_locally
	let projects = $state(initialProjects);

	function handleStartCreate() {
		newProject = {
			id: -1,
			title: '',
			type,
			tags: [],
			imgs: [],
			order: 0
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
		showSnackbar('New project added', 'success');
	}

	function handleNewProjectUpdate<K extends keyof ProjectState>(
		_id: number,
		value: ProjectState[K],
		key: K
	) {
		if (newProject) newProject[key] = value;
		return Promise.resolve();
	}

	async function handleDelete(id: number) {
		await deleteProject(id);
		projects = projects.filter((p) => p.id !== id);
		showSnackbar('Project deleted', 'success');
	}

	async function handleUploadImage(projectId: number, file: File) {
		const { filename } = await uploadImage(file);
		const imageUrl = `/images/get/${filename}`;

		const idx = projects.findIndex((p) => p.id === projectId);
		const updatedImgs = [imageUrl, ...(projects[idx]?.imgs ?? [])];
		await updateProject(projectId, { imgs: updatedImgs });
		projects[idx].imgs = updatedImgs;
		showSnackbar('Image uploaded', 'success');
	}

	async function handleDeleteImage(projectId: number, imageUrl: string) {
		await deleteImage(getImageId(imageUrl));
		const idx = projects.findIndex((p) => p.id === projectId);
		const updatedImgs = (projects[idx]?.imgs ?? []).filter((img: string) => img !== imageUrl);
		await updateProject(projectId, { imgs: updatedImgs });
		projects[idx].imgs = updatedImgs;
		showSnackbar('Image deleted', 'success');
	}

	async function handleUpdateField<K extends keyof ProjectState>(
		projectId: number,
		value: ProjectState[K],
		key: K
	) {
		await updateProject(projectId, { [key]: value });
		if (key === 'order') {
			await invalidateAll();
			projects = initialProjects;
		} else {
			const idx = projects.findIndex((p) => p.id === projectId);
			(projects[idx] as ProjectState)[key] = value;
		}
		showSnackbar('Project updated', 'success');
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
				onUpdate={handleNewProjectUpdate}
			/>
		{/if}
		{#each projects as project (project.id)}
			<ProjectItem
				{project}
				onDelete={handleDelete}
				onUploadImage={handleUploadImage}
				onDeleteImage={handleDeleteImage}
				onUpdate={handleUpdateField}
			/>
		{/each}
	</div>
</PageContent>

<style>
	.projects-list {
		gap: 24px;
	}
</style>
