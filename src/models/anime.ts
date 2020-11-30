export class Anime {
  constructor(
    public kitsuId: number,
    public title: string,
    public poster: string,
    public synopsis: string,
    public nsfw: boolean,
    public continuingSeries: boolean,
    public votes: number,
    public thisWeek: boolean,
    public episode: number,
    public episodes: number,
    public native: boolean
  ) {}
}
