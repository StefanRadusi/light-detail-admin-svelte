<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import clsx from 'clsx';
	import { onMount } from 'svelte';

	let {
		label,
		value = $bindable(''),
		class: className,
		focusOnMount = false,
		...rest
	}: { label?: string; value?: string; class?: string; focusOnMount?: boolean } & HTMLInputAttributes = $props();

	let inputRef: HTMLInputElement;

	onMount(() => {
		if (focusOnMount) {
			inputRef?.focus();
		}
	});
</script>

<div class={clsx('field', className)}>
	{#if label}
		<label for={rest.id}>{label}</label>
	{/if}
	<input bind:this={inputRef} bind:value {...rest} />
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
