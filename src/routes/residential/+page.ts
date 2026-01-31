import { getProjectsByType } from '$lib/api/projects';

export async function load({ fetch }) {
	const projects = await getProjectsByType('residential', fetch);
	return { projects };
}
