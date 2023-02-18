import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react"
import { IFunctionalRequirement, useUcfrListsContext } from "@myContexts/UcfrsContext"
import { customTheme } from "@myStyles/GlobalStyles"
import React, { useEffect } from "react"
import { ManageComponentUcfrActions } from "../../../../lib/componentActions"

export default function AddFRequirementToItemModal({ 
    isOpen, onClose, itemId: receivedItemId, itemType: receivedItemType
}: { isOpen: boolean, onClose: () => void, 
    itemId: string, itemType: 'useCase' | 'nestedUseCase' | 'functionalRequirement'
}) {
    const ActionsManager = new ManageComponentUcfrActions()


    const addFRequirementToUseCaseHandler = (scopedFRequirementId: string) => {
        ActionsManager.addFunctionalRequirementToItemHandler({
            itemId: receivedItemId,
            fRequirementId: scopedFRequirementId,
            itemType: receivedItemType,
        }).then(() => {
            onClose()
        })
    }


    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent backgroundColor={customTheme.colors[10]}>
                <ModalHeader>{'add FRs'}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {
                        ActionsManager.ucfrListsFromContext.modules.reduce((acc, scopedModule) => {
                            return [ ...acc, ...scopedModule.functionalRequirements ]
                        }, []).map((scopedFRequirement: IFunctionalRequirement) => {
                            return (
                                <button className='button'
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