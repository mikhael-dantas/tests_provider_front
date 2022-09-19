import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button } from "@chakra-ui/react"
import { useAlertStackComponentContext, useUpdateAlertStackComponentContext, GenerateAlertComponent } from "@myContexts/AlertStackContext"
import { UcfrListsContextInterfaces } from "@myFeaturesInterfaces/UcfrListsContextInterfaces"
import { useUcfrListsContext, useUpdateUcfrListsContext, IFunctionalRequirement } from "@myContexts/UcfrsContext"
import { customTheme } from "@myStyles/GlobalStyles"
import React, { useEffect } from "react"

export default function AddFRequirementToItModal({ isOpen, onClose, useCaseId: receivedUseCaseId}: { isOpen: boolean, onClose: () => void, useCaseId: string}) {
    // contextManagement SDK
    const ucfrListsFromContext = useUcfrListsContext()
    const updateUcfrListsFromContext = useUpdateUcfrListsContext()
    const ucfrListsInterfaces = new UcfrListsContextInterfaces(
        ucfrListsFromContext,
        updateUcfrListsFromContext
    )
    const alertStackComponentFromContext = useAlertStackComponentContext()
    const updateAlertStackComponentFromContext = useUpdateAlertStackComponentContext()


    const addFRequirementToUseCaseHandler = (scopedFRequirementId: string) => {
        ucfrListsInterfaces.addFunctionalRequirementToUseCase({
            useCaseId: receivedUseCaseId,
            functionalRequirementId: scopedFRequirementId
        })
        .then(() => {
            updateAlertStackComponentFromContext([
                ...alertStackComponentFromContext,
                {
                    component: GenerateAlertComponent({ status: 'success', text: 'FR added to Nested' })
                }
            ])
        })
        .catch((error) => {
            updateAlertStackComponentFromContext([
                ...alertStackComponentFromContext,
                {
                    component: GenerateAlertComponent({ status: 'error', text: error.message })
                }
            ])
        })

        onClose()
    }

    const [listOfDependencies, setListOfDependencies] = React.useState<string[]>([])

    useEffect(() => {
        ucfrListsInterfaces.readUseCaseById({useCaseId: receivedUseCaseId})
        .then((useCase) => {
            setListOfDependencies(useCase.neededFrsToWorkIds)
        })
        .catch((error) => {
            updateAlertStackComponentFromContext([
                ...alertStackComponentFromContext,
                {
                    component: GenerateAlertComponent({ status: 'error', text: error.message })
                }
            ])
        })
    }, [receivedUseCaseId, isOpen])


    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent backgroundColor={customTheme.colors[10]}>
                <ModalHeader>{'add FRs'}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {
                        ucfrListsFromContext.modules.reduce((acc, scopedModule) => {
                            return [ ...acc, ...scopedModule.functionalRequirements ]
                        }, []).map((scopedFRequirement: IFunctionalRequirement) => {
                            return (
                                <button className='button'
                                    style={listOfDependencies.includes(scopedFRequirement.id) ? {backgroundColor:  'green'} : {}}
                                    key={scopedFRequirement.id}
                                    onClick={() => {addFRequirementToUseCaseHandler(scopedFRequirement.id)}}
                                >
                                    <ModuleNameComponent moduleId={scopedFRequirement.moduleId} />

                                    : {scopedFRequirement.name}
                                </button>
                            )
                        })
                    }
                </ModalBody>
                <ModalFooter>
                    <Button onClick={onClose}>Close</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

function ModuleNameComponent({moduleId}: {moduleId: string}) {
    const ucfrListsFromContext = useUcfrListsContext()
    const [moduleName, setModuleName] = React.useState('searching...')

    useEffect(() => {
        const scopedModule = ucfrListsFromContext.modules.find((scopedModule) => scopedModule.id === moduleId)
        if (scopedModule) {
            setModuleName(scopedModule.name)
        }
    }, [moduleId])

    return (
        <div>
            {moduleName}
        </div>
    )
}