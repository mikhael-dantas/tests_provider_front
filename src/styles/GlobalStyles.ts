export const customTheme = {
    colors: {
    10: '#ececec',
    20: '#d1d1d1',
    30: '#b0b0b0',
    45: '#858585',
    60: '#5f5f5f',
    80: '#2d2d2d',
    95: '#101010',
        green: {
            10: '#e3f9e5',
            20: '#c7f3cb',
            30: '#a9ecb0',
            40: '#8de599',
            50: '#6ddc7f',
            60: '#4cd467',
            70: '#2dc84f',
            80: '#1ab23a',
            90: '#0a9c26',
        }
    }
} as {
    colors: {
        10: string,
        20: string,
        30: string,
        45: string,
        60: string,
        80: string,
        95: string,
        green: {
            10: string,
            20: string,
            30: string,
            40: string,
            50: string,
            60: string,
            70: string,
            80: string,
            90: string,
        }
    }
}

export const AddFormContainerStyle = {
    backgroundColor: customTheme.colors[10],
    padding: '1rem',
    borderRadius: '0.5rem',
}

export const AddInputStyle = {
    backgroundColor: 'white',
    padding: '0.5rem',
    borderRadius: '0.5rem',
    margin: '0.5rem',
}

export const ModalInputStyle = {
    backgroundColor: "transparent",
    color: 'black',
    borderBottom: '2px solid black',
    padding: '0.2rem',
    margin: '0.5rem',
}

export const ModalListStyle = {
    backgroundColor: "transparent",
    color: 'black',
    borderBottom: '2px solid black',
    borderTop: '2px solid black',
    padding: '0.5rem',
    margin: '0 auto',
    width: '100%',
}

export const ModalListItemStyle = {
    width: '100%',
    minHeight: '2.8rem',
    margin: '.5rem',
    borderRadius: '.5rem',
    padding: '.5rem',
    backgroundColor: customTheme.colors[10],
    color: customTheme.colors[95],
}