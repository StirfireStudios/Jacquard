export default function handle(newState, message) {
  const funcObj = {
    name: message.name,
    index: message.index,
    args: message.args,
  }
  if (!message.returnRequired) {
    newState.text.push({function: funcObj});
    return false;
  } else {
    newState.currentFunc = funcObj;
    return true;
  }
}
