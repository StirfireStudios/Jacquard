export default function handle(textArray, message) {
  for(let line of message.parts) {
    let textString = "";
    if (line.localizedCharacterName != null) {
      textString += line.localizedCharacterName + ": ";
    }
    textString += line.text;
    textArray.push({ text: textString});  
  }
}