interface AppStateType {
  showInput: boolean;
  showOutput: boolean;
  showLoading:boolean;
}

const initialData: AppStateType = {
  showInput: true,
  showOutput: false,
  showLoading:false,
};

const Data = (state = initialData, action: any): AppStateType => {
  switch (action.type) {
    case "setAppState":
      return action.appState;
    default:
      return {
        ...state,
      };
  }
};

export default Data;
