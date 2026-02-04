<script lang="ts">
	import { Input, Subtitle, SmallLoadingAnimation, ActionButton } from '$lib';
	import { Pencil, Check, X, Plus } from '@lucide/svelte';

	let {
		value = '',
		onSave
	}: {
		value?: string;
		onSave: (newValue: string) => Promise<void>;
	} = $props();

	let isEmpty = $derived(!value);

	let isEditing = $state(false);
	let isSaving = $state(false);
	let editValue = $state('');

	function startEditing() {
		editValue = value ?? '';
		isEditing = true;
	}

	async function save() {
		if (editValue.trim() && editValue !== value) {
			isSaving = true;
			try {
				await onSave(editValue.trim());
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
			save();
		} else if (event.key === 'Escape') {
			cancel();
		}
	}
</script>

<div class="editable-title">
	{#if isEditing}
		<Input
			bind:value={editValue}
			onkeydown={handleKeydown}
			class="edit-input"
			focusOnMount
			disabled={isSaving}
		/>
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
	{:else if isEmpty}
		<button class="add-btn" onclick={startEditing}>
			<Plus size={14} />
			Add title
		</button>
	{:else}
		<Subtitle>{value}</Subtitle>
		<ActionButton variant="edit" onclick={startEditing} aria-label="Edit title">
			<Pencil size={14} />
		</ActionButton>
	{/if}
</div>

<style>
	.editable-title {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.editable-title :global(.edit-input) {
		flex: 1;
	}

	.editable-title :global(.edit-input input) {
		font-size: var(--font-size-subtitle);
		font-weight: 600;
		color: var(--color-text);
		padding: 2px 0px;
	}

	.add-btn {
		display: flex;
		align-items: center;
		gap: 4px;
		color: var(--color-text-muted);
		font-size: var(--font-size-subtitle);
		font-weight: 600;
	}

	.add-btn:hover {
		color: var(--color-text);
	}
</style>
