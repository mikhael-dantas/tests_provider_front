import React from 'react'
import { useUcfrListsContext } from '../../UcfrsContext'

function ExportJson() {
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
        <button className='button' onClick={exportJson}>JSON Export/Download</button>
    )
}

export default ExportJson