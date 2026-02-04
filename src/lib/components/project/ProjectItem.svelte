<script lang="ts">
	import type { Project } from '$lib/api/types';
	import { Button, EditableTitle, EditableDescription, EditableTags, EditableOrder } from '$lib';
	import { Images, Trash2, Plus, X } from '@lucide/svelte';
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
		onUpdateTags,
		onUpdateOrder,
		onAdd,
		onCancel
	}: {
		project: Project;
		onDelete?: (id: number) => void;
		onUploadImage?: (projectId: number, file: File) => Promise<void>;
		onDeleteImage?: (projectId: number, imageUrl: string) => Promise<void>;
		onSetCover?: (projectId: number, imageUrl: string) => Promise<void>;
		onUpdateTitle: (projectId: number, title: string) => Promise<void>;
		onUpdateDescription: (projectId: number, description: string) => Promise<void>;
		onUpdateTags: (projectId: number, tags: string[]) => Promise<void>;
		onUpdateOrder: (projectId: number, order: number) => Promise<void>;
		onAdd?: () => Promise<void>;
		onCancel?: () => void;
	} = $props();

	let showGallery = $state(false);
	let isAdding = $state(false);

	async function handleAdd() {
		if (!onAdd || isAdding) return;
		isAdding = true;
		try {
			await onAdd();
		} finally {
			isAdding = false;
		}
	}
	let isCreateMode = $derived(project.id === -1);
	let images = $derived(project.imgs ?? []);
</script>

<article class="project-item flex-row" class:create-mode={isCreateMode}>
	<div class="cover-container">
		{#if project.coverImageUrl}
			<img src={project.coverImageUrl} alt={project.title} class="cover" />
		{:else}
			<div class="cover placeholder"></div>
		{/if}
	</div>

	<div class="info-container flex-col">
		<div class="content">
			<div class="title-row">
				{#if !isCreateMode}
					<EditableOrder
						value={project.order ?? 1}
						onSave={(order) => onUpdateOrder(project.id, order)}
					/>
					<span class="separator"></span>
				{/if}
				<EditableTitle value={project.title} onSave={(title) => onUpdateTitle(project.id, title)} />
			</div>
			<EditableDescription
				value={project.description}
				onSave={(description) => onUpdateDescription(project.id, description)}
			/>

			<EditableTags tags={project.tags ?? []} onSave={(tags) => onUpdateTags(project.id, tags)} />

			<div class="actions">
				{#if isCreateMode}
					<Button variant="secondary" onclick={onCancel}>
						<X size={18} />
					</Button>
					<Button variant="primary" onclick={handleAdd} loading={isAdding}>Add New Projects</Button>
				{:else}
					<Button class="gallery-btn" onclick={() => (showGallery = !showGallery)}>
						<Images size={18} />
					</Button>
					<Button
						variant="danger"
						onclick={() =>
							openPopup({
								title: 'Delete Project',
								description: `Are you sure you want to delete "${project.title}"?`,
								onOk: () => onDelete?.(project.id)
							})}
					>
						<Trash2 size={18} color="white" />
					</Button>
				{/if}
			</div>
		</div>

		{#if showGallery && !isCreateMode}
			<GalleryOverlay
				{images}
				onClose={() => (showGallery = false)}
				onUpload={(file) => onUploadImage!(project.id, file)}
				onDeleteImage={(url) => onDeleteImage!(project.id, url)}
				onSetCover={(url) => onSetCover!(project.id, url)}
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

	.project-item.create-mode {
		border: 1px dashed var(--color-primary);
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

	.title-row {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.title-row :global(.editable-title) {
		flex: 1;
	}

	.separator {
		width: 2px;
		height: 20px;
		background-color: var(--color-text-muted);
		opacity: 0.3;
	}

	.actions {
		display: flex;
		gap: 8px;
		margin-top: 24px;
		margin-left: auto;
	}
</style>
