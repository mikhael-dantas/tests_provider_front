import { useUpdateUcfrListsContext, IUcfrLists } from '@myContexts/UcfrsContext'
import React from 'react'

function LoadFromLs({
    className,
    children,
    empty
}:{
    className?: string
    children?: React.ReactNode
    empty?: boolean
}) {
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
        <button className={
            className || 'button'
        } onClick={loadFromLS}>
            {empty ? null : "Load JSON locally"}
            {children && children}
        </button>
    )
}

export default LoadFromLs