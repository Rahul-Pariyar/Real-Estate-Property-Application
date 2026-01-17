import React from "react";

const Button = ({
  type = "button",
  label = "button",
  onClick,
  className,
  children,
  ...props
}) => {
  return (
    <button
      type={type}
      className={`p-2 bg-blue-600 rounded mr-2 ${className}`}
      aria-label={label}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default React.memo(Button);
