<script lang="ts">
	import { Button, IconButton, SmallLoadingAnimation } from '$lib';
	import { ImageIcon, Trash2, Upload, X } from '@lucide/svelte';
	import { getImageId } from '$lib/api/images';
	import { openPreview } from '$lib/state/imagePreviewState.svelte';
	import { fade } from 'svelte/transition';

	let {
		images,
		onClose,
		onUpload,
		onDeleteImage,
		onSetCover
	}: {
		images: string[];
		onClose: () => void;
		onUpload: (file: File) => Promise<void>;
		onDeleteImage: (imageUrl: string) => Promise<void>;
		onSetCover: (imageUrl: string) => Promise<void>;
	} = $props();

	let isUploading = $state(false);
	let loadingImageId = $state<string | null>(null);

	// svelte-ignore non_reactive_update
	let fileInput: HTMLInputElement;

	async function handleFileSelect() {
		const file = fileInput.files?.[0];
		if (!file) return;

		isUploading = true;
		try {
			await onUpload(file);
		} finally {
			isUploading = false;
			fileInput.value = '';
		}
	}

	async function handleDeleteImage(img: string) {
		loadingImageId = getImageId(img);
		try {
			await onDeleteImage(img);
		} finally {
			loadingImageId = null;
		}
	}

	async function handleSetCover(img: string) {
		loadingImageId = getImageId(img);
		try {
			await onSetCover(img);
		} finally {
			loadingImageId = null;
		}
	}
</script>

<div class="gallery-overlay" transition:fade={{ duration: 150 }}>
	<IconButton class="close-btn" onclick={onClose}>
		<X size={18} />
	</IconButton>
	<div class="thumbnails-scroll">
		<input type="file" accept="image/*" bind:this={fileInput} onchange={handleFileSelect} hidden />
		<div class="thumbnails">
			<Button
				variant="secondary"
				class="upload-btn"
				loading={isUploading}
				onclick={() => fileInput.click()}
			>
				<Upload size={24} />
			</Button>
			{#each images as img, i (getImageId(img))}
				{@const isLoading = loadingImageId === getImageId(img)}
				<div class="thumbnail-wrapper">
					<button class="thumbnail" onclick={() => openPreview(images, i)} disabled={isLoading}>
						<img src={img} alt="" />
					</button>
					{#if isLoading}
						<div class="thumbnail-loader" transition:fade>
							<SmallLoadingAnimation visible={true} variant="light" />
						</div>
					{/if}
					<div class="thumbnail-actions">
						<IconButton class="action-btn" onclick={() => handleSetCover(img)} disabled={isLoading}>
							<ImageIcon size={14} />
						</IconButton>
						<IconButton
							class="action-btn"
							onclick={() => handleDeleteImage(img)}
							disabled={isLoading}
						>
							<Trash2 size={14} />
						</IconButton>
					</div>
				</div>
			{:else}
				<p class="no-images">No images available</p>
			{/each}
		</div>
	</div>
</div>

<style>
	.gallery-overlay {
		position: absolute;
		inset: 0;
		background-color: var(--color-surface);
		display: flex;
	}

	.gallery-overlay :global(.close-btn) {
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

	.thumbnails :global(.upload-btn) {
		aspect-ratio: 1;
		justify-content: center;
	}

	.thumbnail-wrapper {
		position: relative;
		aspect-ratio: 1;
		overflow: hidden;
		border-radius: 4px;
	}

	.thumbnail-loader {
		position: absolute;
		inset: 0;
		background-color: rgba(0, 0, 0, 0.5);
		border-radius: 4px;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}

	.thumbnail {
		width: 100%;
		height: 100%;
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

	.thumbnail-actions {
		position: absolute;
		bottom: 4px;
		right: 4px;
		display: flex;
		gap: 2px;
	}

	.thumbnail-actions :global(.action-btn) {
		width: 24px;
		height: 24px;
		padding: 4px;
		background-color: rgba(0, 0, 0, 0.6);
		border-radius: 4px;
	}

	.thumbnail-actions :global(.action-btn:hover) {
		background-color: rgba(0, 0, 0, 0.8);
	}

	.no-images {
		color: var(--color-text-muted);
		font-size: 14px;
	}
</style>
