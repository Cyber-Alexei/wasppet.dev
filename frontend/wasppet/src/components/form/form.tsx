// Interface to request this component: '@/interfaces/form_interface'

import { FormInterface } from "@/interfaces/form_interface";
import Button from "@mui/material/Button";

export const Form = ({ data }: { data: FormInterface }) => {
    
  return (
    <form className={data.form_classes} onSubmit={data.submit_handler}>
      <div className={data.main_div_classes}>
        {data.fields.map((field, index) => (
          <div key={index} className={[data.div_for_input_classes, field.div_styles].join(' ')}>
            <input
              className={[data.input_classes, field.input_styles].join(' ')}
              id={field.field}
              name={field.field}
              value={field.state}
              onChange={data.change_handler}
              type={field.type}
              placeholder={field.placeholder}
              required={field.required}
            />
          </div>
        ))}
      </div>
      <Button type='submit' sx={data.button_classes} variant={data.button_variant}>
        {data.button_text}
      </Button>
    </form>
  );
};

