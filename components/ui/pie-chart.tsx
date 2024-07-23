import { PieChart } from "react-minimal-pie-chart";
export interface Theme {
  theme: string;
  amount: number;
}
interface PieChartData {
  themes: Theme[];
}

export default function PieChartComponent({ themes }: PieChartData) {
  if (!themes || themes.length < 1) return null;
  return (
    <div className="flex justify-center items-center">
      <PieChart
        data={themes.map((theme) => ({
          title: theme.theme,
          value: theme.amount,
          color: pickRandomLightColor(), // Generate random color for each theme
        }))}
        label={({ dataEntry }) => dataEntry.title}
        labelStyle={{ fontSize: "5px" }}
        style={{ height: "300px", width: "300px" }}
      />
    </div>
  );
}

function pickRandomLightColor() {
  const letters = "BCDEF".split("");
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * letters.length)];
  }
  return color;
}
