import React, { useEffect, useRef, useState } from "react";

import Plotly from "plotly.js-gl3d-dist";
import createPlotlyComponent from "react-plotly.js/factory";

import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

import { RootState } from "src/store/store";
import { useSelector } from "react-redux";
import { Header } from "semantic-ui-react";

interface Props {}

const Output = (props: Props) => {
  const [costSurface, setCostSurface] = useState<any[]>([]);
  const [steps, setSteps] = useState<number[][]>([]);
  useEffect(() => {
    // start calucating the cost surface:
    // cost surface:
    let CS = regression?.calculateCostSurface();
    // gradient descent path taken:
    let s = regression?.getSteps();
    if (CS !== undefined && s !== undefined) {
      setCostSurface(CS);
      setSteps(s);
    }
  }, []);
  const Plot = createPlotlyComponent(Plotly);

  const regressionLineData = useSelector(
    (state: RootState) => state.Data.regressionLineData
  );
  const inputData = useSelector((state: RootState) => state.Data.inputData);
  const outputData = useSelector((state: RootState) => state.Data.outputData);
  const regression = useSelector((state: RootState) => state.Data.regression);

  const PlotRef = useRef<HTMLDivElement>(null)

  return (
    <div className="flexStartVertically">
      <Plot
        data={[
          {
            name: "regression line",
            x: regressionLineData[0],
            y: regressionLineData[1],
            type: "scatter",
            mode: "lines",
            line: {
              color: "rgb(219, 64, 82)",
              width: 2,
            },
          },
          {
            name: "data",
            type: "scatter",
            x: inputData[0],
            y: inputData[1],
            mode: "markers",
            marker: { color: "green" },
          },
        ]}
        layout={{
          // width:,
          title: "Data with regression",
        }}
        config={{ staticPlot: true }}
      />
      <BlockMath>{outputData.latexEquation}</BlockMath>
      <div className="flexAroundHorizontally" >
        <Header>
          a = {outputData.values[0]} b = {outputData.values[1]}
        </Header>
      </div>
      <div ref={PlotRef} style={{width:"100%"}} className="flexAroundHorizontally">
      {costSurface.length == 0 ? (
        <div className = "flexAroundHorizontally" style={{width:"100%",height:"auto"}}>
          {/* <ClimbingBoxLoader size={60} color={"teal"} /> */}
        </div>
      ) : (
        <Plot
          data={[
            {
              name: "surface",
              x: costSurface[0],
              y: costSurface[1],
              z: costSurface[2],
              type: "surface",
              opacity: 0.5,

            },
            {
              name:"Path taken for gradient descent",
              type: "scatter3d",
              mode: "lines",
              x: steps[0],
              y: steps[1],
              z: steps[2],
              line: {
                color:"teal",
                width: 9,
              },
            },
          ]}
          layout={{
            title: "Cost Surface",
            "xaxis.title": "A",
            "yaxis.title": "B",
          }}
          style={{width:"100%",height:"100%"}}
        />
      )}
      </div>
    </div>
  );
};

export default Output;
