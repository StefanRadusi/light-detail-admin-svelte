<script lang="ts">
	import { getSnackbarItems, dismissSnackbar } from '$lib/state/snackbarState.svelte';
	import { fly, fade } from 'svelte/transition';
	import { Check, X, Info } from '@lucide/svelte';

	let items = $derived(getSnackbarItems());

	const icons = {
		success: Check,
		error: X,
		info: Info
	};
</script>

<div class="snackbar-container">
	{#each items as item (item.id)}
		{@const Icon = icons[item.type]}
		<button
			class="snackbar {item.type}"
			in:fly={{ y: 40, duration: 250 }}
			out:fade={{ duration: 150 }}
			onclick={() => dismissSnackbar(item.id)}
		>
			<Icon size={18} />
			<span class="message">{item.message}</span>
		</button>
	{/each}
</div>

<style>
	.snackbar-container {
		position: fixed;
		bottom: 24px;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		flex-direction: column;
		gap: 8px;
		z-index: 1100;
		pointer-events: none;
	}

	.snackbar {
		pointer-events: auto;
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 12px 20px;
		border-radius: 8px;
		font-family: var(--font-sans);
		font-size: var(--font-size-body);
		color: #fff;
		box-shadow: var(--box-shadow);
		cursor: pointer;
		white-space: nowrap;
	}

	.snackbar.info {
		background-color: var(--color-text);
	}

	.snackbar.success {
		background-color: var(--color-success);
	}

	.snackbar.error {
		background-color: var(--color-error);
	}

</style>
