require("dotenv").config();
const csv = require("csv-parser");
const fs = require("fs");
const blogs = [];
let finalFormat = "";
const subtractUrl = "subtractUrl";

const mockGetSummary = (uri) => {
  // prompt: give me a summary within 50 words on this webpage
  return "The blog post discusses the contribution of a Spark loader for Hugging Face datasets, enabling large-scale data processing for natural language processing (NLP) tasks. The post highlights the benefits of using Spark and Hugging Face together and provides code examples for loading and processing datasets.";
};

fs.createReadStream("sample.csv")
  .pipe(csv())
  .on("data", (chunk) => {
    const mockSummary = mockGetSummary(chunk.url);
    blogs.push({
      summary: mockSummary,
      company_name: chunk.company_name,
      blogAndLink:
        `[${chunk.company_name}][${chunk.posted_date}]` +
        "`[" +
        chunk.title +
        "](" +
        chunk.url +
        ")`",
    });
  })
  .on("end", () => {
    const tempCompanyNames = Array.from(
      new Set(blogs.map((e) => e.company_name))
    );
    const lastCompanyName = tempCompanyNames.pop();

    const orderedList = blogs
      .map((e, i) => `  ${i + 1}. ${e.blogAndLink}\n`)
      .join("");

    finalFormat =
      `This ` +
      "`[Subtrack newsletter](" +
      subtractUrl +
      ")`" +
      `collects ${
        blogs.length
      } latest engineering blogs from ${tempCompanyNames.join(", ")} ${
        tempCompanyNames.length !== 0
          ? "and " + lastCompanyName
          : lastCompanyName
      }.\n${orderedList}\n\n${blogs
        .map((e) => `${e.blogAndLink}\nTL; DR\n${"   " + e.summary}\n\n`)
        .join("")}`;

        
    console.log(finalFormat);
  });
