import handleShowText from './showText';
import handleCommand from './command';
import { Messages } from 'jacquard-runtime'

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
          case Messages.Text.Show:
            handleShowText(option.text, message);
            keepRunning = false;
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
