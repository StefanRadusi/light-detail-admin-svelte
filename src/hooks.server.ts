import { PUBLIC_API_BASE_URL } from '$env/static/public';
import { redirect, type Handle, type HandleServerError } from '@sveltejs/kit';

const publicRoutes = ['/login'];

export const handle: Handle = async ({ event, resolve }) => {
	const isPublicRoute = publicRoutes.some((route) => event.url.pathname.startsWith(route));

	// Check session with better-auth
	const sessionResponse = await fetch(`${PUBLIC_API_BASE_URL}/api/auth/get-session`, {
		headers: {
			cookie: event.request.headers.get('cookie') || ''
		}
	});

	console.log(sessionResponse);

	const session = sessionResponse.ok ? await sessionResponse.json() : null;

	const isLoggedIn = !!session?.user;
	const isAdmin = session?.user?.role === 'admin';

	// Redirect to login if not authenticated or not admin
	if ((!isLoggedIn || !isAdmin) && !isPublicRoute) {
		throw redirect(302, '/login');
	}

	// Redirect to residential if logged in as admin and accessing login page
	if (isLoggedIn && isAdmin && event.url.pathname === '/login') {
		throw redirect(302, '/residential');
	}

	// Redirect root to residential (if admin) or login
	if (event.url.pathname === '/') {
		throw redirect(302, isLoggedIn && isAdmin ? '/residential' : '/login');
	}

	return resolve(event);
};

export const handleError: HandleServerError = ({ error }) => {
	console.error('Error:', error);
	return {
		message: 'Internal Error'
	};
};
