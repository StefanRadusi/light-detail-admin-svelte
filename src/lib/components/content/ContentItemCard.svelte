<script lang="ts">
	import type { ContentItemState } from '$lib/api/types';
	import { EditableTitle, EditableDescription, EditableOrder, Button } from '$lib';
	import { Trash2, Upload, X, Check, ChevronDown, ChevronRight, Copy } from '@lucide/svelte';
	import { openPopup } from '$lib/state/popupState.svelte';
	import { getImageUrl } from '$lib/api/images';
	import { getVideoUrl } from '$lib/api/videos';

	let {
		item,
		onDelete,
		onUpdate,
		onDuplicate,
		onUploadImage,
		onUploadVideo,
		onAdd,
		onCancel
	}: {
		item: ContentItemState;
		onDelete: (id: number) => void;
		onUpdate: <K extends keyof ContentItemState>(
			id: number,
			value: ContentItemState[K],
			key: K
		) => Promise<void>;
		onDuplicate: (item: ContentItemState) => Promise<void>;
		onUploadImage: (itemId: number, file: File) => Promise<void>;
		onUploadVideo: (itemId: number, file: File) => Promise<void>;
		onAdd: () => Promise<void>;
		onCancel: () => void;
	} = $props();

	let isAdding = $state(false);
	let isCreateMode = $derived(item.id === -1);
	// svelte-ignore state_referenced_locally
	let isCollapsed = $state(item.id !== -1);

	let imageInputRef = $state<HTMLInputElement | null>(null);
	let videoInputRef = $state<HTMLInputElement | null>(null);

	async function handleAdd() {
		if (isAdding) return;
		isAdding = true;
		try {
			await onAdd();
		} finally {
			isAdding = false;
		}
	}

	async function handleImageUpload(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (file) {
			await onUploadImage(item.id, file);
		}
		input.value = '';
	}

	async function handleVideoUpload(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (file) {
			await onUploadVideo(item.id, file);
		}
		input.value = '';
	}
</script>

<article class="content-item" class:create-mode={isCreateMode}>
	<div class="item-header">
		{#if !isCreateMode}
			<button class="collapse-btn" onclick={() => (isCollapsed = !isCollapsed)}>
				{#if isCollapsed}
					<ChevronRight size={18} />
				{:else}
					<ChevronDown size={18} />
				{/if}
			</button>
		{/if}
		<EditableOrder value={item.order ?? 1} onSave={(order) => onUpdate(item.id, order, 'order')} />
		<span class="separator"></span>
		<EditableTitle value={item.key} label="key" onSave={(key) => onUpdate(item.id, key, 'key')} />
		<span class="type-badge">{item.type}</span>
		{#if !isCreateMode}
			<Button variant="secondary" onclick={() => onDuplicate(item)}>
				<Copy size={16} />
			</Button>
		{/if}
		{#if !isCreateMode}
			<Button
				variant="danger"
				onclick={() =>
					openPopup({
						title: 'Delete Content',
						description: `Are you sure you want to delete "${item.key}"?`,
						onOk: () => onDelete(item.id)
					})}
			>
				<Trash2 size={16} color="white" />
			</Button>
		{/if}
	</div>

	{#if !isCollapsed}
		<div class="item-content">
			{#if item.type === 'text'}
				<EditableDescription
					value={item.value ?? ''}
					onSave={(value) => onUpdate(item.id, value, 'value')}
				/>
			{:else if item.type === 'image'}
				{#if item.value}
					<div class="media-preview">
						<img src={getImageUrl(item.value)} alt={item.key} class="preview-image" />
					</div>
				{/if}
				{#if !isCreateMode}
					<input
						bind:this={imageInputRef}
						type="file"
						accept="image/*"
						onchange={handleImageUpload}
						hidden
					/>
					<Button variant="secondary" onclick={() => imageInputRef?.click()}>
						<Upload size={16} />
					</Button>
				{/if}
			{:else if item.type === 'video'}
				{#if item.value}
					<div class="media-preview">
						<!-- svelte-ignore a11y_media_has_caption -->
						<video src={getVideoUrl(item.value)} controls class="preview-video"></video>
					</div>
				{/if}
				{#if !isCreateMode}
					<input
						bind:this={videoInputRef}
						type="file"
						accept="video/*"
						onchange={handleVideoUpload}
						hidden
					/>
					<Button variant="secondary" onclick={() => videoInputRef?.click()}>
						<Upload size={16} />
					</Button>
				{/if}
			{/if}
		</div>

		{#if isCreateMode}
			<div class="item-actions">
				<Button variant="secondary" onclick={onCancel}>
					<X size={18} />
				</Button>
				<Button
					variant="primary"
					onclick={handleAdd}
					loading={isAdding}
					disabled={!item.key?.trim()}
				>
					<Check size={18} />
				</Button>
			</div>
		{/if}
	{/if}
</article>

<style>
	.content-item {
		background-color: var(--color-surface);
		border-radius: 8px;
		padding: 16px;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.content-item.create-mode {
		border: 1px dashed var(--color-primary);
	}

	.item-header {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.collapse-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--color-text-muted);
		padding: 4px;
		border-radius: 4px;
	}

	.collapse-btn:hover {
		color: var(--color-text);
		background-color: var(--color-hover);
	}

	.separator {
		width: 2px;
		height: 20px;
		background-color: var(--color-text-muted);
		opacity: 0.3;
	}

	.type-badge {
		font-size: 11px;
		font-weight: 600;
		text-transform: uppercase;
		color: var(--color-text-muted);
		background-color: var(--color-bg-gray);
		padding: 2px 8px;
		border-radius: 4px;
		margin-left: auto;
	}

	.item-content {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.media-preview {
		max-width: 300px;
		border-radius: 4px;
		overflow: hidden;
	}

	.preview-image {
		width: 100%;
		height: auto;
		display: block;
	}

	.preview-video {
		width: 100%;
		height: auto;
		display: block;
	}

	.item-actions {
		display: flex;
		gap: 8px;
		margin-left: auto;
	}
</style>
