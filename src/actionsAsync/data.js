import * as DataActions from '../actions/data';

import { FileIO } from 'jacquard-runtime'

export function LoadFile(file) {
  DataActions.LoadStarted(file.name);
  FileIO.Open(file).then((data) => {
    switch(FileIO.Type(data)) {
      case FileIO.Types.Logic:
        DataActions.LoadComplete('logic', file.name, data);
        break;
      case FileIO.Types.Dialogue:
        DataActions.LoadComplete('dialogue', file.name, data);
        break;
      case FileIO.Types.SourceMap:
        DataActions.LoadComplete('sourceMap', file.name, data);
        break;
      case FileIO.Types.Unknown:
      default:
        DataActions.ErrorLoading(file.name, `Unknown file type`);
        break;
    }
  }).catch((error) => {
    console.log(error);
    if (error != null) {
      DataActions.ErrorLoading(file.name, error);
      return;
    }    
  });
}