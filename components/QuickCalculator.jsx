"use client";

import { useState, useCallback } from "react";

/**
 * Quick calculator modal for calculating expense amounts.
 * Includes a "Use Result" button that copies the value to clipboard.
 *
 * @param {boolean} show - Whether to show the calculator
 * @param {() => void} onClose - Called when calculator is closed
 * @param {(value: string) => void} onUseResult - Called with the result when "Use Result" is clicked
 */
export function QuickCalculator({ show, onClose, onUseResult }) {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputDigit = useCallback((digit) => {
    if (waitingForOperand) {
      setDisplay(String(digit));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === "0" ? String(digit) : display + digit);
    }
  }, [display, waitingForOperand]);

  const inputDecimal = useCallback(() => {
    if (waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
      return;
    }
    if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  }, [display, waitingForOperand]);

  const clear = useCallback(() => {
    setDisplay("0");
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  }, []);

  const performOperation = useCallback((nextOperation) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      let newValue;

      switch (operation) {
        case "+":
          newValue = currentValue + inputValue;
          break;
        case "-":
          newValue = currentValue - inputValue;
          break;
        case "*":
          newValue = currentValue * inputValue;
          break;
        case "/":
          newValue = inputValue !== 0 ? currentValue / inputValue : 0;
          break;
        default:
          newValue = inputValue;
      }

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  }, [display, previousValue, operation]);

  const calculate = useCallback(() => {
    if (!operation || previousValue === null) return;

    const inputValue = parseFloat(display);
    let result;

    switch (operation) {
      case "+":
        result = previousValue + inputValue;
        break;
      case "-":
        result = previousValue - inputValue;
        break;
      case "*":
        result = previousValue * inputValue;
        break;
      case "/":
        result = inputValue !== 0 ? previousValue / inputValue : 0;
        break;
      default:
        result = inputValue;
    }

    // Round to 2 decimal places
    result = Math.round(result * 100) / 100;
    setDisplay(String(result));
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(true);
  }, [display, previousValue, operation]);

  const handleUseResult = () => {
    const value = parseFloat(display);
    if (Number.isFinite(value) && value > 0) {
      onUseResult?.(display);
      onClose?.();
    }
  };

  if (!show) return null;

  const buttons = [
    { label: "C", action: clear, type: "clear" },
    { label: "%", action: () => setDisplay(String(parseFloat(display) / 100)), type: "function" },
    { label: "÷", action: () => performOperation("/"), type: "operator", active: operation === "/" },
    { label: "×", action: () => performOperation("*"), type: "operator", active: operation === "*" },

    { label: "7", action: () => inputDigit(7), type: "number" },
    { label: "8", action: () => inputDigit(8), type: "number" },
    { label: "9", action: () => inputDigit(9), type: "number" },
    { label: "−", action: () => performOperation("-"), type: "operator", active: operation === "-" },

    { label: "4", action: () => inputDigit(4), type: "number" },
    { label: "5", action: () => inputDigit(5), type: "number" },
    { label: "6", action: () => inputDigit(6), type: "number" },
    { label: "+", action: () => performOperation("+"), type: "operator", active: operation === "+" },

    { label: "1", action: () => inputDigit(1), type: "number" },
    { label: "2", action: () => inputDigit(2), type: "number" },
    { label: "3", action: () => inputDigit(3), type: "number" },
    { label: "=", action: calculate, type: "equals", tall: true },

    { label: "0", action: () => inputDigit(0), type: "number", wide: true },
    { label: ".", action: inputDecimal, type: "number" },
  ];

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xs rounded-3xl bg-slate-900 p-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Display */}
        <div className="mb-4 rounded-xl bg-slate-800 p-4 text-right">
          <p className="text-3xl font-bold text-white truncate font-mono">
            {display}
          </p>
          {operation && (
            <p className="mt-1 text-xs text-slate-400">
              {previousValue} {operation === "*" ? "×" : operation === "/" ? "÷" : operation === "-" ? "−" : operation}
            </p>
          )}
        </div>

        {/* Buttons grid */}
        <div className="grid grid-cols-4 grid-rows-[auto] gap-2">
          {buttons.map((btn, i) => (
            <button
              key={i}
              onClick={btn.action}
              className={`rounded-xl text-lg font-semibold transition-all active:scale-95 ${
                btn.tall ? "row-span-2 h-full" : "h-14"
              } ${
                btn.wide ? "col-span-2" : ""
              } ${
                btn.type === "operator"
                  ? btn.active
                    ? "bg-orange-500 text-white"
                    : "bg-orange-500/20 text-orange-400 hover:bg-orange-500/30"
                  : btn.type === "equals"
                  ? "bg-emerald-500 text-white hover:bg-emerald-600"
                  : btn.type === "clear"
                  ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                  : btn.type === "function"
                  ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  : "bg-slate-700 text-white hover:bg-slate-600"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Use Result button */}
        <button
          onClick={handleUseResult}
          disabled={parseFloat(display) <= 0 || !Number.isFinite(parseFloat(display))}
          className="mt-3 w-full rounded-xl bg-acorn-500 py-3 text-sm font-bold text-white transition hover:bg-acorn-600 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Use Rs. {display} →
        </button>

        {/* Cancel link */}
        <button
          onClick={onClose}
          className="mt-2 w-full py-2 text-center text-xs font-medium text-slate-400 transition hover:text-slate-300"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
