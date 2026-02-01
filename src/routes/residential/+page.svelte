<script lang="ts">
	import { uploadImage, getImageUrl, getImageId, deleteImage } from '$lib/api/images';
	import { deleteProject, updateProject } from '$lib/api/projects';
	import { PageContent, ProjectItem } from '$lib';

	let { data } = $props();
	// svelte-ignore state_referenced_locally
	let projects = $state(data.projects);

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
		const updatedImgs = (projects[idx]?.imgs ?? []).filter((img) => img !== imageUrl);
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
</script>

<PageContent title="Residential" subtitle="PROJECTS">
	<div class="flex-col projects-list">
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
			/>
		{/each}
	</div>
</PageContent>

<style>
	.projects-list {
		gap: 24px;
	}
</style>
