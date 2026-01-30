<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	let {
		label,
		value = $bindable(''),
		...rest
	}: { label: string; value?: string } & HTMLInputAttributes = $props();
</script>

<div class="field">
	<label for={rest.id}>{label}</label>
	<input bind:value {...rest} />
</div>

<style>
	.field {
		display: flex;
		border-bottom: 1px solid var(--color-border);
		align-items: center;
		transition: border-color 0.3s ease;
		gap: 10px;
	}

	.field:focus-within {
		border-bottom-color: var(--color-primary);
	}

	label {
		display: block;
		color: var(--color-text);
		font-size: var(--font-size-body);
	}

	input {
		width: 100%;
		padding: 12px;
		border: none;
		border-radius: 4px;
		font-size: var(--font-size-body);
		font-family: inherit;
		color: var(--color-text-muted);
		outline: none;
	}

	input:disabled {
		background-color: var(--color-surface);
		cursor: not-allowed;
	}
</style>
