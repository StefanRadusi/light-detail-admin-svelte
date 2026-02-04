<script lang="ts">
	import { Body, SmallLoadingAnimation, ActionButton } from '$lib';
	import { Pencil, Check, X, Plus, Minus } from '@lucide/svelte';

	let {
		value = 0,
		onSave
	}: {
		value?: number;
		onSave: (newValue: number) => Promise<void>;
	} = $props();

	let isEmpty = $derived(value === 0);

	let isEditing = $state(false);
	let isSaving = $state(false);
	let editValue = $state(1);

	function startEditing() {
		editValue = value || 1;
		isEditing = true;
	}

	function increment() {
		if (isSaving) return;
		editValue++;
	}

	function decrement() {
		if (isSaving) return;
		editValue--;
	}

	async function save() {
		if (editValue !== value) {
			isSaving = true;
			try {
				await onSave(editValue);
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
		} else if (event.key === 'ArrowUp') {
			event.preventDefault();
			increment();
		} else if (event.key === 'ArrowDown') {
			event.preventDefault();
			decrement();
		}
	}
</script>

<div class="editable-order">
	{#if isEditing}
		<div class="number-input">
			<button
				class="stepper-btn minus"
				onclick={decrement}
				disabled={isSaving}
				aria-label="Decrease"
			>
				<Minus size={14} />
			</button>
			<input
				type="number"
				bind:value={editValue}
				onkeydown={handleKeydown}
				disabled={isSaving}
			/>
			<button
				class="stepper-btn plus"
				onclick={increment}
				disabled={isSaving}
				aria-label="Increase"
			>
				<Plus size={14} />
			</button>
		</div>
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
			Add order
		</button>
	{:else}
		<Body class="order-value">{value}</Body>
		<ActionButton variant="edit" onclick={startEditing} aria-label="Edit order">
			<Pencil size={14} />
		</ActionButton>
	{/if}
</div>

<style>
	.editable-order {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.editable-order :global(.order-value) {
		min-width: 24px;
		text-align: center;
	}

	.number-input {
		display: flex;
		align-items: center;
		gap: 2px;
	}

	.number-input input {
		width: 48px;
		text-align: center;
		font-size: var(--font-size-body);
		font-family: inherit;
		color: var(--color-text);
		border: none;
		border-bottom: 2px solid var(--color-primary);
		background: transparent;
		outline: none;
		padding: 4px;
		appearance: textfield;
		-moz-appearance: textfield;
	}

	.number-input input::-webkit-outer-spin-button,
	.number-input input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	.stepper-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 4px;
		border-radius: 4px;
		transition: background-color 0.2s ease;
	}

	.stepper-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.stepper-btn.plus {
		color: var(--color-success);
	}

	.stepper-btn.plus:hover:not(:disabled) {
		background-color: rgba(34, 197, 94, 0.1);
	}

	.stepper-btn.minus {
		color: var(--color-error);
	}

	.stepper-btn.minus:hover:not(:disabled) {
		background-color: rgba(239, 68, 68, 0.1);
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
