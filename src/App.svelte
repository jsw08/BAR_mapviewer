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
		(_, index) => (index <= currentIndex + 5 && index <= loadedMaps.length) 
			|| index >= currentIndex - 2
	);

	const nextImage = (): void => {
		currentIndex >= loadedMaps.length - 1
			? (currentIndex = 0)
			: (currentIndex += 1);
	};
	const prevImage = (): void => {
		currentIndex <= 0
			? (currentIndex = loadedMaps.length - 1)
			: (currentIndex -= 1);
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
	<h1>Loading...</h1>
{:then maps}
	<main style:background-image={`url(${maps[currentIndex].picture})`}>
		<button on:click={prevImage}>Prev</button>
		<div>
			<p>{maps[currentIndex].name}</p>
		</div>
		<button on:click={nextImage}> Next</button>
	</main>
{/await}

<style>
	main {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		place-items: center;
		background-position: center;
		background-repeat: no-repeat;
		background-size: contain;
	}
	main > div {
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: end;
		flex-grow: 3;
		place-items: center center;
		gap: 5px;
	}

	main > div > p {
		background-color: white;
		padding: 2px;
	}
</style>
