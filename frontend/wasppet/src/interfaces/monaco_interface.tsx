// Code editor

// Interfaces are imported in the file where the component is requested,
// then all the data is provided using the interface, to the component
// in a prop named "data".
// The component take the data and automatically create the element.
// The component for this interface is in: '@/components/header/header-components/menu/menu'

// Interface to request the creation of a code editor
export interface MonacoInterface {
  defaultLanguage: string|null;
  value: string;
}
