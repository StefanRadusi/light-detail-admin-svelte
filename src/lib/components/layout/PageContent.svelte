<script lang="ts">
	import { Title } from '$lib';
	import type { Snippet } from 'svelte';
	import Body from '../typography/Body.svelte';

	let { title, subtitle, children }: { title: string; subtitle: string; children: Snippet } =
		$props();
</script>

<div class="page-content">
	<div class="container">
		<div class="title-container">
			<Body class="subtitle">{subtitle}</Body>
			<div class="separator"></div>
			<Title class="title">{title}</Title>
		</div>

		<div></div>
		{@render children()}
	</div>
</div>

<style>
	.page-content {
		width: 100%;
	}

	.container {
		max-width: 1000px;
		margin: 0 auto;
		padding: 24px;
	}

	.title-container {
		display: flex;
		gap: 10px;
		margin: 20px 0px 40px 0px;
	}

	.title-container :global(.subtitle) {
		color: var(--color-text-muted);
	}

	.title-container :global(.title) {
		margin-top: 20px;
	}

	.separator {
		width: 4px;
		background: var(--color-primary);
	}
</style>
