import React from "react";

const steps = ["Cart", "Address", "Payment", "Summary"];

const Stepper = ({ currentStep }) => {
  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      padding: "16px 0",
      borderBottom: "1px solid #eee"
    }}>
      <div style={{
        display: "flex", 
        alignItems: "center", 
        width: "100%", 
        maxWidth: "400px",
        justifyContent: "space-between"
      }}>
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = currentStep === stepNumber;
          const isCompleted = currentStep > stepNumber;

          return (
            <React.Fragment key={step}>
              <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
              }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  border: "2px solid #3f51b5",
                  backgroundColor: isCompleted ? "#3f51b5" : "#fff",
                  color: isCompleted ? "#fff" : "#3f51b5",
                  fontSize: "12px",
                  fontWeight: "bold",
                  zIndex: 1
                }}>
                  {isCompleted ? "✓" : stepNumber}
                </div>
                <div style={{
                  marginTop: "4px",
                  fontSize: "13px",
                  color: isActive ? "#000" : "#aaa",
                  fontWeight: isActive ? "bold" : "normal"
                }}>
                  {step}
                </div>
              </div>

              {/* Line between steps */}
              {index !== steps.length - 1 && (
                <div style={{
                  width: "100%",  // Ensure the line stretches across the available space
                  height: "2px",
                  backgroundColor: "#ccc",
                  marginTop: "8px",  // Adjust the line positioning
                  borderRadius: "1px",  // Round the line's edges
                  position: "relative",
                  top: "-10px",  // Aligns the line directly under the circle
                }}></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;
