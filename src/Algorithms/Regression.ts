import { derivative, MathNode, parse } from "mathjs";

class Regression {
  protected xValues: number[];
  protected yValues: number[];
  // x and y values
  protected data: number[][];
  // length of x/y
  protected m: number;
  protected iterations: number;
  protected alpha: number;

  // mathjs function, format that we are trying to achieve
  protected function: MathNode;
  protected functionString: string;

  // parameter 1:a 2:b
  protected a: number;
  protected b: number;

  // array of [a,b]
  protected steps: number[][];

  constructor(
    functionString: string,
    inputData: number[][],
    alpha: number,
    iterations: number,
    starting:[number,number]=[0,0]
  ) {
    console.log({ functionString, inputData, iterations, alpha });
    // Function used: E.g. a*x +b
    this.functionString = functionString;
    this.xValues = inputData[0];
    this.yValues = inputData[1];
    this.m = inputData[0].length;
    this.data = inputData;
    this.a = starting[0];
    this.b = starting[1];
    this.iterations = iterations;
    this.alpha = alpha;

    this.steps = [];

    // Parses the string function to a mathjs Mathnode
    this.function = parse(functionString);
  }

  getSteps = ():number[][] =>{
    let aCoord:number[] = []
    let bCoord:number[] = []
    let zCoord:number[] = []
    this.steps.forEach(step => {
      aCoord.push(step[0])
      bCoord.push(step[1])
      zCoord.push(this.cost(step[0],step[1]))
    });
    return [aCoord,bCoord,zCoord]
  }

  // evaluates the cost of using parameters a and b
  cost = (a: number, b: number):number => {
    let cost: number = 0;
    for (let i = 0; i < this.xValues.length; i++) {
      cost +=
        (this.yValues[i] -
          this.function.evaluate({ a: a, b: b, x: this.xValues[i] })) **
        2;
    }
    return cost;
  };

  sumForAllXY = (f: MathNode, params: any) => {
    let sum = 0;
    for (let i = 0; i < this.xValues.length; i++) {
      sum += f.evaluate({ ...params, x: this.xValues[i], y: this.yValues[i] });
    }
    return sum;
  };
  calculateCostSurface = () => {
    let aCoord = [];
    let bCoord = [];
    let zCoord = [];
    let range = 5
    // need to iterate through b then a, becaause plotly selects y then x????
    for (
      let b = Math.round(this.b)-range;
      b < Math.round(this.b) + range + 1;
      b++
    ) {
      let row = []
      bCoord.push(b);
      for (
        let a = Math.round(this.a) - range;
        a < Math.round(this.a)+range + 1;
        a++
      ) {
        if (b==Math.round(this.b)-range){
          aCoord.push(a);
        }
        row.push(this.cost(a, b));
        // zCoord.push(this.cost(a,b))
      }
      zCoord.push(row)
    }
    return [aCoord, bCoord, zCoord];
  };
  getRegressionLine = (): number[][] => {
    let xCoord:number[] = [];
    let yCoord:number[] = [];
    this.xValues.forEach(x => {
      xCoord.push(x);
      yCoord.push(this.function.evaluate({ a:this.a,b:this.b,x: x }));
    });
    return [xCoord, yCoord];
  };
  getLatex = ():string => {
    return this.function.toTex();
  }
  calculate = (): number[] => {
    let absoluteDifference: MathNode = parse(
      ["((", this.function.toString(), "-y)^2)/2"].join("")
    );
    let aFunc: MathNode = derivative(absoluteDifference, "a");
    let bFunc: MathNode = derivative(absoluteDifference, "b");
    console.log(aFunc.toString());
    console.log(bFunc.toString());

    for (let i = 0; i < this.iterations; i++) {
      // console.log(this.cost(this.a,this.b))
      // console.log(this.a,this.b)
      this.a -=
        this.alpha *
        (1 / this.m) *
        this.sumForAllXY(aFunc, { a: this.a, b: this.b });
      this.b -=
        this.alpha *
        (1 / this.m) *
        this.sumForAllXY(bFunc, { a: this.a, b: this.b });
      this.steps.push([this.a, this.b]);
    }
    console.log(this.steps)
    console.log(this.a, this.b);
    return [Math.round(this.a*100)/100, Math.round(this.b*100)/100];
  };
}

export default Regression;
