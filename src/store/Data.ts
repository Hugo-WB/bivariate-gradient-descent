import Regression from "../Algorithms/Regression";

interface output{
  latexEquation:string,
  values:number[]
}
interface DataType {
  inputData:number[][],
  regression:Regression|undefined,
  regressionLineData:number[][],
  outputData:output,
}

const initialData: DataType = {
  inputData:[],
  regressionLineData:[],
  regression:undefined,
  outputData:{
    latexEquation:"",
    values:[]
  }
};

const Data = (state = initialData, action: any): DataType => {
  switch (action.type) {
    case "setInputData":
      return {
        ...state,
        inputData:action.inputData,
      };
    case "setRegressionLineData":
      return {
        ...state,
        regressionLineData:action.regressionLineData,
      }
    case "setRegression":
      return {
        ...state,
        regression:action.regression
      }
    case "setOutputData":
      return {
        ...state,
        outputData:action.outputData
      }
    default:
      return {
        ...state,
      };
  }
};

export default Data;
