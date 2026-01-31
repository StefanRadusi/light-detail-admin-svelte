<script lang="ts">
	import {
		getPreview,
		closePreview,
		nextImage,
		prevImage
	} from '$lib/state/imagePreviewState.svelte';
	import { ChevronLeft, ChevronRight, X } from '@lucide/svelte';
	import { fade } from 'svelte/transition';
	import { IconButton } from '$lib';

	let preview = $derived(getPreview());
	let currentImage = $derived(preview?.images[preview.index]);

	function handlePrev(e: Event) {
		e.stopPropagation();
		prevImage();
	}

	function handleNext(e: Event) {
		e.stopPropagation();
		nextImage();
	}
</script>

{#if preview}
	<div
		class="preview-overlay"
		transition:fade={{ duration: 150 }}
		onclick={closePreview}
		onkeydown={(e) => e.key === 'Escape' && closePreview()}
		role="dialog"
		tabindex="-1"
	>
		<IconButton class="close-btn" onclick={closePreview}>
			<X size={24} />
		</IconButton>

		<IconButton class="nav-btn nav-prev" onclick={handlePrev}>
			<ChevronLeft size={24} />
		</IconButton>

		<img src={currentImage} alt="Preview" class="preview-image" />

		<IconButton class="nav-btn nav-next" onclick={handleNext}>
			<ChevronRight size={24} />
		</IconButton>
	</div>
{/if}

<style>
	.preview-overlay {
		position: fixed;
		inset: 0;
		background-color: rgba(0, 0, 0, 0.9);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		cursor: pointer;
	}

	.preview-overlay :global(.close-btn) {
		position: absolute;
		top: 16px;
		right: 16px;
	}

	.preview-overlay :global(.nav-btn) {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
	}

	.preview-overlay :global(.nav-prev) {
		left: 16px;
	}

	.preview-overlay :global(.nav-next) {
		right: 16px;
	}

	.preview-image {
		max-width: 90vw;
		max-height: 90vh;
		object-fit: contain;
	}
</style>
