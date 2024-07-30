export interface TMDBMovie {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}
interface Collection {
  id: number;
  name: string;
  poster_path: string;
  backdrop_path: string;
}

interface Genre {
  id: number;
  name: string;
}

interface ProductionCompany {
  id: number;
  logo_path: string;
  name: string;
  origin_country: string;
}

interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  size: number;
  type: string;
}

interface Videos {
  results: Video[];
}

interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string;
}

interface Crew {
  id: number;
  name: string;
  job: string;
  profile_path: string;
}

interface Credits {
  cast: Cast[];
  crew: Crew[];
}
export interface TMDBDetails {
  adult: boolean;
  backdrop_path: string;
  belongs_to_collection: Collection;
  budget: number;
  genres: Genre[];
  homepage: string;
  id: number;
  imdb_id: string;
  origin_country: string[];
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  release_date: string;
  revenue: number;
  runtime: number;
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
  videos: Videos;
  credits: Credits;
}

const apiKey = process.env.TMDB_API_READ_ACCESS_TOKEN;
const imageBaseString = "https://image.tmdb.org/t/p/w400";
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${apiKey}`,
  },
};

export async function getMovieDetails(title: string, year: number) {
  const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
    title
  )}&year=${year}&include_adult=false&language=en-US&page=1&limit=1`;
  console.log(url);

  // Step 1: Search for the movie by title and year
  const searchResponse = await fetch(url, options);
  const searchData = await searchResponse.json();

  if (searchData.results.length === 0) {
    throw new Error("Movie not found");
  }

  const movie: TMDBMovie = searchData.results[0];
  const movieId = movie.id;
  //console.log(movie);

  // Step 2: Fetch movie details
  const detailsResponse = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}?append_to_response=videos,credits`,
    options
  );
  const detailsData: TMDBDetails = await detailsResponse.json();
  // console.log("detailsdata: ", JSON.stringify(detailsData));

  // Extracting trailer, cast, and director
  const trailer =
    "https://www.youtube.com/embed/" +
    detailsData.videos.results.find(
      (video: any) => video.type === "Trailer" && video.site === "YouTube"
    )?.key;
  const cast = detailsData.credits.cast.map((a) => a.name);
  const director = detailsData.credits.crew.find(
    (member: any) => member.job === "Director"
  )?.name;
  const genres = detailsData.genres.map((genre) => genre.name) || [];
  const image = `${imageBaseString}${movie.poster_path}`;

  return {
    id: movieId,
    trailer,
    cast,
    director,
    image,
    genres,
    description: detailsData.overview,
    rating: detailsData.vote_average,
    datePublished: detailsData.release_date,
    duration: detailsData.runtime,
  };
}

export async function getMoviePoster(name: string) {
  const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
    name
  )}&include_adult=false&language=en-US&page=1`;
  const response = await fetch(url, options);
  const data = await response.json();
  const image = data.results[0]?.poster_path
    ? `${imageBaseString}${data.results[0].poster_path}`
    : "";

  return image;
}

export async function getActorImage(actorName: string) {
  let image = imageBaseString + "/ar33qcWbEgREn07ZpXv5Pbj8hbM.jpg"; // Default to Nicolas Cage
  const url = `https://api.themoviedb.org/3/search/person?query=${encodeURIComponent(
    actorName
  )}&include_adult=false&language=en-US&page=1`;

  await fetch(url, options)
    .then((res) => res.json())
    .then((json) => {
      image = imageBaseString + json.results[0].profile_path;
    })
    .catch((err) => console.error("error:" + err));

  return image;
}

export async function fetchImageUrl(image: any) {
  let url: string | undefined = "";
  if (image.type === "movie") {
    url = await getMoviePoster(image.query);
  } else if (image.type === "person") {
    url = await getActorImage(image.query);
  }

  return url;
}
