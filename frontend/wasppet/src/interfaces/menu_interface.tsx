// Menu of buttons

// Interfaces are imported in the file where the component is requested,
// then all the data is provided using the interface, to the component
// in a prop named "data".
// The component take the data and automatically create the element.
// The component for this interface is in: '@/components/header/header-components/menu/menu'

// Interface for the "buttons" property of ManuInterface
interface Buttons {
    text: string,
    route: string,
}

// Interface to request the creation of a menu of buttons
export interface MenuInterface {
    buttons: Buttons[];
    menu_classes?: string;
    buttons_classes?: object;
    material_ui_variant: "text" | "outlined" | "contained";
};


/*
Example of use:

const menuData: MenuInterface = {
    buttons: [
        {text: 'Sign-In', route: '/sign-in'},
    ],
    menu_classes: 'class1, class2',
    buttons_classes: 'class1, class2',
    material_ui_variant: 'contained'
}
*/