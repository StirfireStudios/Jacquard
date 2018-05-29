export default function handle(textArray, message) {
  const textPart = {
    variable: {name: message.variableName, value: message.value}
  }
  if (message.constructor.name === "Save") {
    textPart.variable.type = "save";
  } else {
    textPart.variable.type = "load";
  }
  textArray.push(textPart);
}