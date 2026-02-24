<script lang="ts">
	import { Plus } from '@lucide/svelte';

	let {
		types,
		label = 'Add content',
		onSelect
	}: {
		types: string[];
		label?: string;
		onSelect: (type: string) => void;
	} = $props();

	let showMenu = $state(false);
	let containerEl = $state<HTMLDivElement | null>(null);

	function handleSelect(type: string) {
		showMenu = false;
		onSelect(type);
	}

	function handleClickOutside(event: MouseEvent) {
		if (showMenu && containerEl && !containerEl.contains(event.target as Node)) {
			showMenu = false;
		}
	}
</script>

<svelte:document onmousedown={handleClickOutside} />

<div class="add-menu-container" bind:this={containerEl}>
	{#if showMenu}
		<div class="add-menu-options">
			{#each types as type}
				<button class="add-menu-option" onclick={() => handleSelect(type)}>
					<Plus size={14} />
					{type}
				</button>
			{/each}
		</div>
	{:else}
		<button
			class="add-menu-trigger"
			onmousedown={(e) => {
				e.stopPropagation();
				showMenu = true;
			}}
		>
			<Plus size={18} />
			<span>{label}</span>
		</button>
	{/if}
</div>

<style>
	.add-menu-container {
		width: 100%;
	}

	.add-menu-trigger {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		width: 100%;
		padding: 12px;
		border: 2px dashed var(--color-text-muted);
		border-radius: 8px;
		color: var(--color-text-muted);
		font-size: var(--font-size-body);
		transition: all 0.2s ease;
	}

	.add-menu-trigger:hover {
		border-color: var(--color-primary);
		color: var(--color-primary);
	}

	.add-menu-options {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		justify-content: center;
	}

	.add-menu-option {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 10px 16px;
		border: 1px solid var(--color-text-muted);
		border-radius: 8px;
		color: var(--color-text);
		font-size: var(--font-size-body);
		text-transform: capitalize;
		transition: all 0.2s ease;
	}

	.add-menu-option:hover {
		border-color: var(--color-primary);
		color: var(--color-primary);
	}
</style>
