import { Flex } from '@chakra-ui/react'
import { useUpdateUcfrListsContext } from '@myContexts/UcfrsContext'
import React from 'react'

function ImportJson() {
    const updateUcfrListsFromContext = useUpdateUcfrListsContext()

    const [importJsonInput, setImportJsonInput] = React.useState('')
    const [importJsonError, setImportJsonError] = React.useState<boolean>(true)

    const handleImportJsonInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setImportJsonInput(event.target.value)
        try {
            const parsedJson = JSON.parse(event.target.value)

            if (!(parsedJson.modules) || !(parsedJson.tags)) {
                throw new Error('Invalid json')
            }

            setImportJsonError(false)
        } catch (err) {
            setImportJsonError(true)
        }
    }

    const importJson = () => {
        if (importJsonError) {
            return
        }

        const parsedJson = JSON.parse(importJsonInput)
        updateUcfrListsFromContext(parsedJson)
    }

    return (
        <Flex>
            <textarea className='textarea' 
            style={{border: importJsonError ? '0.2rem solid red' : '0.2rem solid green'}}
            value={importJsonInput} onChange={handleImportJsonInput} 
            />
            <button className='button' onClick={importJson}>Import JSON</button>
        </Flex>
    )
}

export default ImportJson