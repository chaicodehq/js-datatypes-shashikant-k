/**
 * 💬 WhatsApp Message Parser
 *
 * Chintu ek WhatsApp chat analyzer bana raha hai. Usse raw WhatsApp
 * exported message line parse karni hai aur usme se date, time, sender,
 * aur message alag alag extract karna hai.
 *
 * WhatsApp export format:
 *   "DD/MM/YYYY, HH:MM - Sender Name: Message text here"
 *
 * Rules:
 *   - Date extract karo: string ke start se pehle ", " (comma-space) tak
 *   - Time extract karo: ", " ke baad se " - " (space-dash-space) tak
 *   - Sender extract karo: " - " ke baad se pehle ": " (colon-space) tak
 *   - Message text extract karo: pehle ": " ke baad (after sender) sab kuch, trimmed
 *   - wordCount: message ke words count karo (split by space, filter empty strings)
 *   - Sentiment detection (case-insensitive check on message text):
 *     - Agar message mein "😂" ya ":)" ya "haha" hai => sentiment = "funny"
 *     - Agar message mein "❤" ya "love" ya "pyaar" hai => sentiment = "love"
 *     - Otherwise => sentiment = "neutral"
 *     - Agar dono match hote hain, "funny" gets priority
 *   - Hint: Use indexOf(), substring()/slice(), includes(), split(),
 *     trim(), toLowerCase()
 *
 * Validation:
 *   - Agar input string nahi hai, return null
 *   - Agar string mein " - " nahi hai ya ": " nahi hai (after sender), return null
 *
 * @param {string} message - Raw WhatsApp exported message line
 * @returns {{ date: string, time: string, sender: string, text: string, wordCount: number, sentiment: string } | null}
 *
 * @example
 *   parseWhatsAppMessage("25/01/2025, 14:30 - Rahul: Bhai party kab hai? 😂")
 *   // => { date: "25/01/2025", time: "14:30", sender: "Rahul",
 *   //      text: "Bhai party kab hai? 😂", wordCount: 5, sentiment: "funny" }
 *
 *   parseWhatsAppMessage("01/12/2024, 09:15 - Priya: I love this song")
 *   // => { date: "01/12/2024", time: "09:15", sender: "Priya",
 *   //      text: "I love this song", wordCount: 4, sentiment: "love" }
 */
export function parseWhatsAppMessage(message) {
  if (typeof message !== "string" || message.trim() === "") return null;

  const extractDate = (message) => {
    const commaIndex = message.indexOf(", ");
    if (commaIndex === -1) return null;

    return message.substring(0, commaIndex);
  };

  const extractTime = (message) => {
    const commaIndex = message.indexOf(", ");
    if (commaIndex === -1) return null;

    const timeStart = commaIndex + 2;
    const timeEnd = message.indexOf(" - ", timeStart);

    if (timeEnd === -1) return null;

    return message.substring(timeStart, timeEnd);
  };

  const extractSender = (message) => {
    const dashIndex = message.indexOf(" - ");
    if (dashIndex === -1) return null;

    const colonIndex = message.indexOf(": ", dashIndex);
    if (colonIndex === -1) return null;

    return message.substring(dashIndex + 3, colonIndex);
  };

  const extractMessage = (message) => {
    const colonIndex = message.indexOf(": ");
    if (colonIndex === -1) return null;

    return message.substring(colonIndex + 2).trim();
  };

  const extractWordCount = (message) => {
    const text = extractMessage(message);
    if (text === null) return null;

    return text.split(" ").filter((word) => word !== "").length;
  };

  const extractSentiment = (message) => {
    let text = extractMessage(message);
    if (text === null) return null;

    text = text.toLowerCase();
    if (text.includes("😂") || text.includes(":)") || text.includes("haha")) return "funny" ;
    if (text.includes("❤") || text.includes("love") || text.includes("pyaar")) return "love";

    return "neutral"; 
  };

  const date = extractDate(message);
  const time = extractTime(message);
  const sender = extractSender(message);
  const text = extractMessage(message);
  const wordCount = extractWordCount(message);
  const sentiment = extractSentiment(message);

  if (!date || !time || !sender || !text) return null;

  return {
    date: date,
    time: time,
    sender: sender,
    text: text,
    wordCount: wordCount,
    sentiment: sentiment
  };
}
