import { Flex } from "@chakra-ui/react"
import { useAlertStackComponentContext, useUpdateAlertStackComponentContext, GenerateAlertComponent } from "@myContexts/AlertStackContext"
import { UcfrListsContextInterfaces } from "@myFeaturesInterfaces/UcfrListsContextInterfaces"
import { IUseCase, useUcfrListsContext, useUpdateUcfrListsContext, } from "@myContexts/UcfrsContext"
import React from "react"


export default function CreateNestedUseCase({selectedUseCase}:{selectedUseCase: IUseCase}) {
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
            <input style={{color:'black'}}type="text" value={nestedUseCaseNameInput} onChange={handleNestedUseCaseNameInputChange} />
            <button className='button' onClick={handleAddNestedUseCase}>Add Nested Use Case</button>
        </Flex>
    )
}
