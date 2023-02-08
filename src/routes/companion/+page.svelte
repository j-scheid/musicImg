<script lang="ts">
	import { createClient } from '@supabase/supabase-js';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { access_token } from '$lib/data/stores.js';

	let refresh_token: string;
	access_token.subscribe((value) => {
		refresh_token = value;
	});

	const supabase = createClient(
		'https://lejxdttxfvpczpebuvki.supabase.co',
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlanhkdHR4ZnZwY3pwZWJ1dmtpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzU2MDAzMzksImV4cCI6MTk5MTE3NjMzOX0.LJUk1o-yoU9yqCZvoJPYtkaR8o3lzjmRFYFv7JEVJso'
	);
	function spotifyLogout() {
		console.log('Sign out!');
		signout();
	}
	async function signout() {
		const { error } = await supabase.auth.signOut();
	}

	const client_id = 'f9877a5f4b0846888428579265af8e0d';
	const client_secret = '513e0e0e93124fabb888128705154236';

	const basic = btoa(`${client_id}:${client_secret}`);
	const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;
	const TOP_TRACKS_ENDPOINT = `https://api.spotify.com/v1/me/top/tracks`;
	const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;

	const getAccessToken = async () => {
		const response = await fetch(TOKEN_ENDPOINT, {
			method: 'POST',
			headers: {
				Authorization: `Basic ${basic}`,
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: new URLSearchParams({
				grant_type: 'refresh_token',
				refresh_token
			})
		});

		return response.json();
	};
	let data: any;
	$: songName = '';
	$: artistName = '';
	onMount(async () => {
		const { access_token } = await getAccessToken();

		const response = await fetch(NOW_PLAYING_ENDPOINT, {
			headers: {
				Authorization: `Bearer ${access_token}`
			}
		});
		data = await response.json();
		songName = data.item.name;
		artistName = data.item.artists[0].name;
	});
</script>

<div class="container h-full mx-auto flex justify-center items-center">
	<div class="space-y-10 text-center">
		<h2 class="font-bold">{songName}</h2>
		<h4 class="font-bold">{artistName}</h4>
		<button on:click={spotifyLogout}>Sign Out</button>
	</div>
</div>
