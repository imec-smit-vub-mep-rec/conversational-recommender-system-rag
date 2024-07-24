export const Badge = ({
  color = "gray",
  selected,
  children,
}: {
  color: string;
  selected?: boolean;
  children: any;
}) => {
  const backGroundColor = selected ? "bg-primary" : `bg-muted`;
  const textColor = selected ? "text-white" : `text-black`;
  return (
    <span
      className={`inline-flex items-center rounded-full ${backGroundColor} px-2 py-1 mr-2 text-xs font-medium ${textColor} ring-1 ring-inset ring-${color}`}
    >
      {children}
    </span>
  );
};
