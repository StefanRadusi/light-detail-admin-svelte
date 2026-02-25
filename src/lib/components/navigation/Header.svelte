<script lang="ts">
	import { PUBLIC_API_BASE_URL } from '$env/static/public';
	import { page } from '$app/state';
	import { LogOut } from '@lucide/svelte';
	import { Title, Subtitle, Body, IconButton } from '$lib';

	const authNavItems = [
		{ href: '/residential', label: 'Residential' },
		{ href: '/commercial', label: 'Commercial' },
		{ href: '/stuff', label: 'Stuff' },
		{ href: '/content', label: 'Content' }
	];

	let isLoginPage = $derived(page.url.pathname === '/login');
	let navItems = $derived(isLoginPage ? [] : authNavItems);

	async function handleLogout() {
		await fetch(`${PUBLIC_API_BASE_URL}/api/auth/sign-out`, {
			method: 'POST',
			credentials: 'include'
		});
		window.location.href = '/login';
	}
</script>

<header>
	<div class="flex-row header-content">
		<div class="flex-row logo">
			<Title class="logo-light">Light Detail</Title>
			<span class="logo-separator"></span>
			<Body class="logo-admin">ADMIN</Body>
		</div>

		<div class="flex-row nav">
			{#each navItems as { href, label }}
				<a {href} class:active={page.url.pathname.startsWith(href)}><Subtitle>{label}</Subtitle></a>
			{/each}
		</div>

		{#if !isLoginPage}
			<IconButton class="logout" aria-label="Log out" onclick={handleLogout}>
				<LogOut size={20} />
			</IconButton>
		{/if}
	</div>
</header>

<style>
	header {
		background-image: url('/images/header-bg.webp');
		background-size: cover;
		background-position: center;
		position: sticky;
		top: 0;
		z-index: 100;
		display: flex;
	}

	header::before {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(to right, rgba(0, 0, 0, 0.7), transparent);
	}

	.header-content {
		position: relative;
		align-items: center;
		padding: 16px 32px;
		gap: 32px;
		flex: 1;
	}

	.nav {
		gap: 24px;
	}

	.logo {
		gap: 16px;
	}

	header :global(.logo-light) {
		color: white;
	}

	.logo-separator {
		background-color: white;
		width: 2px;
	}

	header :global(.logo-admin) {
		color: white;
	}

	.nav a {
		color: white;
		text-decoration: none;
	}

	.nav a:hover,
	.nav a.active {
		color: var(--color-primary);
	}

	.header-content :global(.logout) {
		margin-left: auto;
	}
</style>
