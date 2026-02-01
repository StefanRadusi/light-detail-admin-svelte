<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	let { children, ...rest }: { children: Snippet } & HTMLButtonAttributes = $props();
</script>

<button {...rest}>
	{@render children()}
</button>

<style>
	button {
		background-color: rgba(0, 0, 0, 0.6);
		border-radius: 4px;
		color: white;
		padding: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	button:hover {
		background-color: rgba(0, 0, 0, 0.7);
	}
</style>
