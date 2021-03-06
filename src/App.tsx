import React from "react";
import { useSelector } from "react-redux";

import { RootState } from "./store/store";

import "./App.css";

// Components:
import Input from "./Components/Input";
import Output from "./Components/Output";
import Loading from "./Components/Loading";
import HowItWorks from "./Components/HowItWorks";

interface Props {}

const App = (props: Props) => {
  const showInput: boolean = useSelector(
    (state: RootState) => state.AppState.showInput
  );
  const showOutput: boolean = useSelector(
    (state: RootState) => state.AppState.showOutput
  );
  const showLoading: boolean = useSelector(
    (state: RootState) => state.AppState.showLoading
  );

  return (
    <div>
      {showInput ? (
        <div style={{height:"100vh"}}>
          <Input />
          <HowItWorks />
        </div>
      ) : (
        <div />
      )}
      {showOutput ? <Output /> : <div />}
      {showLoading ? <Loading /> : <div />}
    </div>
  );
};

export default App;
