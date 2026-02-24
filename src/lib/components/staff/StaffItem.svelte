<script lang="ts">
	import type { StaffState } from '$lib/api/types';
	import { Button, EditableTitle, EditableDescription } from '$lib';
	import { Trash2, X, Upload } from '@lucide/svelte';
	import { openPopup } from '$lib/state/popupState.svelte';
	import { getImageUrl } from '$lib/api';

	let {
		staff,
		onDelete,
		onUploadCover,
		onUpdate,
		onAdd,
		onCancel
	}: {
		staff: StaffState;
		onDelete?: (id: number) => void;
		onUploadCover?: (staffId: number, file: File) => Promise<void>;
		onUpdate: <K extends keyof StaffState>(staffId: number, value: StaffState[K], key: K) => Promise<void>;
		onAdd?: () => Promise<void>;
		onCancel?: () => void;
	} = $props();

	let isAdding = $state(false);
	let isUploading = $state(false);

	// svelte-ignore non_reactive_update
	let fileInput: HTMLInputElement;

	async function handleAdd() {
		if (!onAdd || isAdding) return;
		isAdding = true;
		try {
			await onAdd();
		} finally {
			isAdding = false;
		}
	}

	async function handleFileSelect() {
		const file = fileInput.files?.[0];
		if (!file || !onUploadCover) return;

		isUploading = true;
		try {
			await onUploadCover(staff.id, file);
		} finally {
			isUploading = false;
			fileInput.value = '';
		}
	}

	let isCreateMode = $derived(staff.id === -1);
</script>

<article class="staff-item flex-row" class:create-mode={isCreateMode}>
	<div class="cover-container">
		{#if staff.coverImageUrl}
			<img src={getImageUrl(staff.coverImageUrl)} alt={staff.name} class="cover" />
		{:else}
			<div class="cover placeholder"></div>
		{/if}
		{#if !isCreateMode}
			<input
				type="file"
				accept="image/*"
				bind:this={fileInput}
				onchange={handleFileSelect}
				hidden
			/>
			<Button
				variant="secondary"
				class="upload-cover-btn"
				loading={isUploading}
				onclick={() => fileInput.click()}
			>
				<Upload size={16} />
			</Button>
		{/if}
	</div>

	<div class="info-container flex-col">
		<div class="content">
			<EditableTitle
				label="name"
				value={staff.name}
				onSave={(name) => onUpdate(staff.id, name, 'name')}
			/>
			<EditableTitle
				label="author"
				value={staff.author ?? ''}
				onSave={(author) => onUpdate(staff.id, author, 'author')}
			/>
			<EditableDescription
				value={staff.description ?? ''}
				onSave={(description: string) => onUpdate(staff.id, description, 'description')}
			/>

			<div class="actions">
				{#if isCreateMode}
					<Button variant="secondary" onclick={onCancel}>
						<X size={18} />
					</Button>
					<Button
						variant="primary"
						onclick={handleAdd}
						loading={isAdding}
						disabled={!staff.name?.trim()}>Add Staff</Button
					>
				{:else}
					<Button
						variant="danger"
						onclick={() =>
							openPopup({
								title: 'Delete Staff',
								description: `Are you sure you want to delete "${staff.name}"?`,
								onOk: () => onDelete?.(staff.id)
							})}
					>
						<Trash2 size={18} color="white" />
					</Button>
				{/if}
			</div>
		</div>
	</div>
</article>

<style>
	.staff-item {
		background-color: var(--color-surface);
		border-radius: 8px;
		overflow: hidden;
	}

	.staff-item.create-mode {
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

	.cover-container :global(.upload-cover-btn) {
		position: absolute;
		bottom: 8px;
		right: 8px;
		padding: 6px;
		min-width: unset;
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
