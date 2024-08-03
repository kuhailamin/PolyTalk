const OpenAI = require("openai");
const prompt = require("./model/content");

// Initialize OpenAI with API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.API_KEY,
});

/**
 * Asks a question to the GPT model using OpenAI's API.
 *
 * @param {Array} input - The array of messages for the chat session.
 * @param {string} prompt - The initial prompt to set the context for the GPT model.
 * @returns {Promise<string>} - The response from the GPT model.
 */

async function askGPT(input, prompt) {
  // const { text } = await prompt.findOne();

  //Creat a completion request to OpentAI's GPT model
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

// Export the askGPT function for use in other modules
exports.askGPT = askGPT;
