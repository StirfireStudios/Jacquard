export default function handle(textArray, message) {
  for(let line of message.parts) {
    const part = { text: line.text }
    textArray.push(part);  
  }
}
