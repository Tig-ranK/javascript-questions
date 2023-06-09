import fetch from "node-fetch";
import { markdownToJson } from "./util.js";
import { randomUUID } from "crypto";

export default async (req, res) => {

   async function getQuestionsFromAPI() {
      try {
         const data = await fetch(
            "https://api.github.com/repos/lydiahallie/javascript-questions/readme",
            {
               headers: {
                  Authorization: `Bearer ${
                     // eslint-disable-next-line no-undef
                     process.env.GITHUB_ACCESS_TOKEN
                  }`,
               },
            }
         ).then((res) => res.json());

         // eslint-disable-next-line no-undef
         const questions = Buffer.from(data.content, "base64").toString(
            "utf-8"
         );

         return questions;
      } catch (err) {
         console.error(err);
      }
   }

   try {
      const questionsRaw = await getQuestionsFromAPI();
      const questionsRawArray = questionsRaw.split("###### ");
      questionsRawArray.shift();

      const questions = questionsRawArray
         .map(markdownToJson)
         .map((q) => ({ id: randomUUID(), ...q }));

      res.json(questions);
   } catch (err) {
      console.error(err);
   }
};
