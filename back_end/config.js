const OpenAI = require("openai");
const prompt = require("./model/content");

const openai = new OpenAI({
  apiKey: process.env.API_KEY,
});

async function askGPT(input, prompt) {
  // const { text } = await prompt.findOne();
  const { choices } = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: prompt,
      },
      ...input,
    ],
    model: "gpt-4-1106-preview",
  });

  const {
    message: { content },
  } = choices[0];
  return content;
}

exports.askGPT = askGPT;
