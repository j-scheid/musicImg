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
	import { goto } from '$app/navigation';
	import {access_token} from '$lib/data/stores.js'

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
	$: currHint = 'ai-audio/' + currSong.file + '.mp3'
	let revealed: Boolean = false;
	$: correct = 0;
	let loggingIn = false;
	let audioElement
	let hintPlaying= false

	// Read value with automatic subscription
	$lvl1;

	onMount(async () => {
		//console.log(activeLvl);
		checkLogin();
		isLastTrack();
	});

	function checkLogin(): void {
		const params = new URLSearchParams(window.location.hash.substring(1));
		const code = params.get('provider_refresh_token');
		if (code != null) {
			access_token.set(code)
			goto('/companion');
			loggingIn = true;
		}
	}

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
		hintPlaying = false
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
			'You were able to guess <b>' + correct + ' of ' + currLvl.length + '</b> song titles.';
		const confirm: ModalSettings = {
			type: 'confirm',
			title: 'Congratulations!',
			body: confirmBody,
			response: (r: Boolean) => handleNextLevel(r),
			buttonTextCancel: 'Cancel',
			buttonTextConfirm: 'Next Level'
		};
		modalStore.trigger(confirm);
	}

	function triggerAlert(): void {
		let alertBody =
			'You have played through all levels! Here is your last score: <b>' +
			correct +
			' of ' +
			currLvl.length +
			'</b> song titles guessed correctly. Thank you for playing :)';
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

	function playHint(): void{
    if (audioElement.paused) {
        audioElement.play();
		hintPlaying = true
    }else{
        audioElement.currentTime = 0
		audioElement.pause()
		hintPlaying = false
    }
	}
</script>

<div class="container h-full mx-auto flex justify-center items-center">
	<div class="text-center">
		{#if loggingIn}
			<p>Logging In</p>
		{:else}
			<p class="fixed top-24 right-10">
				Level {activeLvl + 1}: {correct}/{currSongId} correct guesses
			</p>

			  <img src={currImg} class="object-center w-80 rounded-lg" alt="AI generated song cover" /><br
			  />
			  <audio src={currHint} bind:this={audioElement}></audio>
			  <button class="btn variant-ghost-error" on:click={playHint}>{#if hintPlaying}
				Stop {:else} Play
			  {/if} Audio Hint 
			</button>
			
			
			<div class="h-24 mt-4">
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
					<button class="btn variant-ghost-surface btn-base" on:click={revealAnswer}>
						Reveal
					</button>
					<button
						class="btn variant-ghost-surface btn-base"
						on:click={nextSong}
						disabled={disableNext}
					>
						Skip
					</button>
				{/if}
			</div>
		{/if}
	</div>
</div>
