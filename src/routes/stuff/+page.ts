import { getStaff } from '$lib/api/staff';

export async function load({ fetch }) {
	const staffList = await getStaff(fetch);
	return { staffList };
}
