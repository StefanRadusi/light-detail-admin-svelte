<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import SmallLoadingAnimation from '../loading-animations/small-loading-animation.svelte';

	let {
		children,
		loading = false,
		...rest
	}: { children: Snippet; loading?: boolean } & HTMLButtonAttributes = $props();
</script>

<button {...rest} disabled={loading || rest.disabled}>
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
		padding: 12px;
		background-color: var(--color-primary);
		color: var(--color-text);
		border: none;
		border-radius: 4px;
		font-size: var(--font-size-body);
		font-weight: 600;
		cursor: pointer;
		transition: opacity 0.2s;
	}

	.content {
		transition: opacity 0.2s;
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
</style>
