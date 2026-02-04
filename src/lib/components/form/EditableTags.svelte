<script lang="ts">
	import { SmallLoadingAnimation, ActionButton } from '$lib';
	import { Pencil, Check, X, Plus } from '@lucide/svelte';

	let {
		tags = [],
		onSave,
		placeholder = 'Add a tag...'
	}: {
		tags?: string[];
		onSave: (tags: string[]) => Promise<void>;
		placeholder?: string;
	} = $props();

	let isEmpty = $derived(tags.length === 0);

	let isEditing = $state(false);
	let isSaving = $state(false);
	let editTags = $state<string[]>([]);
	let inputValue = $state('');

	function startEditing() {
		editTags = [...tags];
		inputValue = '';
		isEditing = true;
	}

	function addTag() {
		const trimmed = inputValue.trim();
		if (trimmed && !editTags.includes(trimmed)) {
			editTags = [...editTags, trimmed];
			inputValue = '';
		}
	}

	function removeTag(tag: string) {
		editTags = editTags.filter((t) => t !== tag);
	}
	async function save() {
		const tagsChanged = JSON.stringify(editTags) !== JSON.stringify(tags);
		if (tagsChanged) {
			isSaving = true;
			try {
				await onSave(editTags);
				isEditing = false;
			} finally {
				isSaving = false;
			}
		} else {
			isEditing = false;
		}
	}

	function cancel() {
		if (isSaving) return;
		isEditing = false;
	}

	function handleKeydown(event: KeyboardEvent) {
		if (isSaving) return;
		if (event.key === 'Enter') {
			event.preventDefault();
			addTag();
		} else if (event.key === 'Escape') {
			cancel();
		} else if (event.key === 'Backspace' && inputValue === '' && editTags.length > 0) {
			editTags = editTags.slice(0, -1);
		}
	}
</script>

<div class="editable-tags">
	{#if isEditing}
		<div class="edit-container">
			<div class="tags-input">
				{#each editTags as tag}
					<span class="tag">
						{tag}
						<button
							type="button"
							class="remove-btn"
							aria-label="Remove tag"
							onclick={() => removeTag(tag)}
							disabled={isSaving}
						>
							<X size={12} />
						</button>
					</span>
				{/each}
				<input
					bind:value={inputValue}
					type="text"
					{placeholder}
					onkeydown={handleKeydown}
					disabled={isSaving}
				/>
			</div>
			<div class="edit-actions">
				<ActionButton variant="save" onclick={save} disabled={isSaving} aria-label="Save">
					{#if isSaving}
						<SmallLoadingAnimation />
					{:else}
						<Check size={16} />
					{/if}
				</ActionButton>
				<ActionButton variant="cancel" onclick={cancel} disabled={isSaving} aria-label="Cancel">
					<X size={16} />
				</ActionButton>
			</div>
		</div>
	{:else if isEmpty}
		<button class="add-btn" onclick={startEditing}>
			<Plus size={14} />
			Add tags
		</button>
	{:else}
		<div class="view-container">
			<div class="tags-list">
				{#each tags as tag}
					<span class="tag view">{tag}</span>
				{/each}
			</div>
			<ActionButton variant="edit" onclick={startEditing} aria-label="Edit tags">
				<Pencil size={14} />
			</ActionButton>
		</div>
	{/if}
</div>

<style>
	.editable-tags {
		display: flex;
		align-items: flex-start;
		gap: 8px;
	}

	.edit-container {
		display: flex;
		align-items: flex-start;
		gap: 8px;
		flex: 1;
	}

	.tags-input {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 8px;
		flex: 1;
		padding: 8px;
		border-bottom: 2px solid var(--color-primary);
	}

	.view-container {
		display: flex;
		align-items: flex-end;
		gap: 8px;
	}

	.tags-list {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.tag {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		padding: 4px 8px;
		background-color: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: 4px;
		font-size: 14px;
		color: var(--color-text);
	}

	.tag.view {
		background-color: var(--color-bg-gray);
	}

	.remove-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2px;
		border-radius: 2px;
		color: var(--color-text-muted);
		transition:
			color 0.2s ease,
			background-color 0.2s ease;
	}

	.remove-btn:hover:not(:disabled) {
		color: var(--color-error);
		background-color: rgba(239, 68, 68, 0.1);
	}

	.remove-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	input {
		flex: 1;
		min-width: 120px;
		padding: 4px 0;
		border: none;
		font-size: var(--font-size-body);
		font-family: inherit;
		color: var(--color-text);
		outline: none;
		background: transparent;
	}

	input::placeholder {
		color: var(--color-text-muted);
	}

	input:disabled {
		cursor: not-allowed;
	}

	.edit-actions {
		display: flex;
		gap: 4px;
		align-self: flex-end;
	}

	.add-btn {
		display: flex;
		align-items: center;
		gap: 4px;
		color: var(--color-text-muted);
		font-size: var(--font-size-body);
	}

	.add-btn:hover {
		color: var(--color-text);
	}
</style>
