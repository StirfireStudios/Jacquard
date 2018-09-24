import handleCommand from './command';
import handleShowText from './showText';
import { Messages } from 'jacquard-runtime'

function extractTextLine(message) {
  for(let subMessage of message.messages) {
    if (subMessage.constructor == Messages.Text.Show) {
      const text = []
      handleShowText(text, subMessage);
      return text;
    }
  } 
  return null;
}

export default function handle(state, message, runtime) {
  state.originalIP = runtime.currentInstructionPointer;
  state.options = [];
  const options = message.options;
  for(let optionIP of options) {
    const option = {data: optionIP, text: []};
    runtime.moveInstructionPointerTo(optionIP);
    let keepRunning = true;
    while(keepRunning) {
      const message = runtime.run();
      if (message != null) {
        switch(message.constructor) {
          case Messages.DialogueSegment:            
            const text = extractTextLine(message);
            if (text != null) {
              keepRunning = false;
              option.text = text;
            }
            keepRunning = text == null;
            break;
            case Messages.Command:
            handleCommand(option.text, message);
            break;
          default:
            throw new Error("Can't display option due to bad command");
        }
      }  
    }
    state.options.push(option);
  }
}
