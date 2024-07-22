export function Movie({ movie }: any) {
  const { title, year, data } = movie;
  const { id, image, release_date, overview } = data;

  return (
    <div className="flex flex-col" id={id}>
      <div>
        <img
          src={image}
          alt={`${title} poster`}
          className="w-48 h-72 rounded-md"
        />
      </div>
      <div className="flex-row">
        <pre>{JSON.stringify(data)}</pre>
        <div>Title: {title}</div>
        <div>Released: {release_date}</div>
        <div>{overview}</div>
      </div>
    </div>
  );
}

export function Movies({ movies }: any) {
  const m = movies.map((movie: any, index: number) => (
    // @ts-ignore
    <Movie key={index} movie={movie} />
  ));

  return <div>{m}</div>;
}
