<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import clsx from 'clsx';

	let {
		variant = 'default',
		children,
		class: className,
		...rest
	}: {
		variant?: 'default' | 'edit' | 'save' | 'cancel';
		children: Snippet;
		class?: string;
	} & HTMLButtonAttributes = $props();
</script>

<button class={clsx('action-btn', variant, className)} {...rest}>
	{@render children()}
</button>

<style>
	.action-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 4px;
		border-radius: 4px;
		transition: background-color 0.2s ease;
	}

	.action-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.action-btn.default {
		color: var(--color-text-muted);
	}

	.action-btn.default:hover:not(:disabled) {
		background-color: rgba(100, 116, 139, 0.1);
	}

	.action-btn.edit {
		color: var(--color-primary);
	}

	.action-btn.edit:hover:not(:disabled) {
		background-color: rgba(241, 180, 52, 0.1);
	}

	.action-btn.save {
		color: var(--color-success);
	}

	.action-btn.save:hover:not(:disabled) {
		background-color: rgba(34, 197, 94, 0.1);
	}

	.action-btn.cancel {
		color: var(--color-error);
	}

	.action-btn.cancel:hover:not(:disabled) {
		background-color: rgba(239, 68, 68, 0.1);
	}
</style>
