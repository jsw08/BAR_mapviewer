<script>
	import { parse } from 'yaml';
	import {onMount} from "svelte"

	let maps = {};
	let keys = [];
	
	onMount(_ => {
		fetch("https://raw.githubusercontent.com/beyond-all-reason/maps-metadata/main/map_list.yaml")
			.then(v => v.text())
			.then(v => parse(v))
			.then(v => {
				maps = v;
				keys = Object.keys(v)
			})
	})
</script>

{#each keys as map} 
	{@const img = maps[map].photo[0].downloadURL}
	<a href={img}>
		<img src={img} alt="img" style="max-width: auto; max-height: 70svh;"/>
	</a>
	<br>
{/each}
