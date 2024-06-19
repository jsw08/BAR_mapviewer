<script>
	import { parse } from 'yaml';
	import {onMount} from "svelte"

	let maps = {};
	let keys = [];
	let loading = true;
	let currentIndex = 0;

	//@ts-expect-error
	Array.prototype.shuffle = function() {
		for (let i = this.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			const temp = this[i];
			this[i] = this[j];
			this[j] = temp;
		}
	}

	async function fetchMaps() {
		let req = await fetch("https://raw.githubusercontent.com/beyond-all-reason/maps-metadata/main/map_list.yaml");
		let maps = parse(await req.text())
		let mapIDS = Object.keys(maps)
		mapIDS = mapIDS.shuffle();

	}
	
	onMount(_ => 
		.then(v => v.text())
		.then(v => parse(v))
		.then(v => {
			maps = v;
			keys = Object.keys(v)
			// @ts-expect-error5
			keys.shuffle();
			loading = false;
		}))
</script>

<h1>Bar mapviewer</h1>
<p>Hover your mouse over the images to see the title. Click an image to open it.</p>

{#each keys as map} 
	{@const img = maps[map].photo[0].downloadURL}
	{@const title = maps[map].displayName}
	<a href={img}>
		<img src={img} alt={title} {title} style="max-width: 100svw; max-height: 70svh;"/>
	</a>
	<br>
{/each}
