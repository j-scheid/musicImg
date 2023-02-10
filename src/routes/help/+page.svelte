<script lang="ts">
	import { onMount } from 'svelte';
	import { modalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings, ModalComponent } from '@skeletonlabs/skeleton';
	import allLevels from '$lib/data/level.json';
	import { goto } from '$app/navigation';
	import { access_token } from '$lib/data/stores.js';
	import { AppRail, AppRailTile } from '@skeletonlabs/skeleton';
	import { page } from '$app/stores';
	import { writable, type Writable } from 'svelte/store';

const storeValue: Writable<number> = writable(0);
	
	let tileUrl = '/'





	
	
</script>
<svelte:head>
	<title>How to play - AI + Music + Image</title>
</svelte:head>
<div class="fixed">
<AppRail selected={storeValue}>
	<svelte:fragment slot="lead">
		<div class:bg-primary-500={$page.url.pathname === '/help'} class='text-center'>
			<AppRailTile tag="a" href={tileUrl} >
				Close <br>Help
			</AppRailTile></div>
	</svelte:fragment>
</AppRail>
</div>

<div class="container h-full mx-auto flex justify-center items-center">
	<div class="text-center">
		<h1>
			<span
				class="bg-gradient-to-br from-primary-300 via-primary-500 to-secondary-400 bg-clip-text text-transparent box-decoration-clone"
			>
				How to play.
			</span>
		</h1>
		<br />
		<p>The images in the game show the way an AI sees a popular song. Your job is to guess the title and artist. <br><br>
		We also provide clues to the solution in form of an audio file. Click on "Play Audio Hint" to hear an AI interpret the song for you. Notice how the lyrics are always the same as the original.<br><br>
	Have fun playing!</p>
		<br />
		
	</div>
</div>