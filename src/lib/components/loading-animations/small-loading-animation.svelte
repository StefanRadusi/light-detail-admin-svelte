<script lang="ts">
	import { fade } from 'svelte/transition';
	import clsx from 'clsx';

	let {
		class: className,
		visible = true,
		variant = 'default'
	}: { class?: string; visible?: boolean; variant?: 'default' | 'light' } = $props();
</script>

{#if visible}
	<svg
		transition:fade
		class={clsx('loading', variant === 'light' && 'light', className)}
		width="16"
		height="16"
		viewBox="0 0 48 48"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			class="draw"
			d="M15.5 45H3V3H32.5C38.5 3 44.5 8 44.5 14.5V34.5C44.5 40.5 38 45 33.5 45H25.5"
			stroke="currentColor"
			stroke-width="6"
		/>
	</svg>
{/if}

<style>
	.light .draw {
		stroke: var(--color-primary);
	}

	.draw {
		stroke-dasharray: 160;
		stroke-dashoffset: 160;
		animation: draw 1.5s ease-in-out infinite;
	}

	@keyframes draw {
		0% {
			stroke-dashoffset: 160;
		}
		50% {
			stroke-dashoffset: 0;
		}
		100% {
			stroke-dashoffset: -160;
		}
	}
</style>
