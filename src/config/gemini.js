import { GoogleGenAI } from "@google/genai";

const apiKey = "";
const ai = new GoogleGenAI({ apiKey: apiKey }); // Assumes GEMINI_API_KEY is set

// async function run(prompt, onChunk) {
//   const responseStream = await ai.models.generateContentStream({
//     model: "gemini-2.5-flash",
//     contents: prompt,
//   });

//   for await (const chunk of responseStream) {
//     console.log(chunk.text);
//     onChunk(chunk.text);
//   }
//   console.log(); // for a final newline
// }

export async function runChatStreamSession(
  prompt = "",
  onChunk = "",
  currentChatObject,
  setIsNewChat,
  setCurrentChatObject,
  setIsLoading
) {
  // 1. Start a new chat session (stateful)

  setIsLoading(true);
  try {
    let chat = currentChatObject;
    if (!chat) {
      chat = ai.chats.create({ model: "gemini-2.5-flash" });
      setIsNewChat(true);
      setCurrentChatObject(chat);
      console.log(chat);
    } else {
      setIsNewChat(false);
    }

    // 2. Send the message as a stream
    const responseStream = await chat.sendMessageStream({
      message: prompt,
    });

    setIsLoading(false);
    // 3. Iterate over the stream and print each chunk of text
    for await (const chunk of responseStream) {
      // Only print the text part of the chunk
      if (chunk.text) {
        onChunk(chunk.text);
      }
    }
  } catch (e) {
    console.error(e);
    onChunk("[Error occurred while generating response]");
  }
}

//export default run;
export default runChatStreamSession;
