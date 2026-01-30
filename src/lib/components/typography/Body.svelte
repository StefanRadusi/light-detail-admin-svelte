<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import clsx from 'clsx';

	let {
		children,
		class: className,
		...rest
	}: { children: Snippet } & HTMLAttributes<HTMLParagraphElement> = $props();
</script>

<p class={clsx('body', className)} {...rest}>
	{@render children()}
</p>

<style>
	.body {
		font-size: var(--font-size-body);
		font-weight: 400;
		line-height: 1.5;
	}
</style>
