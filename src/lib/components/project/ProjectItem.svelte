<script lang="ts">
	import type { Project } from '$lib/api/types';
	import { Button, EditableTitle, EditableDescription, EditableTags } from '$lib';
	import { Images, Trash2 } from '@lucide/svelte';
	import { openPopup } from '$lib/state/popupState.svelte';
	import GalleryOverlay from './GalleryOverlay.svelte';

	let {
		project,
		onDelete,
		onUploadImage,
		onDeleteImage,
		onSetCover,
		onUpdateTitle,
		onUpdateDescription,
		onUpdateTags
	}: {
		project: Project;
		onDelete: (id: number) => void;
		onUploadImage: (projectId: number, file: File) => Promise<void>;
		onDeleteImage: (projectId: number, imageUrl: string) => Promise<void>;
		onSetCover: (projectId: number, imageUrl: string) => Promise<void>;
		onUpdateTitle: (projectId: number, title: string) => Promise<void>;
		onUpdateDescription: (projectId: number, description: string) => Promise<void>;
		onUpdateTags: (projectId: number, tags: string[]) => Promise<void>;
	} = $props();

	let showGallery = $state(false);

	let images = $derived(project.imgs ?? []);
</script>

<article class="project-item flex-row">
	<div class="cover-container">
		{#if project.coverImageUrl}
			<img src={project.coverImageUrl} alt={project.title} class="cover" />
		{:else}
			<div class="cover placeholder"></div>
		{/if}
	</div>

	<div class="info-container flex-col">
		<div class="content">
			<EditableTitle value={project.title} onSave={(title) => onUpdateTitle(project.id, title)} />
			<EditableDescription
				value={project.description}
				onSave={(description) => onUpdateDescription(project.id, description)}
			/>

			<EditableTags
				tags={project.tags}
				onSave={(tags) => onUpdateTags(project.id, tags)}
			/>

			<div class="actions">
				<Button class="gallery-btn" onclick={() => (showGallery = !showGallery)}>
					<Images size={18} />
				</Button>
				<Button
					variant="danger"
					onclick={() =>
						openPopup({
							title: 'Delete Project',
							description: `Are you sure you want to delete "${project.title}"?`,
							onOk: () => onDelete(project.id)
						})}
				>
					<Trash2 size={18} color="white" />
				</Button>
			</div>
		</div>

		{#if showGallery}
			<GalleryOverlay
				{images}
				onClose={() => (showGallery = false)}
				onUpload={(file) => onUploadImage(project.id, file)}
				onDeleteImage={(url) => onDeleteImage(project.id, url)}
				onSetCover={(url) => onSetCover(project.id, url)}
			/>
		{/if}
	</div>
</article>

<style>
	.project-item {
		background-color: var(--color-surface);
		border-radius: 8px;
		overflow: hidden;
	}

	.cover-container {
		flex: 1;
		position: relative;
	}

	.cover {
		width: 100%;
		height: 100%;
		object-fit: cover;
		position: absolute;
		top: 0;
		left: 0;
	}

	.cover.placeholder {
		background-color: var(--color-bg-gray);
		min-height: 150px;
	}

	.info-container {
		flex: 2;
		position: relative;
		min-width: 0;
	}

	.content {
		padding: 16px;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.actions {
		display: flex;
		gap: 8px;
		margin-top: 24px;
		margin-left: auto;
	}
</style>
