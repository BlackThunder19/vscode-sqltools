import { Telemetry } from '@sqltools/core/utils';
import { commands } from 'vscode';
namespace ErrorHandler {
  let telemetry: Telemetry;
  let outputFn = (...args: any[]): Promise<string | void> => void args;
  export function create(message: string, yesCallbackOrCommand?: Function | string): (reason: any) => void {
    return async (error: any): Promise<void> => {
      if (error) {
        if (error.dontNotify || (error.data && error.data.dontNotify)) return;
        telemetry.registerException(error);
        message = `${message} ${error.message ? error.message : error.toString()}`;
      }
      if (typeof yesCallbackOrCommand === 'undefined') {
        outputFn(message);
        return;
      }
      const res = await outputFn(`${message}\nWould you like to see the logs?`, 'Yes', 'No');
      if (res === 'Yes') {
        if (typeof yesCallbackOrCommand === 'function') yesCallbackOrCommand();
        else commands.executeCommand(yesCallbackOrCommand)
      }
    };
  }
  export function setTelemetryClient(cli: Telemetry) {
    telemetry = cli;
  }

  export function setOutputFn(newOutputFn) {
    outputFn = newOutputFn;
  }
}

export default ErrorHandler;
