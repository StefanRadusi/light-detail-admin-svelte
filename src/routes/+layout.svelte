<script lang="ts">
	import '../app.css';
	import { Header } from '$lib';
	import ImagePreview from '$lib/components/overlays/ImagePreview.svelte';
	import Popup from '$lib/components/overlays/Popup.svelte';
	import Snackbar from '$lib/components/overlays/Snackbar.svelte';

	let { children } = $props();
</script>

<div class="app-container">
	<Header />
	<main class="page-container">
		{@render children()}
	</main>
</div>

<ImagePreview />
<Popup />
<Snackbar />

<style>
	.app-container {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	.page-container {
		flex: 1;
		display: flex;
		flex-direction: column;
	}
</style>
