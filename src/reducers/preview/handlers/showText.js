export default function handle(textArray, message) {
  for(let line of message.parts) {
    const part = { text: line.text }
    if (line.localizedCharacterName != null) {
      part.characterName = line.localizedCharacterName;
    }
    textArray.push(part);  
  }
}
