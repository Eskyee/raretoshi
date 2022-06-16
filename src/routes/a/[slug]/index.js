import { newapi as api } from "$lib/api";
import { getArtworkBySlug, getArtworksByArtist } from "$queries/artworks";
import branding from "$lib/branding";
const host = import.meta.env.VITE_HOST;

export async function get({ request: { headers }, locals, params }) {
  let { slug } = params;
  let { q } = locals;

  let { artworks } = await q(getArtworkBySlug, { slug });
  let artwork = artworks[0];

  let { artworks: others } = await q(getArtworksByArtist, {
    id: artwork.artist_id,
    limit: 5,
  });

  let { id } = artwork;
  others = others.filter((a) => a.id !== id).slice(0, 3);

  let metadata = { ...branding.meta };
  metadata.title = metadata.title + " - " + artwork.title;
  metadata.keywords =
    metadata.keywords + " " + artwork.tags.map((t) => t.tag).join(" ");
  metadata.description = artwork.description.replace(/(?:\r\n|\r|\n)/g, " ");

  let type = "image";
  metadata[type] = `${host}/api/public/${artwork.filename}.png`;
  if (artwork.filetype.includes("video")) type = "video";

  metadata[type] = `${host}/api/public/${artwork.filename}.${
    artwork.filetype.split("/")[1]
  }`;

  let location;
  if (artwork.num_editions === 1) location = `/a/${slug}/1`;
  if (artwork.num_editions > 1) location = `/a/${slug}/editions `;
  if (location) return { status: 302, headers: { location }};

  return { body: { artwork, others, metadata } };
}
