import React from "react";

const Input = React.forwardRef(({ className, ...props }, ref) => {
  return <input ref={ref} className={` ${className}`} {...props} />;
});

export default React.memo(Input);
