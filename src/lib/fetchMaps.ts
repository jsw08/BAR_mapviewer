import {parse} from "yaml"

declare global {
    interface Array<T> {
        shuffle(): Array<T>;
    }
}
Array.prototype.shuffle = function() {
    for (let i = this.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = this[i];
        this[i] = this[j];
        this[j] = temp;
    }
    return this
}
 
export type BARMap = {
    id: string;
    name: string;
    author: string;
    pictures: string[];
}
type UnparsedBARMap = {
    displayName: string;
    author: string;
    photo: {
        downloadURL: string;
        [x: string]: unknown;
    }[];
    [x: string]: unknown;
}



const fetchMaps = async (): Promise<BARMap[]> => {
    const req: Response = await fetch("https://raw.githubusercontent.com/beyond-all-reason/maps-metadata/main/map_list.yaml");
    const unparsedMaps: {[x: string]: UnparsedBARMap} = await parse(await req.text());
    let parsedMaps: BARMap[] = [];

    for (let i in unparsedMaps) {
        const map: UnparsedBARMap = unparsedMaps[i]
        let parsedMap: BARMap = {
            id: i,
            name: map.displayName,
            author: map.author,
            pictures: map.photo.map(v => v.downloadURL) 
        }
        parsedMaps.push(parsedMap)
    }

    return parsedMaps
}

export default fetchMaps