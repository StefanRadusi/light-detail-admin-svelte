<script lang="ts">
	import { uploadImage, getImageId, deleteImage } from '$lib/api/images';
	import { deleteStaff, updateStaff, addStaff } from '$lib/api/staff';
	import { PageContent, Button } from '$lib';
	import StaffItem from './StaffItem.svelte';
	import type { Staff, StaffState } from '$lib/api/types';
	import { invalidateAll } from '$app/navigation';
	import { Plus } from '@lucide/svelte';
	import { showSnackbar } from '$lib/state/snackbarState.svelte';

	let {
		title,
		staffList: initialStaffList
	}: {
		title: string;
		staffList: Staff[];
	} = $props();

	let newStaff = $state<StaffState | null>(null);

	function handleStartCreate() {
		newStaff = {
			id: -1,
			name: '',
			author: undefined,
			description: undefined,
			coverImageUrl: undefined
		};
	}

	function handleCancelCreate() {
		newStaff = null;
	}

	async function handleAdd() {
		if (!newStaff) return;
		const { id, ...input } = newStaff;
		await addStaff(input);
		await invalidateAll();
		newStaff = null;
		staffList = initialStaffList;
		showSnackbar('New staff added', 'success');
	}

	function handleNewStaffUpdate<K extends keyof StaffState>(
		_id: number,
		value: StaffState[K],
		key: K
	) {
		if (newStaff) newStaff[key] = value;
		return Promise.resolve();
	}

	// svelte-ignore state_referenced_locally
	let staffList = $state(initialStaffList);

	async function handleDelete(id: number) {
		await deleteStaff(id);
		staffList = staffList.filter((s) => s.id !== id);
		showSnackbar('Staff deleted', 'success');
	}

	async function handleUploadCover(staffId: number, file: File) {
		const { filename } = await uploadImage(file);

		const idx = staffList.findIndex((s) => s.id === staffId);
		// Delete old cover image if exists
		if (staffList[idx].coverImageUrl) {
			await deleteImage(getImageId(staffList[idx].coverImageUrl!)).catch(() => {});
		}
		await updateStaff(staffId, { coverImageUrl: filename });
		staffList[idx].coverImageUrl = filename;
		showSnackbar('Cover image updated', 'success');
	}

	async function handleUpdateField<K extends keyof StaffState>(
		staffId: number,
		value: StaffState[K],
		key: K
	) {
		await updateStaff(staffId, { [key]: value });
		const idx = staffList.findIndex((s) => s.id === staffId);
		(staffList[idx] as StaffState)[key] = value;
		showSnackbar('Staff updated', 'success');
	}
</script>

<PageContent {title} subtitle="STAFF">
	{#snippet action()}
		<Button variant="primary" onclick={handleStartCreate}>
			<Plus size={18} color="white" />
		</Button>
	{/snippet}
	<div class="flex-col staff-list">
		{#if newStaff}
			<StaffItem
				staff={newStaff}
				onAdd={handleAdd}
				onCancel={handleCancelCreate}
				onUpdate={handleNewStaffUpdate}
			/>
		{/if}
		{#each staffList as staff (staff.id)}
			<StaffItem
				{staff}
				onDelete={handleDelete}
				onUploadCover={handleUploadCover}
				onUpdate={handleUpdateField}
			/>
		{/each}
	</div>
</PageContent>

<style>
	.staff-list {
		gap: 24px;
	}
</style>
