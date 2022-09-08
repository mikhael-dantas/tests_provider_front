import { Flex } from '@chakra-ui/react'
import React from 'react'
import { GenerateAlertComponent, useAlertStackComponentContext, useUpdateAlertStackComponentContext } from '../../../AlertStackContext'
import { IUseCase, UcfrListsContextInterfaces, useUcfrListsContext, useUpdateUcfrListsContext } from '../../../UcfrsContext'


function AddNestedUseCase({selectedUseCase}:{selectedUseCase: IUseCase}) {
    // contextManagement SDK
    const ucfrListsFromContext = useUcfrListsContext()
    const updateUcfrListsFromContext = useUpdateUcfrListsContext()
    const ucfrListsInterfaces = new UcfrListsContextInterfaces(
        ucfrListsFromContext,
        updateUcfrListsFromContext
    )
    const alertStackComponentFromContext = useAlertStackComponentContext()
    const updateAlertStackComponentFromContext = useUpdateAlertStackComponentContext()


    const [nestedUseCaseNameInput, setNestedUseCaseNameInput] = React.useState<string>("")

    const handleNestedUseCaseNameInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNestedUseCaseNameInput(e.target.value)
    }

    const handleAddNestedUseCase = () => {
        ucfrListsInterfaces.createNestedUseCase({
            moduleId: selectedUseCase.moduleId,
            name: nestedUseCaseNameInput,
            parentId: selectedUseCase.id
        })
        .then(() => {
            setNestedUseCaseNameInput("")
            updateAlertStackComponentFromContext([
                ...alertStackComponentFromContext,
                {
                    component: GenerateAlertComponent({ status: "success", text: "Nested Use Case Added" }),
                }
            ])
        })
        .catch((err) => {
            updateAlertStackComponentFromContext([
                ...alertStackComponentFromContext,
                {
                    component: GenerateAlertComponent({ status: "error", text: err.message }),
                }
            ])
        })
    }



    return (
        <Flex>
            <input type="text" value={nestedUseCaseNameInput} onChange={handleNestedUseCaseNameInputChange} />
            <button className='button' onClick={handleAddNestedUseCase}>Add Nested Use Case</button>
        </Flex>
    )
}

export default AddNestedUseCase