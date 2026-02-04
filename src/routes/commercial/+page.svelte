<script lang="ts">
	import { ProjectsPage } from '$lib';

	let { data } = $props();
</script>

<ProjectsPage title="Commercial" type="commercial" projects={data.projects} />
