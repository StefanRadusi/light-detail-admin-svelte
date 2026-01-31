<script lang="ts">
	import { getPopup, handleCancel, handleOk } from '$lib/state/popupState.svelte';
	import { fade } from 'svelte/transition';
	import { Button, Subtitle, Body } from '$lib';

	let popup = $derived(getPopup());
</script>

{#if popup}
	<div
		class="popup-overlay"
		transition:fade={{ duration: 150 }}
		onclick={handleCancel}
		onkeydown={(e) => e.key === 'Escape' && handleCancel()}
		role="dialog"
		tabindex="-1"
	>
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<section class="popup" onclick={(e) => e.stopPropagation()} onkeydown={(e) => e.stopPropagation()}>
			<Subtitle>{popup.title}</Subtitle>
			<Body class="description">{popup.description}</Body>
			<div class="actions">
				<Button variant="secondary" onclick={handleCancel} disabled={popup.loading}>
					{popup.cancelText ?? 'Cancel'}
				</Button>
				<Button onclick={handleOk} loading={popup.loading}>
					{popup.okText ?? 'OK'}
				</Button>
			</div>
		</section>
	</div>
{/if}

<style>
	.popup-overlay {
		position: fixed;
		inset: 0;
		background-color: rgba(0, 0, 0, 0.7);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
	}

	.popup {
		background-color: var(--color-surface);
		border-radius: 8px;
		padding: 24px;
		max-width: 400px;
		width: 90%;
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.popup :global(.description) {
		color: var(--color-text-muted);
	}

	.actions {
		display: flex;
		gap: 12px;
		justify-content: flex-end;
		margin-top: 8px;
	}
</style>
