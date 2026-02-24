import { getContentTree } from '$lib/api/content';

export async function load({ fetch }) {
	const contentTree = await getContentTree(fetch);
	return { contentTree };
}
