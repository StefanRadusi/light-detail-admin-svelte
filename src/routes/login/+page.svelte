<script lang="ts">
	import { Title, Input, Button } from '$lib';
	import { signIn } from '$lib/api';

	let email = $state('');
	let password = $state('');
	let error = $state('');
	let loading = $state(false);

	$effect(() => {
		email;
		error = '';
	});

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		error = '';

		if (!email || !password) {
			error = 'Missing required fields';
			return;
		}

		loading = true;

		try {
			await signIn(email, password);
			window.location.href = '/residential';
		} catch (err) {
			error = err instanceof Error ? err.message : 'Unable to connect to server';
		} finally {
			loading = false;
		}
	}
</script>

<div class="login-container">
	<form class="login-form" onsubmit={handleSubmit} novalidate>
		<Title class="login-title">Sign In</Title>

		<Input
			label="Email*"
			type="email"
			id="email"
			bind:value={email}
			autocomplete="email"
			disabled={loading}
		/>

		<Input
			label="Password*"
			type="password"
			id="password"
			bind:value={password}
			autocomplete="current-password"
			disabled={loading}
		/>

		<div class="error-container">
			<p class="error">
				{#if error}{error}{/if}
			</p>
		</div>

		<Button type="submit" {loading}>Sign In</Button>
	</form>
</div>

<style>
	.login-container {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: var(--color-surface);
	}

	.login-form {
		background: var(--color-background);
		padding: 40px;
		border-radius: 8px;
		box-shadow: var(--box-shadow);
		width: 100%;
		max-width: 400px;
		display: flex;
		flex-direction: column;
		gap: 30px;
	}

	.login-container :global(.login-title) {
		text-align: center;
	}

	.error-container {
		height: 24px;
	}

	.error {
		color: var(--color-error);
		text-align: center;
	}
</style>
