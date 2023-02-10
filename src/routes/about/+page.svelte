<script lang="ts">
	import { goto } from '$app/navigation';
</script>

<svelte:head>
	<title>About us - AI + Music + Image</title>
</svelte:head>

<div class="container h-full mx-auto flex justify-center items-center">
	<div class="text-center">
		<h1>
			<span
				class="bg-gradient-to-br from-primary-300 via-primary-500 to-secondary-400 bg-clip-text text-transparent box-decoration-clone"
			>
				About.
			</span>
		</h1>
		<br />
		<h2 class="font-bold">About the project.</h2>
		<p>
			This website is a project by Max Tabori and Jonas Scheid. It was created as part of the course
			Interface Design at Hochschule Furtwangen University.
		</p>
		<br />
		<h2 class="font-bold">About the technology.</h2>
		<p>
			The images found in the guessing game as well as the Spotify Image Companion have been
			generated using <a href="https://platform.stability.ai/docs/release-notes"
				>Stable Diffusion 2.1</a
			>.<br /> The songs from the audio hint were generated using
			<a href="https://tuna.voicemod.net/ttsong">Tuna</a>.
		</p>
		<br />
		<div class="card variant-ghost-primary px-24 py-8">
			<h3>Want to see AI images for the songs you listen to?</h3>
			<button
				class="btn bg-white mt-6 text-gray-800"
				on:click={() => {
					goto('/login');
				}}>Learn more</button
			>
		</div>
	</div>
</div>
