<script lang="ts">
	import type { ContentItemState, ContentType } from '$lib/api/types';
	import { EditableTitle, EditableOrder, Button } from '$lib';
	import { Trash2, Copy, ChevronDown, ChevronRight } from '@lucide/svelte';
	import { openPopup } from '$lib/state/popupState.svelte';
	import ContentItemCard from './ContentItemCard.svelte';
	import ContentSectionSelf from './ContentSection.svelte';
	import AddMenu from './AddMenu.svelte';

	let {
		item,
		onDelete,
		onUpdate,
		onDuplicate,
		onAddChild,
		onDeleteChild,
		onUpdateChild,
		onDuplicateChild,
		onUploadImage,
		onUploadVideo
	}: {
		item: ContentItemState;
		onDelete: (id: number) => void;
		onUpdate: <K extends keyof ContentItemState>(
			id: number,
			value: ContentItemState[K],
			key: K
		) => Promise<void>;
		onDuplicate: (item: ContentItemState) => Promise<void>;
		onAddChild: (parentId: number, type: ContentType, key: string, value?: string) => Promise<void>;
		onDeleteChild: (id: number) => void;
		onUpdateChild: <K extends keyof ContentItemState>(
			id: number,
			value: ContentItemState[K],
			key: K
		) => Promise<void>;
		onDuplicateChild: (item: ContentItemState) => Promise<void>;
		onUploadImage: (itemId: number, file: File) => Promise<void>;
		onUploadVideo: (itemId: number, file: File) => Promise<void>;
	} = $props();

	let isCollapsed = $state(true);
	let children = $derived((item.children ?? []) as ContentItemState[]);
	let newChild = $state<ContentItemState | null>(null);
	let newChildEl = $state<HTMLDivElement | null>(null);

	const childTypes: ContentType[] = ['text', 'image', 'video', 'section'];

	$effect(() => {
		if (newChildEl) {
			newChildEl.scrollIntoView({ behavior: 'smooth', block: 'end' });
		}
	});

	function toggleCollapse() {
		isCollapsed = !isCollapsed;
	}

	function handleStartAddChild(type: string) {
		newChild = {
			id: -1,
			key: '',
			value: undefined,
			type: type as ContentType,
			parentId: item.id,
			order: 1,
			metadata: undefined
		};
	}

	function handleCancelAddChild() {
		newChild = null;
	}

	async function handleConfirmAddChild() {
		if (!newChild) return;
		await onAddChild(item.id, newChild.type, newChild.key, newChild.value);
		newChild = null;
	}

	function handleNewChildUpdate<K extends keyof ContentItemState>(
		_id: number,
		value: ContentItemState[K],
		key: K
	) {
		if (newChild) (newChild as Record<string, unknown>)[key] = value;
		return Promise.resolve();
	}
</script>

<div class="content-section">
	<div class="section-header">
		<button class="collapse-btn" onclick={toggleCollapse}>
			{#if isCollapsed}
				<ChevronRight size={18} />
			{:else}
				<ChevronDown size={18} />
			{/if}
		</button>
		<EditableOrder value={item.order ?? 0} onSave={(order) => onUpdate(item.id, order, 'order')} />
		<span class="separator"></span>
		<EditableTitle value={item.key} label="key" onSave={(key) => onUpdate(item.id, key, 'key')} />
		<span class="type-badge">{item.type}</span>

		<div class="section-actions">
			<Button variant="secondary" onclick={() => onDuplicate(item)}>
				<Copy size={16} />
			</Button>
			<Button
				variant="danger"
				onclick={() =>
					openPopup({
						title: 'Delete Section',
						description: `Are you sure you want to delete "${item.key}" and all its children?`,
						onOk: () => onDelete(item.id)
					})}
			>
				<Trash2 size={16} color="white" />
			</Button>
		</div>
	</div>

	{#if !isCollapsed}
		<div class="section-children">
			{#each children as child (child.id)}
				{#if child.type === 'section'}
					<ContentSectionSelf
						item={child}
						onDelete={onDeleteChild}
						onUpdate={onUpdateChild}
						onDuplicate={onDuplicateChild}
						{onAddChild}
						{onDeleteChild}
						{onUpdateChild}
						{onDuplicateChild}
						{onUploadImage}
						{onUploadVideo}
					/>
				{:else}
					<ContentItemCard
						item={child}
						onDelete={onDeleteChild}
						onUpdate={onUpdateChild}
						onDuplicate={onDuplicateChild}
						{onUploadImage}
						{onUploadVideo}
						onAdd={() => Promise.resolve()}
						onCancel={() => {}}
					/>
				{/if}
			{/each}
			{#if newChild}
				<div bind:this={newChildEl}>
					<ContentItemCard
						item={newChild}
						onAdd={handleConfirmAddChild}
						onCancel={handleCancelAddChild}
						onUpdate={handleNewChildUpdate}
						onDelete={() => {}}
						onDuplicate={() => Promise.resolve()}
						onUploadImage={() => Promise.resolve()}
						onUploadVideo={() => Promise.resolve()}
					/>
				</div>
			{:else if children.length === 0}
				<p class="empty-message">No items yet.</p>
			{/if}
			<AddMenu types={childTypes} label="Add item" onSelect={handleStartAddChild} />
		</div>
	{/if}
</div>

<style>
	.content-section {
		background-color: var(--color-surface);
		border-radius: 8px;
	}

	.section-header {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 16px;
	}

	.collapse-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--color-text-muted);
		padding: 4px;
		border-radius: 4px;
	}

	.collapse-btn:hover {
		color: var(--color-text);
		background-color: var(--color-hover);
	}

	.separator {
		width: 2px;
		height: 20px;
		background-color: var(--color-text-muted);
		opacity: 0.3;
	}

	.type-badge {
		font-size: 11px;
		font-weight: 600;
		text-transform: uppercase;
		color: var(--color-text-muted);
		background-color: var(--color-bg-gray, var(--color-hover));
		padding: 2px 8px;
		border-radius: 4px;
	}

	.section-actions {
		display: flex;
		gap: 8px;
		margin-left: auto;
	}

	.section-children {
		padding: 0 16px 16px 40px;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.empty-message {
		color: var(--color-text-muted);
		font-size: var(--font-size-body);
		font-style: italic;
	}
</style>
