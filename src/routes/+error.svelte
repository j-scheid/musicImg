<script lang="ts">
	import { goto } from '$app/navigation';
</script>
<svelte:head>
	<title>Error - AI + Music + Image</title>
</svelte:head>
<div class="container h-full mx-auto flex justify-center items-center">
	<div class="text-center">
		<h1>
			<span
				class="bg-gradient-to-br from-primary-300 via-primary-500 to-secondary-400 bg-clip-text text-transparent box-decoration-clone"
			>
				404: Not Found.
			</span>
		</h1>
		<br />
		<button class="btn bg-white mt-6 text-gray-800" on:click={()=> { goto('/')}}>Go to Home</button>
	</div>
</div>
