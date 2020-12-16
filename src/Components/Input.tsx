/* eslint-disable react-hooks/exhaustive-deps */
import React, { ReactElement, useState } from "react";
import { useDispatch} from "react-redux";
import {
  Button,
  Dropdown,
  DropdownItemProps,
  Message,
  Input as InputSemantic,
  Checkbox,
} from "semantic-ui-react";

import Regression from "../Algorithms/Regression";

import "./Input.css";


import { parse } from "mathjs";

interface Props {}

export default function Input({}: Props): ReactElement {
  const regressionTypes: DropdownItemProps[] = [
    { text: "Linear", value: "(a*x)+b" },
    { text: "Exponential", value: "a*(b^x)" },
    { text: "Quadratic", value: "(a*(x^2)) + b" },
    { text: "Custom", value: "Custom" },
    // { text: "Logarithmic",va},
  ];
  const typesToOptions: { [key: string]: any } = {
    Linear: { alpha: "0.01", iterations: "4000" },
    Exponential: { alpha: "0.005", iterations: "4000" },
    Quadratic: { alpha: "0.005", iterations: "4000" },
    Custom: { alpha: "0.001", iterations: '5000' },
  };

  const textAreaPlaceholder: string = "x followed by y: \n0,1,2,3,4,5\n0,1,2,3,4,5";
  // redux dispatch:
  const dispatch = useDispatch();
  // text area text:
  let [text, setText] = useState<string>("");
  let [error, setError] = useState<string>("");
  let [regressionEquation, setRegressionEquation] = useState<string>("(a*x)+b");
  let [options, setOptions] = useState({
    alpha: typesToOptions["Linear"].alpha,
    iterations: typesToOptions["Linear"].iterations,
  });
  let [starting, setStarting] = useState<[string, string]>(["0", "0"]);
  let [showAdvanced,setShowAdvanced] = useState<boolean>(false);
  let [custom,setCustom] = useState<boolean>(false)

  let handleTextAreaChange = (event: any) => {
    setText(event.target.value);
  };
  let handleDropdown = (event: any, data: any) => {
    if (event.target.textContent === "Custom"){
      setCustom(true)
      setRegressionEquation("");
    }else{
      setRegressionEquation(data.value);
      setCustom(false)
    }
    setOptions(typesToOptions[event.target.textContent]);
  };
  let handleOptions = (event: any, data: any) => {
    console.log({ event, data });
    switch (data.label) {
      case "Starting A":
        setStarting([data.value, starting[1]]);
        break;
      case "Starting B":
        setStarting([starting[0], data.value]);
        break;
      case "alpha":
        setOptions({ ...options, alpha: data.value });
        break;
      case "iterations":
        setOptions({ ...options, iterations: data.value });
        break;
      default:
        break;
    }
  };

  let calculate = async () => {
    // Formatting + Input checking:
    let formattedInput: number[][] = formatInput(text);
    if (formattedInput.length !== 2) {
      setError("Invalid Input, Please try again");
      return;
    }
    if (formattedInput[0].length !== formattedInput[1].length) {
      setError("Make sure length of x and y are the same! Please try again");
      return;
    }
    // check if all the options are valid:
    try {
      parseInt(options.iterations)
      Number(options.alpha)
      Number(starting[0])
      Number(starting[1])
    } catch (error) {
      setError("Invalid Input, Please try again");
      return;
    }
    try{
      parse(regressionEquation)
    }catch(error){
      setError("Invalid Custom function")
      return
    }

    // show loading screen
    dispatch({
      type: "setAppState",
      appState: {
        showInput: false,
        showLoading: true,
        showOutput: false,
      },
    });
    // intialize regression class with all the options
    let regression: Regression = new Regression(
      regressionEquation,
      formattedInput,
      Number(options.alpha),
      Number(options.iterations),
      [Number(starting[0]),Number(starting[1])]
    );
    // add the regression class to the store, with the input data.
    dispatch({ type: "setInputData", inputData: formattedInput });
    dispatch({
      type: "setRegression",
      regression: regression,
    });
  };

  let formatInput = (input: string): number[][] => {
    // formats the input, turning the textarea string into a 2d array of numbers
    try {
      // split string by \n to get an array of lines
      let lines = input.split("\n");
      let numberLines = lines.map((line) => {
        // Split line by commas
        let splitLine = line.split(",");
        // convert each value from a string to a number
        let numberLine = splitLine.map((number) => parseFloat(number));
        return numberLine;
      });
      return numberLines;
    } catch (error) {
      return [];
    }
  };

  return (
    <div className="flexStartVertically">
      <div className="flexAroundHorizontally" style={{maxWidth:"1000px"}} id="inputs">
        <Dropdown
          fluid
          selection
          options={regressionTypes}
          onChange={handleDropdown}
          // set linear as default
          defaultValue="(a*x)+b"
          style={{minWidth:"200px"}}
        />
        <Checkbox label = "Show advanced settings" checked = {showAdvanced} onClick = {()=>setShowAdvanced(!showAdvanced)}/>
        {showAdvanced?(<div>
        <InputSemantic
          label="alpha"
          value={options.alpha}
          onChange={handleOptions}
          size={"small"}
        />
        <InputSemantic
          label="iterations"
          value={options.iterations}
          onChange={handleOptions}
        />
        <InputSemantic
          label="Starting A"
          value={starting[0]}
          onChange={handleOptions}
        />
        <InputSemantic
          label="Starting B"
          value={starting[1]}
          onChange={handleOptions}
        />

        </div>):<div/>}
      </div>
      <div className="flexAroundHorizontally">
        <InputSemantic label={custom?"Custom Equation":"Equation"} placeholder="(a*x) + b" onChange={(event,data)=>setRegressionEquation(data.value)} value={regressionEquation} disabled={!custom} />
      </div>
      <div className="flexAroundHorizontally">
        <textarea
          placeholder={textAreaPlaceholder}
          value={text}
          onChange={handleTextAreaChange}
        />
      </div>
      {error === "" ? (
        <div />
      ) : (
        <div className="flexAroundHorizontally">
          <Message error>{error}</Message>
        </div>
      )}
      <div className="flexAroundHorizontally buttonContainer">
        <Button color="teal" onClick={calculate}>
          Calculate
        </Button>
      </div>
    </div>
  );
}
