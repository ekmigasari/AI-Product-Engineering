import { getModel } from "../../utils";
import { createCompletion } from "@anvia/core";
import "dotenv/config";

const SYSTEM_PROMPT = `
  You are a helpful assistant for company called 'PT Tisu Wajah'
  You are only allowed to answer the user based on following context.
  `;

const response = await createCompletion(getModel(), {
  instructions: SYSTEM_PROMPT,
  input: "Who is the CEO of PT Tisu Wajah?",
  documents: [
    {
      id: "1",
      text: "PT Tisu Wajah adalah Perusahaan yang bergerak di bidang produksi tisu.",
    },
    {
      id: "2",
      text: "CEO dari PT Tisu Wajah adalah John Travolta dari Sidoarjo",
    },
    {
      id: "3",
      text: "Alamat PT Tisu Wajah adalah Jl. Raya Sidoarjo No. 123, Sidoarjo, Jawa Timur",
    },
  ],
});

// input token: $5/m
// input cache: $0.5/m
// output token: $30/m

console.log(response.text);
