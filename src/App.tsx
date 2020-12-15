import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { RootState } from "./store/store";

import "./App.css";

// Components:
import Input from "./Components/Input";
import Output from "./Components/Output";
import Loading from "./Components/Loading";

import { Header } from "semantic-ui-react";

interface Props {}

const App = (props: Props) => {
  const showInput = useSelector((state: RootState) => state.AppState.showInput);
  const showOutput = useSelector(
    (state: RootState) => state.AppState.showOutput
  );
  const showLoading = useSelector(
    (state: RootState) => state.AppState.showLoading
  );

  // useEffect(() => {
  //   return () => {
  //   }
  // }, [showInput,showOutput,showLoading])

  return (
    <div>
      {showInput ? <Input /> : <div />}
      {showOutput ? <Output /> : <div />}
      {showLoading ? <Loading /> : <div />}
    </div>
  );
};

export default App;
