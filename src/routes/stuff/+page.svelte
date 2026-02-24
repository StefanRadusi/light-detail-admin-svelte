<script lang="ts">
	import { StaffPage } from '$lib';
	let { data } = $props();
</script>

<StaffPage title="Stuff" staffList={data.staffList} />
