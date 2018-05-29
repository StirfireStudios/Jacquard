export default function handle(textArray, message) {
  textArray.push({nodeEntered: message.nodeName});
}