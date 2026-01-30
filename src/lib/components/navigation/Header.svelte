<script lang="ts">
	import { page } from '$app/state';
	import { LogOut } from '@lucide/svelte';
	import { Row, Title, Subtitle, Body } from '$lib';

	const authNavItems = [
		{ href: '/residential', label: 'Residential' },
		{ href: '/commercial', label: 'Commercial' },
		{ href: '/stuff', label: 'Stuff' }
	];

	let isLoginPage = $derived(page.url.pathname === '/login');
	let navItems = $derived(isLoginPage ? [] : authNavItems);

	async function handleLogout() {
		await fetch('http://localhost:3001/api/auth/sign-out', {
			method: 'POST',
			credentials: 'include'
		});
		window.location.href = '/login';
	}
</script>

<header>
	<Row class="header-content">
		<Row class="logo">
			<Title class="logo-light">Light Detail</Title>
			<span class="logo-separator"></span>
			<Body class="logo-admin">ADMIN</Body>
		</Row>

		<Row class="nav">
			{#each navItems as { href, label }}
				<a {href} class:active={page.url.pathname.startsWith(href)}><Subtitle>{label}</Subtitle></a>
			{/each}
		</Row>

		{#if !isLoginPage}
			<button class="logout" aria-label="Log out" onclick={handleLogout}>
				<LogOut size={20} color="white" />
			</button>
		{/if}
	</Row>
</header>

<style>
	header {
		background-image: url('/images/header-bg.webp');
		background-size: cover;
		background-position: center;
		position: relative;
		display: flex;
	}

	header::before {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(to right, rgba(0, 0, 0, 0.7), transparent);
	}

	header :global(.header-content) {
		position: relative;
		align-items: center;
		padding: 16px 32px;
		gap: 32px;
		flex: 1;
	}

	header :global(.nav) {
		gap: 24px;
	}

	header :global(.logo) {
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

	header :global(.nav a) {
		color: white;
		text-decoration: none;
	}

	header :global(.nav a:hover),
	header :global(.nav a.active) {
		color: var(--color-primary);
	}

	.logout {
		margin-left: auto;
		background: none;
		border: none;
		cursor: pointer;
		color: #000;
		padding: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 4px;
		background-color: rgba(0, 0, 0, 0.6);
	}
</style>
