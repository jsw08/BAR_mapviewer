<script lang="ts">
	import { onMount } from "svelte";
	import { type BARMap } from "./lib/fetchMaps";
	import fetchMaps from "./lib/fetchMaps";
	import type { KeyboardEventHandler } from "svelte/elements";

	let currentIndex = 0;
	let maps: Promise<BARMap[]> = fetchMaps();

	let loadedMaps: BARMap[] = [];
	let preloadMaps: BARMap[] = [];

	maps.then((v) => (loadedMaps = v));
	$: preloadMaps = loadedMaps.filter(
		(_, index) => index < currentIndex + 5 && index <= loadedMaps.length,
	);

	const nextImage = (): void => {
		currentIndex >= loadedMaps.length - 1
			? (currentIndex = 0)
			: (currentIndex += 1);
	};
	const prevImage = (): void => {
		currentIndex > 0
			? (currentIndex -= 1)
			: (currentIndex = loadedMaps.length - 1)
	};
	const keyHandler: KeyboardEventHandler<Window> = (e): void => {
		if (!loadedMaps.length) return;
		switch (e.key) {
			case " ":
				prompt(
					"Press ctrl + c to copy the name.",
					loadedMaps[currentIndex].name,
				);
				break;
			case "ArrowRight":
				nextImage();
				break;
			case "ArrowLeft":
				prevImage();
				break;
		};
	};
</script>

<svelte:window on:keydown={keyHandler} />

<svelte:head>
	{#each preloadMaps as map}
		<link rel="preload" as="image" href={map.picture} />
	{/each}
</svelte:head>

{#await maps}
	<dialog class="modal modal-bottom sm:modal-middle" open>
		<div class="modal-box bg-base-200">
			<h3 class="text-lg font-bold">Loading!</h3>
			<p class="py-4">We're fetching and parsing the newest maps from the <a href="https://raw.githubusercontent.com/beyond-all-reason/maps-metadata/main/map_list.yaml">BAR metadata repo</a>.</p>
			<div class="modal-action">
				<span class="loading loading-ring loading-lg"></span>
			</div>
		</div>
	</dialog>
{:then maps}
	<main class="w-full h-full bg-center bg-no-repeat bg-contain flex flex-row justify-start items-end p-2" style:background-image={`url(${maps[currentIndex].picture})`}>
		<div class="card bg-primary text-primary-content w-96">
			<div class="card-body">
			  <h2 class="card-title">Card title!</h2>
			  <p>If a dog chews shoes whose shoes does he choose?</p>
			  <div class="card-actions justify-end">
				<button class="btn">Buy Now</button>
			  </div>
			</div>
		  </div> 
	</main>
{/await}
