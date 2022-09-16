import React from 'react'

// a component that copies the content of a variable to the user's clipboard
const variable = 'some text'
export default function CopyToClipboard() { 
    const copyToClipboard = () => {
        navigator.clipboard.writeText(variable)
    }
    return (
        <button className='button'onClick={copyToClipboard}>Copy to clipboard</button>
    )
}
