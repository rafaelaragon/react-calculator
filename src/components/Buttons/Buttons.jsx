import React from "react";
import "./Buttons.css";
import {
  FaPlus,
  FaMinus,
  FaTimes,
  FaDivide,
  FaEquals,
  FaSquareRootAlt
} from "react-icons/fa";

class Buttons extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOn: false,
      result: 0,
      count: 1,
      decimalCount: 0,
      isDecimal: false,
      first: 0,
      operation: "",
      ans: 0
    };
  }

  updateOutput(output) {
    this.props.updateOutput(output);
  }

  checkIfOn = async () => {
    this.setState({ isOn: !this.state.isOn }, () => {
      this.updateOutput(this.state.result);
    });
    if (!this.state.isOn) this.setState({ result: "Hello" });
    else
      this.setState({ result: "Goodbye" }, () => {
        this.updateOutput(this.state.result);
      });
  };

  updateFun = () => {
    this.props.updateFun();
  };

  // Añade dígitos del 0 al 9, ya sean decimales o no
  inputDigit = input => {
    let inputResult = this.state.result;
    let inputCount = inputResult.toString().length;

    //Primer dígito (no decimal)
    if (inputResult === 0 && !this.state.isDecimal) {
      const updatedResult = input;
      this.setState({ result: updatedResult, count: inputCount });
      this.updateOutput(updatedResult);

      //Primer dígito (decimal)
    } else if (inputResult === 0 && this.state.isDecimal) {
      if (this.state.operation !== "sub") {
        const updatedResult = input / 10;
        this.setState({
          result: updatedResult,
          count: inputCount,
          decimalCount: 1
        });
        this.updateOutput(updatedResult);
      } else {
        const updatedResult = input / 10;
        this.setState({
          result: updatedResult,
          count: inputCount,
          decimalCount: 1
        });
        this.updateOutput(-updatedResult);
      }

      //Todos los demás dígitos (no decimales)
    } else if (!this.state.isDecimal) {
      const updatedResult = inputResult * 10 + input;
      this.setState({ result: updatedResult, count: inputCount + 1 });
      this.updateOutput(updatedResult);

      //Todos los demás dígitos (decimales)
    } else {
      if (this.state.operation !== "sub") {
        const updatedResult =
          inputResult + input / (10 * Math.pow(10, this.state.decimalCount));
        const fixedResult = parseFloat(updatedResult).toFixed(
          this.state.decimalCount + 1
        );
        this.setState({
          result: updatedResult,
          count: inputCount + 1,
          decimalCount: this.state.decimalCount + 1
        });
        this.updateOutput(fixedResult);
      } else {
        const updatedResult =
          inputResult + input / (10 * Math.pow(10, this.state.decimalCount));
        const fixedResult = parseFloat(updatedResult).toFixed(
          this.state.decimalCount + 1
        );
        this.setState({
          result: updatedResult,
          count: inputCount + 1,
          decimalCount: this.state.decimalCount + 1
        });
        this.updateOutput(fixedResult);
      }
    }
  };

  //Más/Menos
  plusMinus = async () => {
    await this.calculate();
    const updatedResult = -this.state.result;
    this.setState({ result: updatedResult, operation: "" });
    this.updateOutput(updatedResult);
  };

  //Pi
  inputPi = async () => {
    await this.setState({ first: this.state.result, result: 0 });
    let result = Math.PI;
    if (this.state.first !== 0) {
      result = this.state.first * result;
    }
    this.inputDigit(result);
  };

  //e
  inputE = async () => {
    await this.setState({ first: this.state.result, result: 0 });
    let result = Math.E;
    if (this.state.first !== 0) {
      result = this.state.first * result;
    }
    this.inputDigit(result);
  };

  //Activa decimales
  setDecimal = () => {
    this.setState({ isDecimal: true });
  };

  //Guarda el resultado en un auxiliar
  setAns = async () => {
    if (this.state.ans === 0) {
      await this.setState({ ans: this.state.result });
    } else {
      await this.setState({ result: this.state.ans });
    }
    this.updateOutput(this.state.result);
  };

  //Borra el último dígito
  deleteLast = () => {
    //Si no tiene decimales
    if (!this.state.isDecimal) {
      this.setState(
        {
          result: this.state.result.toString().substr(0, this.state.count - 1),
          count: this.state.count - 1
        },
        () => {
          this.updateOutput(this.state.result);
        }
      );
      //Si tiene decimales
    } else {
      if (this.state.decimalCount === 1) {
        this.setState({ isDecimal: false, decimalCount: 0 });
      }
      const deletedResult = this.state.result
        .toString()
        .substr(0, this.state.count - 1);
      this.setState(
        {
          result: +deletedResult,
          decimalCount: this.state.decimalCount - 1,
          count: this.state.count - 1
        },
        () => {
          this.updateOutput(this.state.result);
        }
      );
    }
  };

  //Resetea la calculadora
  allClear = () => {
    this.setState({
      result: 0,
      count: 1,
      decimalCount: 0,
      isDecimal: false,
      first: 0,
      operation: "",
      ans: 0
    });
    this.updateOutput(0);
  };

  //Suma
  sum = async () => {
    await this.calculate();
    this.setState({
      first: this.state.first + this.state.result,
      result: 0,
      operation: "sum"
    });
  };

  //Resta
  sub = async () => {
    await this.calculate();
    if (this.state.first === 0) {
      this.setState({ first: this.state.result });
    } else {
      this.setState({ first: -this.state.result });
    }
    this.setState({ result: 0, operation: "sub" });
  };

  //Multiplicación
  mul = async () => {
    await this.calculate();
    if (this.state.first === 0) {
      this.setState({ first: this.state.result });
    } else {
      this.setState({ first: this.state.first * this.state.result });
    }
    this.setState({ result: 0, operation: "mul" });
  };

  //División
  div = async () => {
    await this.calculate();
    if (this.state.first === 0) {
      this.setState({ first: this.state.result });
    } else {
      this.setState({ first: this.state.first / this.state.result });
    }
    this.setState({ result: 0, operation: "div" });
  };

  //Raíz cuadrada
  squ = () => {
    this.setState({ first: this.state.result, operation: "squ", result: 0 });
  };

  //Logaritmo en base 10
  log = async () => {
    await this.calculate();
    this.setState({ operation: "log", first: this.state.result, result: 0 });
  };
  //Logaritmo neperiano (en base e)
  ln = async () => {
    await this.calculate();
    this.setState({ operation: "ln", first: this.state.result, result: 0 });
  };

  //Tanto por ciento
  per = async () => {
    await this.calculate();
    this.setState({ operation: "per", first: this.state.result, result: 0 });
  };

  //Potencia
  pow = async () => {
    await this.calculate();
    this.setState({ operation: "pow", first: this.state.result, result: 0 });
  };

  //Exponente
  exp = async () => {
    await this.calculate();
    this.setState({ operation: "exp", first: this.state.result, result: 0 });
  };

  calculate = async () => {
    this.setState({ isDecimal: false, decimalCount: 0 });
    //Si suma
    if (this.state.operation === "sum") {
      this.setState(
        {
          result: this.state.first + this.state.result
        },
        () => {
          this.setState({ count: this.state.result.toString().length });
          this.updateOutput(this.state.result);
        }
      );
    }

    //Si resta
    if (this.state.operation === "sub") {
      this.setState(
        {
          result: this.state.first - this.state.result
        },
        () => {
          this.setState({ count: this.state.result.toString().length });
          this.updateOutput(this.state.result);
        }
      );
    }

    //Si multiplica
    if (this.state.operation === "mul") {
      this.setState(
        {
          result: this.state.first * this.state.result
        },
        () => {
          this.setState({ count: this.state.result.toString().length });
          this.updateOutput(this.state.result);
        }
      );
    }

    //Si divide
    if (this.state.operation === "div") {
      this.setState(
        {
          result: this.state.first / this.state.result
        },
        () => {
          this.setState({ count: this.state.result.toString().length });
          this.updateOutput(this.state.result);
        }
      );
    }

    //Si aplica la raíz cuadrada
    if (this.state.operation === "squ") {
      let updatedResult = Math.sqrt(this.state.result);
      if (this.state.first !== 0) {
        updatedResult = updatedResult * this.state.first;
      }
      this.setState({ result: updatedResult }, () => {
        this.setState({ count: this.state.result.toString().length });
        this.updateOutput(this.state.result);
      });
    }

    //Si aplica el porcentaje
    if (this.state.operation === "per") {
      let updatedResult = (this.state.first * this.state.result) / 100;
      this.setState({ result: updatedResult }, () => {
        this.setState({ count: this.state.result.toString().length });
        this.updateOutput(this.state.result);
      });
    }

    //Si aplica la potencia
    if (this.state.operation === "pow") {
      this.setState(
        { result: Math.pow(this.state.first, this.state.result) },
        () => {
          this.setState({ count: this.state.result.toString().length });
          this.updateOutput(this.state.result);
        }
      );
    }

    //Si aplica el exponente
    if (this.state.operation === "exp") {
      this.setState(
        { result: this.state.first * Math.pow(10, this.state.result) },
        () => {
          this.setState({ count: this.state.result.toString().length });
          this.updateOutput(this.state.result);
        }
      );
    }

    //Si aplica logaritmo
    if (this.state.operation === "log") {
      let updatedResult = Math.log10(this.state.result);
      if (this.state.first !== 0) {
        updatedResult = updatedResult * this.state.first;
      }
      this.setState({ result: updatedResult }, () => {
        this.setState({ count: this.state.result.toString().length });
        this.updateOutput(this.state.result);
      });
    }

    //Si aplica logaritmo neperiano
    if (this.state.operation === "ln") {
      let updatedResult = Math.log(this.state.result);
      if (this.state.first !== 0) {
        updatedResult = updatedResult * this.state.first;
      }
      this.setState({ result: updatedResult }, () => {
        this.setState({ count: this.state.result.toString().length });
        this.updateOutput(this.state.result);
      });
    }
    this.setState({ first: 0 /*, isDecimal: false, decimalCount: 0 */ });
  };

  render() {
    return (
      <div className="Buttons">
        <p>&nbsp;</p>
        <button onClick={this.squ}>
          <FaSquareRootAlt />
        </button>
        <button onClick={this.per}>%</button>
        <button onClick={this.plusMinus}>+/-</button>
        <button onClick={this.log}>Log</button>
        <button id="on" onClick={this.checkIfOn}>
          ON
        </button>
        <button onClick={this.inputPi}>π</button>
        <button onClick={this.inputE}>e</button>
        <button onClick={this.ln}>Ln</button>
        <button onClick={this.pow}>pow</button>
        <button onClick={this.updateFun}>:)</button>
        <p>&nbsp;</p>
        <button className="number" value={7} onClick={() => this.inputDigit(7)}>
          7
        </button>
        <button className="number" value={8} onClick={() => this.inputDigit(8)}>
          8
        </button>
        <button className="number" value={9} onClick={() => this.inputDigit(9)}>
          9
        </button>
        <button id="pink" onClick={this.deleteLast}>
          DEL
        </button>
        <button id="pink" onClick={this.allClear}>
          AC
        </button>
        <button className="number" value={4} onClick={() => this.inputDigit(4)}>
          4
        </button>
        <button className="number" value={5} onClick={() => this.inputDigit(5)}>
          5
        </button>
        <button className="number" value={6} onClick={() => this.inputDigit(6)}>
          6
        </button>
        <button className="icon" onClick={() => this.mul()}>
          <FaTimes />
        </button>
        <button className="icon" onClick={() => this.div()}>
          <FaDivide />
        </button>
        <button className="number" value={1} onClick={() => this.inputDigit(1)}>
          1
        </button>
        <button className="number" value={2} onClick={() => this.inputDigit(2)}>
          2
        </button>
        <button className="number" value={3} onClick={() => this.inputDigit(3)}>
          3
        </button>
        <button className="icon" onClick={() => this.sum()}>
          <FaPlus />
        </button>
        <button className="icon" onClick={() => this.sub()}>
          <FaMinus />
        </button>
        <button onClick={this.setDecimal}>.</button>
        <button className="number" value={0} onClick={() => this.inputDigit(0)}>
          0
        </button>
        <button onClick={this.exp}>EXP</button>
        <button onClick={this.setAns}>Ans</button>
        <button className="icon" id="result" onClick={this.calculate}>
          <FaEquals />
        </button>
        <p>&nbsp;</p>
      </div>
    );
  }
}

export default Buttons;
