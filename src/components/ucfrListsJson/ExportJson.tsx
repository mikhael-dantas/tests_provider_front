import { useUcfrListsContext } from '@myContexts/UcfrsContext'
import React from 'react'

function ExportJson({
    className,
    children,
    empty
}:{
    className?: string
    children?: React.ReactNode
    empty?: boolean
}) {
    const ucfrListsFromContext = useUcfrListsContext()

    const exportJson = () => {
        const json = JSON.stringify(ucfrListsFromContext)
        const blob = new Blob([json], {type: 'application/json'})
        const href = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = href
        link.download = 'ucfrLists.json'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <button className={className || 'button'}
        onClick={exportJson}>
            { empty ? null : "JSON Export/Download"}
            {children && children}
        </button>
    )
}

export default ExportJson