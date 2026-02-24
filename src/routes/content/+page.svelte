<script lang="ts">
	import { ContentPage } from '$lib';
	let { data } = $props();
</script>

<ContentPage title="Content" contentTree={data.contentTree} />
