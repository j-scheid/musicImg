<!-- YOU CAN DELETE EVERYTHING IN THIS PAGE -->
<script>
	import { createClient } from '@supabase/supabase-js'
	import {page} from '$app/stores'
	import { onMount } from 'svelte';
	import 'openai'

	const OAIKEY = "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"

	const supabase = createClient('https://lejxdttxfvpczpebuvki.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlanhkdHR4ZnZwY3pwZWJ1dmtpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzU2MDAzMzksImV4cCI6MTk5MTE3NjMzOX0.LJUk1o-yoU9yqCZvoJPYtkaR8o3lzjmRFYFv7JEVJso')

	function spotifyLogin(){
		signInWithSpotify()
	}
	function spotifyLogout(){
		console.log("Sign out!")
		signout()
	}
	async function signInWithSpotify() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'spotify',
	options: {
		scopes: 'user-read-currently-playing'
	}
  })
}
async function signout() {
  const { error } = await supabase.auth.signOut()
}
	onMount(async () => {
		const clientId = "your-client-id-here";  // Replace with your client id
const params = new URLSearchParams(window.location.hash.substring(1));
const code = params.get("access_token");
console.log(code)
	});


/* const { Configuration, OpenAIApi } = require("openai");

async function generateImg(){
	const configuration = new Configuration({
  apiKey: OAIKEY,
});
const openai = new OpenAIApi(configuration);
const response = await openai.createImage({
  prompt: "A cute baby sea otter",
  n: 2,
  size: "1024x1024",
});
console.log(response)
} */



</script>
<div class="container h-full mx-auto flex justify-center items-center">
	<div class="space-y-10 text-center">
		<h2 class="font-bold">Welcome.</h2>
		<button on:click={spotifyLogin}>Log In with Spotify</button><br>
		<button on:click={spotifyLogout}>Sign Out</button>
	</div>
</div>
