"use client";
export const YouTubeEmbed = ({
  title,
  trailerUrl,
  setWatchTrailer,
}: {
  title: string;
  trailerUrl: string;
  setWatchTrailer: Function;
}) => {
  if (!trailerUrl) {
    return <span className="h-[315px] text-center">No trailer found...</span>;
  }

  return (
    <div className="flex flex-col">
      <button onClick={() => setWatchTrailer(false)}>&larr; Back</button>
      <iframe
        width="560"
        height="315"
        src={trailerUrl}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
      ></iframe>
    </div>
  );
};
