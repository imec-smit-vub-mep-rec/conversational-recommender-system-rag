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
      className={`flex flex-row gap-2 cursor-pointer rounded-lg border bg-white p-0 hover:bg-zinc-50 dark:bg-zinc-950 dark:hover:bg-zinc-900
        }`}
      onClick={() => {
        if (submitMessage) submitMessage(starter.prompt);
      }}
    >
      <div>
        {starter.image && (
          <img
            src={starter.image.url || "https://placehold.co/200x300"}
            className="w-16 h-16 rounded-tl-lg rounded-bl-lg object-cover"
          />
        )}
      </div>
      <div className="flex flex-col justify-center ml-2">
        <div className="text-sm font-semibold">{starter.heading}</div>
        <div className="text-sm text-zinc-600">{starter.subheading}</div>
      </div>
    </div>
  ));

  return (
    <div className="mb-4 grid grid-cols-2 gap-2 px-4 sm:px-0">{cards}</div>
  );
}
