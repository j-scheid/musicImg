<script lang="ts">
	import { goto } from '$app/navigation';
</script>

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
		<h2 class="font-bold">How to play</h2>
		<p>Guess the song...</p>
		<br />
		<h2 class="font-bold">About the project</h2>
		<p>Submit song ideas, view code on GitHub</p>
		<br />
		<div class="card variant-ghost-primary px-24 py-8">
		<h3>Want to see AI images for the songs you listen to?</h3>
		<button class="btn bg-white mt-6 text-gray-800" on:click={()=> { goto('/login')}}>Learn more</button>
	</div>
	</div>
</div>
