import React, { useReducer, useState } from 'react';
import './styles.css';
import DigitsButton from './DigitsButton';
import OperationButton from './OperationButton';

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate",
}

function Reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        };
      }
      if (payload.digit === "0" && state.currentOperand === "0") {
        return state;
      }
      if (payload.digit === "." && state.currentOperand.includes(".")) {
        return state;
      }

      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      };
    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null) {
        return state;
      }

      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }

      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        };
      }

      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null,
      };
    case ACTIONS.CLEAR:
      return {};
    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null,
        };
      }
      if (state.currentOperand == null) return state;
      if (state.currentOperand.length === 1) {
        return { ...state, currentOperand: null };
      }

      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };
    case ACTIONS.EVALUATE:
      if (
        state.operation == null ||
        state.currentOperand == null ||
        state.previousOperand == null
      ) {
        return state;
      }

      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state),
      };
    default:
      return state;
  }
}

function evaluate({ currentOperand, previousOperand, operation }) {
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);
  if (isNaN(prev) || isNaN(current)) return "";
  let computation = "";
  switch (operation) {
    case "+":
      computation = prev + current;
      break;
    case "-":
      computation = prev - current;
      break;
    case "*":
      computation = prev * current;
      break;
    case "÷":
      computation = prev / current;
      break;
    default:
      break;
  }

  return computation.toString();
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
});

function formatOperand(operand) {
  if (operand == null) return;
  const [integer, decimal] = operand.split(".");
  if (decimal == null) return INTEGER_FORMATTER.format(integer);
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
}

function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(Reducer, {});
  const [calcCount, setCalcCount] = useState(0);
  const [showMessage, setShowMessage] = useState(false);

  const handleEvaluate = () => {
    dispatch({ type: ACTIONS.EVALUATE });
    setCalcCount((prevCount) => {
      const newCount = prevCount + 1;
      if (newCount === 3) {
        setShowMessage(true);
      }
      return newCount;
    });
  };

  const handleClear = () => {
    dispatch({ type: ACTIONS.CLEAR });
    setShowMessage(false);
    setCalcCount(0);
  };
  
  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">
          {formatOperand(previousOperand)} {operation}
        </div>
        <div className="current-operand">
        {showMessage ? "Hello World" : formatOperand(currentOperand)}
        </div>
      </div>
      <button onClick={handleClear}>clr</button>
      <button className="span-two" onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL</button>

      <OperationButton operation="/" dispatch={dispatch} />
      <DigitsButton digit="7" dispatch={dispatch} />
      <DigitsButton digit="8" dispatch={dispatch} />
      <DigitsButton digit="9" dispatch={dispatch} />

      <OperationButton operation="*" dispatch={dispatch} />
      <DigitsButton digit="4" dispatch={dispatch} />
      <DigitsButton digit="5" dispatch={dispatch} />
      <DigitsButton digit="6" dispatch={dispatch} />

      <OperationButton operation="-" dispatch={dispatch} />
      <DigitsButton digit="1" dispatch={dispatch} />
      <DigitsButton digit="2" dispatch={dispatch} />
      <DigitsButton digit="3" dispatch={dispatch} />

      <OperationButton operation="+" dispatch={dispatch} />
      <DigitsButton digit="." dispatch={dispatch} />
      <DigitsButton digit="0" dispatch={dispatch} />
      <button className="span-two" onClick={handleEvaluate}>=</button>

     
    </div>
  );
}

export default App;
