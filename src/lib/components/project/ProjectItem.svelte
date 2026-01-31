<script lang="ts">
	import type { Project } from '$lib/api/types';
	import { Body, Button, IconButton, Subtitle } from '$lib';
	import { Images, Trash2, X } from '@lucide/svelte';
	import { openPreview } from '$lib/state/imagePreviewState.svelte';
	import { openPopup } from '$lib/state/popupState.svelte';
	import clsx from 'clsx';
	import { fade } from 'svelte/transition';

	let { project, onDelete }: { project: Project; onDelete?: (id: number) => void } = $props();

	const MAX_DESCRIPTION_CHARS = 100;

	let showGallery = $state(false);
	let descriptionExpanded = $state(false);

	let isTruncated = $derived(
		project.description ? project.description.length > MAX_DESCRIPTION_CHARS : false
	);
	let displayDescription = $derived(
		project.description && isTruncated && !descriptionExpanded
			? project.description.slice(0, MAX_DESCRIPTION_CHARS)
			: project.description
	);

	// Handle imgs which could be array of strings or objects with url
	let images = $derived.by<string[]>(() => {
		if (!project.imgs) return [];
		if (Array.isArray(project.imgs)) {
			return project.imgs.map((img: unknown) =>
				typeof img === 'string' ? img : ((img as { url?: string })?.url ?? '')
			);
		}
		return [];
	});
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
			<Subtitle>{project.title}</Subtitle>
			{#if project.description}
				<Body class="description">
					{displayDescription}{#if isTruncated}<button
							class={clsx('expand-btn', descriptionExpanded && 'expand-btn--expanded')}
							onclick={() => (descriptionExpanded = !descriptionExpanded)}
							>{descriptionExpanded ? ' less' : '...'}</button
						>{/if}
				</Body>
			{/if}

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
							onOk: () => onDelete?.(project.id)
						})}
				>
					<Trash2 size={18} color="white" />
				</Button>
			</div>
		</div>

		{#if showGallery}
			<div class="gallery-overlay" transition:fade={{ duration: 150 }}>
				<IconButton class="gallery-close-btn" onclick={() => (showGallery = false)}>
					<X size={18} />
				</IconButton>
				<div class="thumbnails-scroll">
					<div class="thumbnails">
						{#each images as img, i}
							<button class="thumbnail" onclick={() => openPreview(images, i)}>
								<img src={img} alt="" />
							</button>
						{:else}
							<p class="no-images">No images available</p>
						{/each}
					</div>
				</div>
			</div>
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

	.expand-btn {
		background: none;
		border: none;
		padding: 0;
		color: var(--color-primary);
		font-size: 16px;
		cursor: pointer;
		font-weight: 400;
		margin-left: 10px;
	}

	.expand-btn--expanded {
		margin-left: 0px;
	}

	.expand-btn:hover {
		text-decoration: underline;
	}

	.actions {
		display: flex;
		gap: 8px;
		margin-top: 24px;
		margin-left: auto;
	}

	.gallery-overlay {
		position: absolute;
		inset: 0;
		background-color: var(--color-surface);
		display: flex;
		flex-direction: column;
	}

	.gallery-overlay :global(.gallery-close-btn) {
		position: absolute;
		top: 8px;
		right: 8px;
		z-index: 1;
	}

	.thumbnails-scroll {
		flex: 1;
		overflow-y: auto;
		padding: 16px;
	}

	.thumbnails {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
		gap: 8px;
	}

	.thumbnail {
		aspect-ratio: 1;
		border: none;
		padding: 0;
		cursor: pointer;
		border-radius: 4px;
		overflow: hidden;
	}

	.thumbnail img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.thumbnail:hover {
		opacity: 0.8;
	}

	.no-images {
		color: var(--color-text-muted);
		font-size: 14px;
	}
</style>
