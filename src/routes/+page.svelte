<script lang="ts">
	import { page } from '$app/stores';
	import { localStorageStore } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import type { Writable } from 'svelte/store';
	const lvl1: Writable<string> = localStorageStore('storeExample', 'true false');
	const activeLvlStore: Writable<number> = localStorageStore('storeExample', 0);

	import { get } from 'svelte/store';
	import allLevels from '$lib/data/level.json';

	/* // Subscribe to the store
	storeExample.subscribe(() => {});

	// Update the value
	storeExample.update(() => {});

	// Set the value
	storeExample.set(() => {}); */

	// Read the value
	let store = get(lvl1);
	let array = store.split(' ');

	let activeLvl = 0;
	let currLvl = allLevels[activeLvl];
	let currSongId = 0;
	$: currSong = currLvl[currSongId];
	$: disablePrev = false;
	$: disableNext = false;
	$: currImg = '/ai-img/' + currSong.img + '.png';
	let revealed: Boolean = false;
	$: correct = 0

	// Read value with automatic subscription
	$lvl1;

	onMount(async () => {
		//console.log(activeLvl);
		isLastTrack();
	});

	function nextSong(): void {
		currSongId++;
		updateSong();
	}

	function previousSong(): void {
		currSongId--;
		updateSong();
	}

	function revealAnswer(): void {
		revealed = true;
	}
	
	function correctAnswer(): void{
		correct++
		nextSong()
	}

	function updateSong(): void {
		revealed = false;
		isLastTrack();
	}

	function isLastTrack(): void {
		if (currSongId === currLvl.length - 1) {
			disableNext = true;
			disablePrev = false;
		} else {
			disableNext = false;
			if (currSongId === 0) {
				disablePrev = true;
			} else {
				disablePrev = false;
			}
		}
	}
</script>

<div class="container h-full mx-auto flex justify-center items-center">
	<div class="text-center">
		<p class="fixed top-24 right-10">{correct}/{currSongId} Correct Guesses</p>
		<img src={currImg} class="object-center w-80 rounded-lg" alt="AI generated song cover" /><br />
		<div class="h-24">
			{#if revealed}
				<h2 class="font-bold">{currSong.title}</h2>
				<h4 class="font-bold">{currSong.artist}</h4>
			{/if}
		</div>
		<br />
		<div class="text-center">
			{#if revealed}
			<button
			class="btn variant-ghost-surface btn-base"
			on:click={nextSong}
		>
			Wrong
		</button>
		<button class="btn variant-ghost-surface btn-base" on:click={correctAnswer}> Correct </button>
			{:else}
			<button
			class="btn variant-ghost-surface btn-base"
			on:click={previousSong}
			disabled={disablePrev}
		>
			Previous
		</button>
		<button class="btn variant-ghost-surface btn-base" on:click={revealAnswer}> Reveal </button>
		<button class="btn variant-ghost-surface btn-base" on:click={nextSong} disabled={disableNext}>
			Next
		</button>
			{/if}
		</div>
	</div>
</div>
