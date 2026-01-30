<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import clsx from 'clsx';

	let {
		children,
		class: className,
		...rest
	}: { children: Snippet } & HTMLAttributes<HTMLDivElement> = $props();
</script>

<div class={clsx('row', className)} {...rest}>
	{@render children()}
</div>

<style>
	.row {
		display: flex;
		flex-direction: row;
	}
</style>
