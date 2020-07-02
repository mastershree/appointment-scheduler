import React from "react";
import { FormGroup, Input } from "reactstrap";

const TextInput = (props) => {
  /* let formControl = "form-control";

  if (props.touched && !props.valid) {
    formControl = "form-control control-error";
  }
   className={formControl}
*/
  return <Input {...props} />;
};

export default TextInput;
