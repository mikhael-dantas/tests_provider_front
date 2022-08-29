import React from 'react'
import { IUcfrLists, useUpdateUcfrListsContext } from '../../UcfrsContext'

function LoadFromLs() {
    const updateUcfrListsFromContext = useUpdateUcfrListsContext()
    const loadFromLS = () => {
        const ucfrListsFromLS = localStorage.getItem('ucfrLists')
        if (!ucfrListsFromLS) {
            return
        }
        const ucfrListsParsed: IUcfrLists = JSON.parse(ucfrListsFromLS)
        if (!(ucfrListsParsed.modules) || !(ucfrListsParsed.tags)) {
            return
        }

        updateUcfrListsFromContext(ucfrListsParsed)
    }

    return (
        <button className='button' onClick={loadFromLS}>Load</button>
    )
}

export default LoadFromLs