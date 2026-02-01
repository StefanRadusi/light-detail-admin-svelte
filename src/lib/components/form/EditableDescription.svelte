<script lang="ts">
	import { Body, SmallLoadingAnimation, ActionButton } from '$lib';
	import { Pencil, Check, X, Plus } from '@lucide/svelte';

	const MAX_CHARS = 100;

	let {
		value = '',
		onSave
	}: {
		value?: string;
		onSave: (newValue: string) => Promise<void>;
	} = $props();

	let isEmpty = $derived(!value);

	let isExpanded = $state(false);
	let isEditing = $state(false);
	let isSaving = $state(false);
	let editValue = $state('');
	let textareaRef = $state<HTMLTextAreaElement | null>(null);

	let isTruncated = $derived(value.length > MAX_CHARS);
	let displayValue = $derived(isTruncated && !isExpanded ? value.slice(0, MAX_CHARS) : value);

	function toggleExpand() {
		isExpanded = !isExpanded;
	}

	function startEditing() {
		editValue = value ?? '';
		isEditing = true;
	}

	async function save() {
		if (editValue.trim() !== value) {
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
		if (event.key === 'Escape') {
			cancel();
		}
	}

	function handleInput() {
		if (textareaRef) {
			textareaRef.style.height = 'auto';
			textareaRef.style.height = textareaRef.scrollHeight + 'px';
		}
	}

	$effect(() => {
		if (isEditing && textareaRef) {
			textareaRef.focus();
			textareaRef.style.height = 'auto';
			textareaRef.style.height = textareaRef.scrollHeight + 'px';
		}
	});
</script>

<div class="editable-description">
	{#if isEditing}
		<textarea
			bind:this={textareaRef}
			bind:value={editValue}
			onkeydown={handleKeydown}
			oninput={handleInput}
			class="edit-textarea"
			rows="3"
			disabled={isSaving}
		></textarea>
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
	{:else if isEmpty}
		<button class="add-btn" onclick={startEditing}>
			<Plus size={14} />
			Add description
		</button>
	{:else}
		<Body class="description">
			{displayValue}{#if isTruncated}<button class="expand-btn" onclick={toggleExpand}
					>{isExpanded ? ' less' : '...'}</button
				>{/if}
		</Body>

		<ActionButton variant="edit" onclick={startEditing} aria-label="Edit description">
			<Pencil size={14} />
		</ActionButton>
	{/if}
</div>

<style>
	.editable-description {
		display: flex;
		align-items: flex-end;
		gap: 8px;
	}

	.editable-description :global(.description) {
		white-space: pre-wrap;
	}

	.edit-textarea {
		flex: 1;
		font-size: var(--font-size-body);
		font-family: inherit;
		color: var(--color-text);
		border: none;
		border-bottom: 2px solid var(--color-primary);
		background: transparent;
		outline: none;
		padding: 4px;
		resize: none;
		line-height: 1.5;
		overflow: hidden;
	}

	.edit-actions {
		display: flex;
		gap: 4px;
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

	.expand-btn {
		color: var(--color-primary);
		font-size: var(--font-size-body);
		font-weight: 400;
		margin-left: 10px;
	}

	.expand-btn:hover {
		text-decoration: underline;
	}
</style>
