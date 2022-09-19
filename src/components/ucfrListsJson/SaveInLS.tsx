import { useUcfrListsContext } from '@myContexts/UcfrsContext'
import React from 'react'

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