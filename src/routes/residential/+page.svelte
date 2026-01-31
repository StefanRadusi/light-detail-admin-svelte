<script lang="ts">
	import { deleteProject } from '$lib/api/projects';
	import { PageContent, ProjectItem } from '$lib';

	let { data } = $props();
	// svelte-ignore state_referenced_locally
	let projects = $state(data.projects);

	async function handleDelete(id: number) {
		await deleteProject(id);
		projects = projects.filter((p) => p.id !== id);
	}
</script>

<PageContent title="Residential" subtitle="PROJECTS">
	<div class="flex-col projects-list">
		{#each projects as project (project.id)}
			<ProjectItem {project} onDelete={handleDelete} />
		{/each}
	</div>
</PageContent>

<style>
	.projects-list {
		gap: 24px;
	}
</style>
