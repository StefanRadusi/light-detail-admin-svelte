<script lang="ts">
	import { ProjectsPage } from '$lib';

	let { data } = $props();
</script>

<ProjectsPage title="Residential" type="residential" projects={data.projects} />
