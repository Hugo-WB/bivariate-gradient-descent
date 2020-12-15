import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader";
import { Header } from "semantic-ui-react";
import { RootState } from "../store/store";

interface Props {}

const Loading = (props: Props) => {
  const regression = useSelector((state: RootState) => state.Data.regression);
  const dispatch = useDispatch();
  useEffect(() => {
    // After the loading screen has shown:
    let outputData = {
      // perform regression:
      values: regression?.calculate(),
      // get the equation as latex
      latexEquation:regression?.getLatex(),
    }
    // data to draw the regression line:
    let regressionLineData = regression?.getRegressionLine();
    dispatch({
      type: "setAppState",
      appState: {
        showInput: false,
        showLoading: false,
        showOutput: true,
      },
    });
    dispatch({type:"setOutputData",outputData:outputData})
    dispatch({ type: "setRegressionLineData", regressionLineData: regressionLineData });
    dispatch({ type: "setRegression", regression: regression });
  }, []);
  return (
    <div className="flexStartVertically">
      <div className="flexAroundHorizontally" style={{ margin: "80px" }}>
        <ClimbingBoxLoader size={40} color={"#009c95"} />
      </div>
      <div className="flexAroundHorizontally">
        <Header color="grey">Calculating ...</Header>
      </div>
    </div>
  );
};

export default Loading;
