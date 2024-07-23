/**
 * Next.js API handler that
 * 1. Takes a CSV file
 * 2. Reads every row and creates a string per row in the format <Column name>:<column value>\n
 * 3. Imports this text using createResource
 */
import fs from "fs";
import csv from "csv-parser";
import { createResource } from "@/lib/actions/resources";
import path from "path";

export async function POST(req: Request) {
  const { filePath = undefined } = await req.json();

  const startTime = new Date();
  await load_data(filePath);
  const endTime = new Date();
  const time_elapsed = endTime.getTime() - startTime.getTime();

  return Response.json({ time_elapsed });
}

const load_data = async (
  filePath: string = "/lib/data/example_data_movies.csv"
) => {
  try {
    // 1. Read the CSV file
    readCSVAndFormat(filePath)
      .then(({ headers, rows }) => {
        console.log("Headers:", headers);
        console.log("Rows:", rows);

        // 3. Add rows as resources
        rows.forEach(async (row) => {
          await createResource({ content: row });
        });
      })
      .catch(console.error);
  } catch (error) {
    return error instanceof Error && error.message.length > 0
      ? error.message
      : "Error, please try again.";
  }
};

// Function to read CSV and format each row
function readCSVAndFormat(
  filePath: string
): Promise<{ headers: string[]; rows: string[] }> {
  return new Promise((resolve, reject) => {
    const results: string[] = [];
    let headers: string[] = [];
    let isFirstRow = true;

    const resolvedFilePath = process.cwd() + filePath;
    console.log("Resolved filepath: ", resolvedFilePath);

    fs.createReadStream(resolvedFilePath)
      .pipe(csv({ separator: ";" }))
      .on("data", (data) => {
        if (isFirstRow) {
          headers = Object.keys(data);
          isFirstRow = false;
        }
        let formattedRow = "";
        // 2. Create string per row in the format <Column name>:<column value>\n
        for (const [key, value] of Object.entries(data)) {
          formattedRow += `${key}:${value}`;
        }
        results.push(formattedRow);
      })
      .on("end", () => {
        resolve({ headers, rows: results });
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}
