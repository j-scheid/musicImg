<script>
	import { createClient } from '@supabase/supabase-js';
	import { onMount } from 'svelte';

	const OAIKEY = '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';

	const supabase = createClient(
		'https://lejxdttxfvpczpebuvki.supabase.co',
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlanhkdHR4ZnZwY3pwZWJ1dmtpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzU2MDAzMzksImV4cCI6MTk5MTE3NjMzOX0.LJUk1o-yoU9yqCZvoJPYtkaR8o3lzjmRFYFv7JEVJso'
	);

	function spotifyLogin() {
		signInWithSpotify();
	}

	async function signInWithSpotify() {
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: 'spotify',
			options: {
				scopes: 'user-read-currently-playing'
			}
		});
	}

	onMount(async () => {
		const params = new URLSearchParams(window.location.hash.substring(1));
		const code = params.get('access_token');
	});
</script>

<svelte:head>
	<title>Login - AI + Music + Image</title>
</svelte:head>

<div class="container h-full mx-auto flex justify-center items-center px-10 py-12 sm:px-24">
	<div class="space-y-10 text-center">
		<h1>
			<span
				class="bg-gradient-to-br from-primary-300 via-primary-500 to-secondary-400 bg-clip-text text-transparent box-decoration-clone"
			>
				Spotify Image Companion.
			</span>
		</h1>
		<h2 class="font-bold">Welcome, please log in.</h2>
		<p>
			You can connect your Spotify account by loggin in through the button below. We will then
			create an image for the currently playing songs.
		</p>
		<button on:click={spotifyLogin} class="btn variant-filled-primary lg"
			>Log In with Spotify</button
		><br />
		<div class="card variant-soft-surface p-4">
			<i class="text-sm"
				>Please send your Spotify account email to the administrators if you have never logged in
				before. <br /> Accounts need to be whitelisted in order for the service to function.</i
			>
		</div>
	</div>
</div>
