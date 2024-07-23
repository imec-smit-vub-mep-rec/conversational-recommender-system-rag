type ConversationStarters = {
  heading: string;
  subheading: string;
  prompt: string;
  image: {
    type: string; // 'movie' | 'person'
    query: string;
    url?: string;
  };
};

interface RenderConversionStartersProps {
  starters: ConversationStarters[];
  submitMessage?: (prompt: string) => void;
}

export function ConversionStarters({
  starters,
  submitMessage,
}: RenderConversionStartersProps) {
  const cards = starters.map((starter, index) => (
    <div
      key={starter.heading}
      className="flex w-full flex-row gap-2 cursor-pointer rounded-lg border bg-white p-0 hover:bg-zinc-50 dark:bg-zinc-950 dark:hover:bg-zinc-900"
      onClick={() => {
        if (submitMessage) submitMessage(starter.prompt);
      }}
    >
      <div className="flex-none w-1/3">
        {starter.image && (
          <img
            src={starter.image.url || "https://placehold.co/200x300"}
            className="w-full h-auto rounded-tl-lg rounded-bl-lg object-cover"
          />
        )}
      </div>
      <div className="flex-grow ml-2 p-2 overflow-hidden">
        <div className="text-sm font-semibold" style={{ maxHeight: "128px" }}>
          {starter.heading}
        </div>
        <div
          className="text-sm text-zinc-600 overflow-hidden"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 4,
            WebkitBoxOrient: "vertical",
            maxHeight: "128px",
          }}
        >
          {starter.subheading}
        </div>
      </div>
    </div>
  ));

  return (
    <div className="mb-4 grid grid-cols-2 gap-2 px-4 sm:px-0">{cards}</div>
  );
}
