import React from "react";
import { Buttons, Output } from "../../components";
import "./Calculator.css";

class Calculator extends React.Component {
  state = { shared_var: 0, class: "" };

  updateOutput = shared_value => {
    this.setState({ shared_var: shared_value, class: "" });
  };

  updateFun = () => {
    if (this.state.class === "") {
      this.setState({ class: "sorry" });
    } else {
      this.setState({ class: "" });
    }
  };

  render() {
    return (
      <div className="Calculator">
        <div className={this.state.class}>
          <h1>Casi</h1>
          <Output
            shared_var={this.state.shared_var}
            updateOutput={this.updateOutput}
          />
          <Buttons
            shared_var={this.state.shared_var}
            updateOutput={this.updateOutput}
            class={this.state.class}
            updateFun={this.updateFun}
          />
        </div>
      </div>
    );
  }
}

export default Calculator;
