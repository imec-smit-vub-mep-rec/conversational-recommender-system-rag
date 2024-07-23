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
        <div className="w-1/4 relative">
          <Image
            src={image}
            alt={title}
            width={375}
            height={200}
            className="rounded-t-lg justify-center grid h-80 object-cover"
          />
        </div>

        <div className="grid rounded-lg w-3/4 shadow-sm flex-grow p-3 px-5 z-10">
          <a
            href={`${image}`}
            className="group-hover:text-cyan-700 font-bold sm:text-2xl line-clamp-2"
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
          <div className="h-28">
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
                onChange={() => console.log("to implement")}
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
                  onChange={() => console.log("to implement")}
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
                        onChange={() => console.log("to implement")}
                      />
                      <label htmlFor={`${id}-actor-` + actor}>{actor}</label>
                    </Badge>
                  )),
                },
                {
                  title: "Neutral description",
                  content: description,
                },
                /*{ title: 'Reviews summary', content: movie.ReviewBody },*/
                {
                  title: "Why you may like it",
                  content: reasons_to_like.toString() || "",
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

export function Movies({ introduction, movies }: any) {
  const [query, setQuery] = useState({});
  const m = movies.map((movie: any, index: number) => (
    // @ts-ignore
    <Movie key={index} movie={movie} query={query} setQuery={setQuery} />
  ));

  return (
    <div>
      {introduction && <p className="mb-2">{introduction}</p>}
      <div className="mb-4 flex flex-col gap-2 overflow-y-scroll pb-4 text-sm sm:flex-col">
        {m}
      </div>
    </div>
  );
}
