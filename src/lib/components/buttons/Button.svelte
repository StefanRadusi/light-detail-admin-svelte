<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import SmallLoadingAnimation from '../loading-animations/small-loading-animation.svelte';

	let {
		children,
		loading = false,
		variant = 'primary',
		...rest
	}: { children: Snippet; loading?: boolean; variant?: 'primary' | 'secondary' | 'danger' } & HTMLButtonAttributes =
		$props();
</script>

<button class:secondary={variant === 'secondary'} class:danger={variant === 'danger'} {...rest} disabled={loading || rest.disabled}>
	<span class="content" class:hidden={loading}>
		{@render children()}
	</span>
	<span class="loader">
		<SmallLoadingAnimation visible={loading} />
	</span>
</button>

<style>
	button {
		position: relative;
		padding: 8px;
		background-color: var(--color-primary);
		color: var(--color-text);
		border: none;
		border-radius: 4px;
		font-size: var(--font-size-body);
		font-weight: 600;
		cursor: pointer;
		transition: opacity 0.2s;
		display: flex;
	}

	.content {
		display: flex;
		transition: opacity 0.2s;
		align-items: center;
	}

	.content.hidden {
		opacity: 0;
	}

	.loader {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	button:hover:not(:disabled) {
		opacity: 0.9;
	}

	button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	button.secondary {
		background-color: transparent;
		border: 2px solid var(--color-primary);
		color: var(--color-primary);
	}

	button.danger {
		background-color: var(--color-danger, #dc2626);
	}
</style>
