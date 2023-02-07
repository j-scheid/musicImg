<script lang="ts">
	import { page } from '$app/stores';
	import { localStorageStore } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import type { Writable } from 'svelte/store';
	const lvl1: Writable<string> = localStorageStore('storeExample', 'true false');
	const activeLvlStore: Writable<number> = localStorageStore('storeExample', 0);

	import { get } from 'svelte/store';
	import { modalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings, ModalComponent } from '@skeletonlabs/skeleton';
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

	$: activeLvl = 0;
	$: currLvl = allLevels[activeLvl];
	$: currSongId = 0;
	$: currSong = currLvl[currSongId];
	$: disablePrev = false;
	$: disableNext = false;
	$: currImg = '/ai-img/' + currSong.file + '.jpeg';
	let revealed: Boolean = false;
	$: correct = 0;

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

	function correctAnswer(): void {
		correct++;
		handleFeedback();
	}

	function wrongAnswer(): void {
		handleFeedback();
	}

	function handleFeedback(): void {
		if (currSongId == currLvl.length - 1) {
			if (activeLvl == allLevels.length - 1) {
				triggerAlert();
			} else {
				triggerConfirm();
			}
		} else {
			nextSong();
		}
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

	function triggerConfirm(): void {
		let confirmBody =
			'You were able to guess ' + correct + ' of ' + currLvl.length + ' song titles.';
		const confirm: ModalSettings = {
			type: 'confirm',
			title: 'Congratulations!',
			body: confirmBody,
			// TRUE if confirm pressed, FALSE if cancel pressed
			response: (r: Boolean) => handleNextLevel(r),
			// Optionally override the button text
			buttonTextCancel: 'Cancel',
			buttonTextConfirm: 'Next Level'
		};
		modalStore.trigger(confirm);
	}

	function triggerAlert(): void {
		let alertBody =
			'You have played through all levels! Here is your last score: ' + correct + ' of ' + currLvl.length + ' song titles guessed correctly. Thank you for playing :)';
		const alert: ModalSettings = {
			type: 'alert',
			title: 'The End...',
			body: alertBody,
			image: 'https://i.imgur.com/WOgTG96.gif',
			buttonTextCancel: 'Close'
		};
		modalStore.trigger(alert);
	}

	function handleNextLevel(r: Boolean): void {
		if (r) {
			modalStore.close();
			activeLvl++;
			currSongId = 0;
			correct = 0;
			updateSong();
		}
	}
</script>

<div class="container h-full mx-auto flex justify-center items-center">
	<div class="text-center">
		<p class="fixed top-24 right-10">
			Level {activeLvl + 1}: {correct}/{currSongId} correct guesses
		</p>
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
				<button class="btn variant-ghost-surface btn-base" on:click={wrongAnswer}> Wrong </button>
				<button class="btn variant-ghost-surface btn-base" on:click={correctAnswer}>
					Correct
				</button>
			{:else}
				<button
					class="btn variant-ghost-surface btn-base"
					on:click={previousSong}
					disabled={disablePrev}
				>
					Previous
				</button>
				<button class="btn variant-ghost-surface btn-base" on:click={revealAnswer}> Reveal </button>
				<button
					class="btn variant-ghost-surface btn-base"
					on:click={nextSong}
					disabled={disableNext}
				>
					Next
				</button>
			{/if}
		</div>
	</div>
</div>
