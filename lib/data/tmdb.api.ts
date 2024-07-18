const apiKey = process.env.TMDB_API_READ_ACCESS_TOKEN;
const imageBaseString = "https://image.tmdb.org/t/p/w200";
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${apiKey}`,
  },
};

export async function fetchMovieInfo(title: string, year: number) {
  const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
    title
  )}&include_adult=false&language=en-US&page=1&append_to_response=credits,videos`;

  const data = await fetch(url, options)
    .then((response) => response.json())
    .then((data) => {
      // console.log(data);
      const topResult = data.results[0];

      return {
        ...topResult,
        image: `${imageBaseString}${topResult.poster_path}`,
      };
    });

  return data;
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
      console.log("json:", json);
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
