import React from "react";
import "./Output.css";

class Output extends React.Component {
  render() {
    let output = this.props.shared_var;
    let name = "Output";
    // eslint-disable-next-line default-case
    switch (output) {
      case Infinity:
        output = "A_lot";
        break;
      case -Infinity:
        output = "-A_lot";
        break;
      case "Hello":
      case "Goodbye":
        break;
      default:
        output = Math.round(output * 10000000) / 10000000;
        break;
    }
    if (output.toString() > Math.pow(10, 11)) {
      name = "Output twelve";
    }
    if (output.toString() > Math.pow(10, 14)) {
      name = "Output fifteen";
    }
    return <div className={name}>{output}</div>;
  }
}

export default Output;
