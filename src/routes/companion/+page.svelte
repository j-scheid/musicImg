<script lang="ts">
	import { createClient } from '@supabase/supabase-js';
	import { onMount } from 'svelte';
	import { access_token } from '$lib/data/stores.js';
	import { modalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings, ModalComponent } from '@skeletonlabs/skeleton';
	import { goto } from '$app/navigation';

	let refresh_token: string;
	const updateFrequency = 3000; //check spotify API every seconds
	let noSongHintVisible: boolean = true;
	let generatorCount = 0;
	let currImg = '';

	access_token.subscribe((value) => {
		refresh_token = value;
		if(refresh_token === ''){
			goto('/login')
		}
	});

	const supabase = createClient(
		'https://lejxdttxfvpczpebuvki.supabase.co',
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlanhkdHR4ZnZwY3pwZWJ1dmtpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzU2MDAzMzksImV4cCI6MTk5MTE3NjMzOX0.LJUk1o-yoU9yqCZvoJPYtkaR8o3lzjmRFYFv7JEVJso'
	);
	function spotifyLogout() {
		signout();
		goto('/login')
	}
	async function signout() {
		const { error } = await supabase.auth.signOut();
		access_token.set('')
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
	$: songFormat = songName.replace(/[^\w\s-]/gi, '')
	$: artistFormat = artistName.replace(/[^\w\s-]/gi, '')
	let previousSong: string;
	let previousArtist: string;
	onMount(async () => {
		getNowPlaying()
		var intervalID = window.setInterval(getNowPlaying, updateFrequency);
	});

	async function getNowPlaying(): Promise<void> {
		const { access_token } = await getAccessToken();

		const response = await fetch(NOW_PLAYING_ENDPOINT, {
			headers: {
				Authorization: `Bearer ${access_token}`
			}
		});

		if (response.status === 204) {
			noSongHintVisible = true;
		} else {
			noSongHintVisible = false;
			data = await response.json();
			previousSong = songName;
			previousArtist = artistName;
			songName = data.item.name;
			artistName = data.item.artists[0].name;
			checkSongChange(songName, artistName);
		}
	}

	function checkSongChange(song: string, artist: string): void {
		if (song != previousSong || artist != previousArtist) {
			if (generatorCount <= 3) {
				console.log('Generations: ' +generatorCount);
				generatorCount++;
				generateImage(song);
			} else {
				triggerAlert();
			}
		}
	}

	let imgUrl: string;
	async function generateImage(prompt: string) {
		const encodedParams = new URLSearchParams();
		encodedParams.append('prompt', prompt);
		encodedParams.append('guidance', '8');
		encodedParams.append('height', '320');
		encodedParams.append('width', '320');
		encodedParams.append('steps', '20');

		const options = {
			method: 'POST',
			headers: {
				'content-type': 'application/x-www-form-urlencoded',
				'X-RapidAPI-Key': 'd30b87e183msh2179781cc02dde5p18be77jsn483ca2b1534b',
				'X-RapidAPI-Host': 'dezgo.p.rapidapi.com'
			},
			body: encodedParams
		};

		var response = await fetch('https://dezgo.p.rapidapi.com/text2image', options);
		console.log(response);
		var pngBlob = await response.blob();

		imgUrl = URL.createObjectURL(pngBlob);
		saveImg(imgUrl)
	}

	async function saveImg(src: string){
		console.log(songFormat + '-' + artistFormat)
		const url = src;
		const blob = await fetch(url).then((r) => r.blob());
		await supabase.storage.from('generated-img').upload('TestBatch/' + songFormat + '-' + artistFormat + '-' + Math.random().toString(36).substr(2, 5) + '.jpeg', blob);
	}

	function triggerAlert(): void {
		const alert: ModalSettings = {
			type: 'alert',
			title: 'Limit exceeded!',
			body: 'This is a project funded by students so we kindly ask you not to abuse the image generator. You can refresh the page and log in again to receive additional 3 image generations. Thank you for understanding.',
			image: '',
			buttonTextCancel: 'I understand'
		};
		modalStore.trigger(alert);
	}
</script>

<div class="container h-full mx-auto flex justify-center items-center">
	<div class="text-center">
		{#if noSongHintVisible}
			<aside class="alert variant-ghost-primary">
				<div class="alert-message">
					<h3>No song playing</h3>
					<p>Feel free to play something on Spotify.</p>
				</div>
			</aside>
		{:else}
			<!-- svelte-ignore a11y-img-redundant-alt -->
			<img
				src={imgUrl}
				class="object-center w-80 rounded-lg"
				alt="We are generating an image for you..."
			/><br />
			<h2 class="font-bold">{songName}</h2>
			<h4 class="font-bold">{artistName}</h4>
		{/if}
<br><br><br>
		<button on:click={spotifyLogout}>Sign Out</button>
	</div>
</div>
