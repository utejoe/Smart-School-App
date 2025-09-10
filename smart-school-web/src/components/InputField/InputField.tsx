import React, { InputHTMLAttributes } from 'react';

const InputField: React.FC<InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input className="input-field" {...props} />
);

export default InputField;
