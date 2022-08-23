import { Button } from '@chakra-ui/react'
import React from 'react'
import { useUcfrListsContext } from '../../UcfrsContext'

function SaveInLS() {
    const ucfrListsFromContext = useUcfrListsContext()
    const saveInLS = () => {
        localStorage.setItem('ucfrLists', JSON.stringify(ucfrListsFromContext))
    }
    return (
        <Button className='button' onClick={saveInLS}>Save</Button>
    )
}

export default SaveInLS