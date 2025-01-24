// Interface to request this component: '@/interfaces/menu_interface'

import { MenuInterface } from "@/interfaces/menu_interface";
import Button from "@mui/material/Button";


export const Menu = ({ data }: { data: MenuInterface }): JSX.Element => {
  return (
    <div id='menu' className={data.menu_classes}>
      {data.buttons.map((obj, index) => (
        <Button
          sx={data.buttons_classes}
          key={index}
          href={obj.route}
          variant={data.material_ui_variant}
        >
          {obj.text}
        </Button>
      ))}
    </div>
  );
};
