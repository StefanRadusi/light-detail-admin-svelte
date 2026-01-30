<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import clsx from 'clsx';

	let {
		children,
		class: className,
		...rest
	}: { children: Snippet } & HTMLAttributes<HTMLHeadingElement> = $props();
</script>

<h1 class={clsx('title', className)} {...rest}>
	{@render children()}
</h1>

<style>
	.title {
		font-size: var(--font-size-title);
		font-weight: 700;
		line-height: 1.2;
	}
</style>
