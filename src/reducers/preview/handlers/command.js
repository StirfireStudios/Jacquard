export default function handle(textArray, message) {
  textArray.push({command: message.args});
}
