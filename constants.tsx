
import { Song } from './types';

export const INITIAL_SONGS: Song[] = [
  {
    id: '1',
    title: 'Bohemian Rhapsody',
    artists: ['Queen'],
    duration: '5:55',
    styles: ['Rock', 'Opera'],
    categories: ['Clássico', 'Dueto', 'Animada'],
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrAH75U6do8F4JTRBLKXHT0wyeZlopynEday3YFPMx529BO3b6lyqswND9KaYO2mv5KcBTYDkSSr9l3dVc5tLmApZjdiwkpDhjD2o8P8Uxyi_o8cALDf8R5FHUekVODlhU51wrF8sSg9ggdYvweOOiyh4RoUVBArLZlRNkSL9Z-CHYOD8gerufT3oXmGha98iG9ACbog-6JKuJIaKid4cEaCcY3gDc6z24uQe1c8coRG4zXnbYvhfuxFByja2Xty7Vrj3NmM6tlvnE',
    isFavorite: true,
    addedDate: '12 Out, 2023',
    key: 'Si Bemol (Bb)',
    youtubeUrl: 'https://www.youtube.com/watch?v=fJ9rUzIMcZQ'
  },
  {
    id: '2',
    title: 'All of Me',
    artists: ['John Legend'],
    duration: '4:29',
    styles: ['R&B', 'Pop'],
    categories: ['Romântica'],
    thumbnail: 'https://picsum.photos/seed/allofme/400/400',
    isFavorite: false,
    addedDate: '01 Nov, 2023',
    youtubeUrl: 'https://www.youtube.com/watch?v=450p7goxZqg'
  }
];

export const ASSETS = {
  WAVE_BG: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC8OfZpPuQrhBeFTSdhL3ld0ze3_uTMEwqbTX6P_sVl2BaauDtzRZUHyc3ud7mwW-mU5uRHC733JyHfl-9e0fztpKlwq3RIhcVhQeGIkYXmTnevNAbGUoDLAdAq68oMfXsF1mO6zYjDdlivEsPAo6x3twN9KB6jNtabs4TltETdBVA_xIJYhLDGv7JkZ8x4eN6KgDedVR01cQMH5DtpPuAUImEJ77x3BJZtS35_ihlkYyFs4IKbCfDFvFRDDAzo49M35IEUSwScRxNv',
  PREVIEW_THUMB: 'https://lh3.googleusercontent.com/aida-public/AB6AXuACvjKKoafNjqJUP57PtPEXUE5h0lPf7c9-9AHLf0gv7F-RQwaqSkcdDbtZvgpGjiY12wrwo_vp7BixG5gq3YgTNcQ4AGKa8mn2ETXeUOnaiwuQg9Ngk5JTxye7PARHoldvutfEis25nYBqNFxD7o2ruiS2JS_BWqJ4SBlv8LmST2zdywRIDz9cx3BpWJX3tzDBaz6EHs1-GEnpVNh5ByLd0RlWdJJFB0QiCF1eZ5tA9sZZqJN2e0wsbFhB4ZN0f76JWiqRERH7WqDI'
};
