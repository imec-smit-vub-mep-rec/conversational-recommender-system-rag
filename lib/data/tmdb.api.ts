export async function fetchMovieInfo(title: string, year: number) {
  const apiKey = process.env.TMDB_API_READ_ACCESS_TOKEN;
  const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
    title
  )}&include_adult=false&language=en-US&page=1&append_to_response=credits,videos`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
  };

  const data = await fetch(url, options)
    .then((response) => response.json())
    .then((data) => {
      // console.log(data);
      const topResult = data.results[0];
      const imageBaseString = "https://image.tmdb.org/t/p/w200";

      return {
        ...topResult,
        image: `${imageBaseString}${topResult.poster_path}`,
      };
    });

  return data;
}
