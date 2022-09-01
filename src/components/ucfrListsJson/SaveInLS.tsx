import React from 'react'
import { useUcfrListsContext } from '../../UcfrsContext'

function SaveInLS() {
    const ucfrListsFromContext = useUcfrListsContext()
    const saveInLS = () => {
        localStorage.setItem('ucfrLists', JSON.stringify(ucfrListsFromContext))
    }
    return (
        <button className='button' onClick={saveInLS}>Save JSON locally</button>
    )
}

export default SaveInLS