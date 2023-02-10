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

	const storeValue: Writable<number> = writable(1);

	$: activeLvl = $storeValue - 1;

	$: currLvl = allLevels[activeLvl];
	$: currSongId = 0;
	$: currSongIndex = 4;
	$: currSong = currLvl[currSongId];
	$: disablePrev = false;
	$: lastSong = false;
	$: currImg = '/ai-img/' + currSong.file + '.jpeg';
	$: currHint = 'ai-audio/' + currSong.file + '.mp3';
	let revealed: Boolean = false;
	$: correct = 0;
	$: levelLock = false;
	let loggingIn = false;
	let audioElement: HTMLAudioElement;
	let hintPlaying = false;
	let tileUrl = '/help';
	let answered = [false, true, false, false];

	onMount(async () => {
		checkLogin();
		isLastTrack();
	});

	function checkLogin(): void {
		const params = new URLSearchParams(window.location.hash.substring(1));
		const code = params.get('provider_refresh_token');
		if (code != null) {
			access_token.set(code);
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
			levelLock = true;
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
		hintPlaying = false;
		isLastTrack();
	}

	function isLastTrack(): void {
		if (currSongId === currLvl.length - 1) {
			lastSong = true;
			disablePrev = false;
		} else {
			lastSong = false;
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
			storeValue.set($storeValue + 1);
			console.log($storeValue);
			currSongId = 0;
			correct = 0;
			levelLock = false;
			updateSong();
		}
	}

	function playHint(): void {
		if (audioElement.paused) {
			audioElement.play();
			hintPlaying = true;
		} else {
			audioElement.currentTime = 0;
			audioElement.pause();
			hintPlaying = false;
		}
	}
</script>

<div class="fixed">
	<AppRail selected={storeValue}>
		<svelte:fragment slot="lead">
			<div class:bg-primary-500={tileUrl === $page.url.pathname} class="text-center">
				<AppRailTile tag="a" href={tileUrl}>Help</AppRailTile>
			</div>
		</svelte:fragment>
		<AppRailTile label={activeLvl == 0 ? correct + '/' + currSongIndex : ''} title="Tile" value={1}
			>1</AppRailTile
		>
		<AppRailTile label={activeLvl == 1 ? correct + '/' + currSongIndex : ''} title="Tile" value={2}
			>2</AppRailTile
		>
		<AppRailTile label={activeLvl == 2 ? correct + '/' + currSongIndex : ''} title="Tile" value={3}
			>3</AppRailTile
		>
	</AppRail>
</div>

<div class="container h-full mx-auto flex justify-center items-center">
	<div class="text-center">
		{#if loggingIn}
			<p>Logging In</p>
		{:else}
			<img src={currImg} class="object-center w-80 rounded-lg" alt="AI generated song cover" /><br
			/>
			<audio src={currHint} bind:this={audioElement} />
			<button class="btn variant-ghost-error" on:click={playHint}
				>{#if hintPlaying}
					Stop
				{:else}
					Play
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
					{#if levelLock}
						<button class="btn variant-ringed-surface btn-base" on:click={wrongAnswer}>
							Finish
						</button>
					{:else}
						<button class="btn variant-ringed-surface btn-base" on:click={wrongAnswer}>
							Wrong
						</button>
						<button class="btn variant-ringed-surface btn-base" on:click={correctAnswer}>
							Correct
						</button>
					{/if}
				{:else}
					<!-- <button
						class="btn variant-ringed-surface btn-base"
						on:click={previousSong}
						disabled={disablePrev}
					>
						Previous
					</button> -->
					<button class="btn variant-ringed-surface btn-base" on:click={revealAnswer}>
						Reveal
					</button>

					{#if lastSong}
						<button class="btn variant-ringed-surface btn-base" on:click={wrongAnswer}>
							Finish
						</button>
					{:else}
						<button class="btn variant-ringed-surface btn-base" on:click={nextSong}>Skip</button>
					{/if}
				{/if}
			</div>
		{/if}
	</div>
</div>
