<script lang="ts">
	import {onMount} from "svelte"
    import {type BARMap} from "./lib/fetchMaps";
    import fetchMaps from "./lib/fetchMaps";

	let currentIndex = 0;
	let maps: Promise<BARMap[]> = fetchMaps();
</script>

<h1>Bar mapviewer</h1>
<p>Hover your mouse over the images to see the title. Click an image to open it.</p>

{#await maps}
	<h1>Loading...</h1>	
{:then maps} 
	{#each maps as map}
		{#each map.pictures as pic}
			<img />
		{/each}	
	{/each}	
{/await}
