import { useState } from "react";
import { YouTubeEmbed } from "./ui/youtube-embed";
import { Badge } from "./ui/badge";
import Image from "next/image";
import {
  IconCalendar,
  IconClock,
  IconEye,
  IconStarFilled,
} from "@tabler/icons-react";
import { convertMinutesToHours } from "@/lib/helpers/time";
import PieChartComponent from "./ui/pie-chart";
import Accordion from "./ui/accordion";

export function Movie({ movie, query, setQuery }: any) {
  const {
    title,
    year,
    synopsis,
    reasons_to_like,
    reasons_to_dislike,
    themes,
    api_data,
  } = movie;
  const {
    id,
    image,
    release_date,
    overview,
    trailer,
    cast,
    director,
    genres,
    datePublished,
    duration,
    rating,
    description,
  } = api_data;

  const [watchTrailer, setWatchTrailer] = useState(false);

  if (watchTrailer) {
    return (
      <YouTubeEmbed
        title={title}
        trailerUrl={trailer}
        setWatchTrailer={setWatchTrailer}
      />
    );
  }

  return (
    <div className="flex items-center justify-center">
      <div className="mx-auto bg-white rounded-lg shadow-xl flex">
        <div className="w-1/3 relative bg-red">
          <Image
            src={image}
            alt={title}
            width={375}
            height={200}
            className="rounded-l-lg justify-center grid object-cover h-full w-full"
            style={{ height: '100%', width: '100%', objectFit: 'cover' }}
          />
        </div>

        <div className="grid rounded-lg w-2/3 shadow-sm flex-grow p-3 px-5 z-10">
          <a
            href={`${image}`}
            className="hover:text-cyan-700 font-bold sm:text-xl line-clamp-2"
          >
            {title} ({datePublished.split("-")[0]})
          </a>
          <div className="flex gap-5 pt-2 font-semibold">
            <div className="flex align-middle items-center gap-1">
              <IconStarFilled
                className="inline-block w-3 h-3 text-yellow-400"
                aria-hidden="true"
              />
              {parseFloat(rating).toFixed(2)}
            </div>
            <div className="flex align-middle items-center gap-1">
              <IconClock
                className="inline-block w-3 h-3 text-yellow-400"
                aria-hidden="true"
              />{" "}
              {convertMinutesToHours(parseInt(duration))}
            </div>
            <div
              className="flex align-middle items-center gap-1 hover:bg-zinc-200/40 px-2 py-1 rounded-md cursor-pointer"
              onClick={() => setWatchTrailer(true)}
            >
              <IconCalendar
                className="inline-block w-3 h-3 text-yellow-400 "
                aria-hidden="true"
              />{" "}
              <span>{datePublished}</span>
            </div>
            <div
              className="flex align-middle items-center gap-1 hover:bg-zinc-200/40 px-2 py-1 rounded-md cursor-pointer"
              onClick={() => setWatchTrailer(true)}
            >
              <IconEye
                className="inline-block w-3 h-3 text-yellow-400 "
                aria-hidden="true"
              />{" "}
              <span>Watch trailer</span>
            </div>
          </div>
          <div className="h-13">
            <span className="line-clamp-4 py-2 text-sm font-light leading-relaxed">
              {synopsis}{" "}
            </span>
          </div>
          <div className="my-2">
            <span className="text-sm font-semibold mr-1 ">Director:</span>
            <Badge color="orange" selected={query.director == director}>
              <input
                id={`${id}-director-${director}`}
                aria-describedby="comments-description"
                name="comments"
                type="checkbox"
                className="h-0 w-0 rounded hidden"
                checked={query.director == director}
                onChange={() => {
                  if (query.director == director) {
                    setQuery({ ...query, director: undefined });
                  } else {
                    setQuery({ ...query, director });
                  }
                }}
              />
              <label htmlFor={`${id}-director-${director}`}>{director}</label>
            </Badge>
          </div>
          <div className="my-2">
            <span className="text-sm font-semibold mr-1">Genres:</span>
            {genres.map((genre: string, index: number) => (
              <Badge
                color="purple"
                key={`${title}-${index}`}
                selected={query.genres?.includes(genre)}
              >
                <input
                  id={`${id}-genre-${genre}`}
                  aria-describedby="comments-description"
                  name="comments"
                  type="checkbox"
                  className="hidden"
                  checked={query.genres?.includes(genre)}
                  onChange={() => {
                    if (query.genres?.includes(genre)) {
                      setQuery({
                        ...query,
                        genres: query.genres.filter((g: string) => g !== genre),
                      });
                    } else {
                      setQuery({ ...query, genres: [...query.genres, genre] });
                    }
                  }}
                />
                <label htmlFor={`${id}-genre-${genre}`}>{genre}</label>
              </Badge>
            ))}
          </div>
          <div>
            <Accordion
              items={[
                {
                  title: "Cast",
                  content: cast.map((actor: string, index: number) => (
                    <Badge
                      color="pink"
                      selected={query.actors?.includes(actor)}
                      key={`${title}-actor-${index}`}
                    >
                      <input
                        id={`${id}-actor-` + actor}
                        aria-describedby="comments-description"
                        name="comments"
                        type="checkbox"
                        className="hidden"
                        checked={query.actors?.includes(actor)}
                        onChange={() => {
                          if (query.actors?.includes(actor)) {
                            setQuery({
                              ...query,
                              actors: query.actors?.filter(
                                (a: string) => a !== actor
                              ),
                            });
                          } else {
                            setQuery({
                              ...query,
                              actors: [...query.actors, actor],
                            });
                          }
                        }}
                      />
                      <label htmlFor={`${id}-actor-` + actor}>{actor}</label>
                    </Badge>
                  )),
                },
                /*
                {
                  title: "Neutral description",
                  content: description,
                },*/
                /*{ title: 'Reviews summary', content: movie.ReviewBody },*/
                {
                  title: "Why you may like it",
                  content: reasons_to_like?.toString() || "",
                },
                ...(reasons_to_dislike
                  ? [
                      {
                        title: "Why you may not like it",
                        content: reasons_to_dislike || "",
                      },
                    ]
                  : []),
                {
                  title: "Themes",
                  content: <PieChartComponent themes={themes || []} />,
                },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export interface RefineSearchQuery {
  actors?: string[];
  genres?: string[];
  keywords?: string[];
  rating?: number;
  year?: number;
  duration?: number;
  director?: string;
  like_titles?: string[];
  language?: string;
}

interface MoviesProps {
  introduction: string;
  movies: any[];
  submitMessage: (prompt: string) => void;
}

export function Movies({ introduction, movies, submitMessage }: MoviesProps) {
  const [query, setQuery] = useState<RefineSearchQuery>({
    actors: [],
    genres: [],
    director: undefined,
  });

  const handleRefine = async () => {
    if (!query.actors && !query.director && !query.genres) return;

    const userMessage = `Recommend multiple 
    ${
      query?.genres && query?.genres?.length > 0
        ? query.genres?.toString().toLowerCase()
        : ""
    } 
    movies ${
      query?.actors && query?.actors?.length > 0
        ? "starring " + query.actors?.toString()
        : ""
    } 
    ${
      query?.director
        ? "directed by " + query.director + " or a similar director"
        : ""
    }
    .`;

    if (submitMessage) submitMessage(userMessage);
  };

  const m = movies.map((movie: any, index: number) => (
    // @ts-ignore
    <Movie key={index} movie={movie} query={query} setQuery={setQuery} />
  ));

  const submitQueryComponent =
    Object.keys(query).length > 0 ? (
      <button
        onClick={handleRefine}
        className="bg-primary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Refine search &rarr;
      </button>
    ) : null;

  return (
    <div className="relative">
      {introduction && <p className="mb-2">{introduction}</p>}
      <div className="mb-4 flex flex-col gap-2 pb-4 text-sm sm:flex-col">
        {m}
        <div className="m-auto z-10">{submitQueryComponent}</div>
      </div>
    </div>
  );
}
