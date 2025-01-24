// Styles for the main button
export const wasppetButtonMUISx = {
    boxShadow: 'none',
    fontWeight: '600',
    border: 'none',
    padding: '2px 10px', 
    backgroundColor: "var(--primary-color)",
    fontFamily: "'opensans', sans-serif",
    color: "var(--primary-font-color)",
    '&:hover': {
        boxShadow: 'none',
        backgroundColor: 'var(--secondary-color)'
    },
    '&:active': {
        boxShadow: 'none',
    },
}

export const wasppetButtonMUISxMovil = {
    textTransform: "capitalize",
    fontFamily: "'opensans', sans-serif",
    color: "var(--primary-font-color)",
    padding: "20px",
    margin: "10px",
    backgroundColor: "var(--primary-color)",
    "&:hover": {
        backgroundColor: "var(--secondary-color)",
    },
    "&:active": {
        backgroundColor: "var(--secondary-color)",
    },
}