<script lang="ts">
	import '@skeletonlabs/skeleton/themes/theme-skeleton.css';
	import '@skeletonlabs/skeleton/styles/all.css';
	import '../app.postcss';
	import { AppShell, AppBar } from '@skeletonlabs/skeleton';
	import { Modal, modalStore } from '@skeletonlabs/skeleton';
	import { menu } from '@skeletonlabs/skeleton';
</script>

<AppShell slotSidebarLeft="bg-surface-500/5 w-56 p-4">
	<svelte:fragment slot="header">
		<AppBar>
			<svelte:fragment slot="lead">
				<a href="/"><strong class="text-xl uppercase">AI + Music + Images</strong></a>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<span class="mobile">
					<button use:menu={{ menu: 'mainmenu' }} class="btn btn-sm variant-ghost-surface"
						>Menu</button
					>

					<nav class="list-nav card p-4 w-64 shadow-xl" data-menu="mainmenu">
						<ul>
							<li><a href="/">Guessing Game</a></li>
							<li><a href="/login">Spotify Companion</a></li>
							<li><a href="/about">About</a></li>
						</ul>
					</nav>
				</span>
				<div class="normal">
					<a class="btn btn-sm variant-ghost-surface" href="/">Guessing Game</a>
					<a class="btn btn-sm variant-ghost-surface" href="/login">Spotify Companion</a>
					<a class="btn btn-sm variant-ghost-surface" href="/about">About</a>
				</div>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<slot />
</AppShell>
<Modal />
<p class="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs">
	<a href="/imprint" class="!text-gray-400 !no-underline">Impressum</a> |
	<a href="/privacy" class="!text-gray-400 !no-underline">Privacy</a>
</p>

<style>
	@media screen and (max-width: 600px) {
		.normal {
			display: none;
		}
		.mobile {
			float: right;
			display: block;
		}
	}

	@media screen and (min-width: 600px) {
		.mobile {
			display: none;
		}
		.normal {
			float: right;
			display: block;
		}
	}
</style>
