<script lang="ts">
	import { uploadImage } from '$lib/api/images';
	import { uploadVideo } from '$lib/api/videos';
	import { addContent, updateContent, deleteContent } from '$lib/api/content';
	import { PageContent } from '$lib';
	import type { ContentItem, ContentItemState, ContentType } from '$lib/api/types';
	import { invalidateAll } from '$app/navigation';
	import AddMenu from './AddMenu.svelte';
	import { showSnackbar } from '$lib/state/snackbarState.svelte';
	import ContentSection from './ContentSection.svelte';
	import ContentItemCard from './ContentItemCard.svelte';

	let {
		title,
		contentTree: initialContentTree
	}: {
		title: string;
		contentTree: ContentItem[];
	} = $props();

	// svelte-ignore state_referenced_locally
	let contentTree = $state(initialContentTree);
	let newItem = $state<ContentItemState | null>(null);
	let newItemEl = $state<HTMLDivElement | null>(null);
	const rootTypes: ContentType[] = ['section', 'text', 'image', 'video'];

	function handleStartCreate(type: string) {
		newItem = {
			id: -1,
			key: '',
			value: undefined,
			type: type as ContentType,
			parentId: undefined,
			order: 1,
			metadata: undefined
		};
	}

	$effect(() => {
		if (newItemEl) {
			newItemEl.scrollIntoView({ behavior: 'smooth', block: 'end' });
		}
	});

	function handleCancelCreate() {
		newItem = null;
	}

	async function handleAdd() {
		if (!newItem) return;
		const { id, children, ...input } = newItem;
		await addContent(input);
		await invalidateAll();
		newItem = null;
		contentTree = initialContentTree;
		showSnackbar('Content item added', 'success');
	}

	async function duplicateTree(item: ContentItemState, parentId?: number, isRoot = true) {
		const created = await addContent({
			key: isRoot ? `${item.key} (copy)` : item.key,
			type: item.type,
			value: item.value,
			parentId,
			order: item.order,
			metadata: item.metadata
		});
		if (item.children) {
			for (const child of item.children) {
				await duplicateTree(child as ContentItemState, created.id, false);
			}
		}
	}

	function handleNewItemUpdate<K extends keyof ContentItemState>(
		_id: number,
		value: ContentItemState[K],
		key: K
	) {
		if (newItem) (newItem as Record<string, unknown>)[key] = value;
		return Promise.resolve();
	}

	async function handleDelete(id: number) {
		await deleteContent(id);
		await invalidateAll();
		contentTree = initialContentTree;
		showSnackbar('Content deleted', 'success');
	}

	async function handleUpdate<K extends keyof ContentItemState>(
		id: number,
		value: ContentItemState[K],
		key: K
	) {
		await updateContent(id, { [key]: value });
		await invalidateAll();
		contentTree = initialContentTree;
		showSnackbar('Content updated', 'success');
	}

	async function handleAddChild(parentId: number, type: ContentType, key: string, value?: string) {
		await addContent({ key, type, parentId, value });
		await invalidateAll();
		contentTree = initialContentTree;
		showSnackbar('Child item added', 'success');
	}

	async function handleUploadImage(itemId: number, file: File) {
		const { filename } = await uploadImage(file);
		await updateContent(itemId, { value: filename });
		await invalidateAll();
		contentTree = initialContentTree;
		showSnackbar('Image uploaded', 'success');
	}

	async function handleDuplicate(item: ContentItemState) {
		await duplicateTree(item, item.parentId);
		await invalidateAll();
		contentTree = initialContentTree;
		showSnackbar('Content duplicated', 'success');
	}

	async function handleUploadVideo(itemId: number, file: File) {
		const { filename } = await uploadVideo(file);
		await updateContent(itemId, { value: filename });
		await invalidateAll();
		contentTree = initialContentTree;
		showSnackbar('Video uploaded', 'success');
	}
</script>

<PageContent {title} subtitle="CONTENT">
	<div class="flex-col content-list">
		{#each contentTree as item (item.id)}
			{#if item.type === 'section'}
				<ContentSection
					{item}
					onDelete={handleDelete}
					onUpdate={handleUpdate}
					onDuplicate={handleDuplicate}
					onAddChild={handleAddChild}
					onDeleteChild={handleDelete}
					onUpdateChild={handleUpdate}
					onDuplicateChild={handleDuplicate}
					onUploadImage={handleUploadImage}
					onUploadVideo={handleUploadVideo}
				/>
			{:else}
				<ContentItemCard
					{item}
					onDelete={handleDelete}
					onUpdate={handleUpdate}
					onDuplicate={handleDuplicate}
					onUploadImage={handleUploadImage}
					onUploadVideo={handleUploadVideo}
					onAdd={() => Promise.resolve()}
					onCancel={() => {}}
				/>
			{/if}
		{/each}
		{#if newItem}
			<div bind:this={newItemEl}>
				<ContentItemCard
					item={newItem}
					onAdd={handleAdd}
					onCancel={handleCancelCreate}
					onUpdate={handleNewItemUpdate}
					onDelete={() => {}}
					onDuplicate={() => Promise.resolve()}
					onUploadImage={() => Promise.resolve()}
					onUploadVideo={() => Promise.resolve()}
				/>
			</div>
		{/if}
		<AddMenu types={rootTypes} onSelect={handleStartCreate} />
	</div>
</PageContent>

<style>
	.content-list {
		gap: 24px;
	}
</style>
