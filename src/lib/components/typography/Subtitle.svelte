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

<h2 class={clsx('subtitle', className)} {...rest}>
	{@render children()}
</h2>

<style>
	.subtitle {
		font-size: var(--font-size-subtitle);
		font-weight: 600;
		line-height: 1.3;
	}
</style>
