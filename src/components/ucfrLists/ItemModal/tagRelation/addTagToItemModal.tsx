import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react"
import { customTheme } from "@myStyles/GlobalStyles"
import { ManageComponentUcfrActions } from "../../../../lib/componentActions"

export default function addTagToItemModal({
    isOpen, onClose, 
    itemId: receivedItemId,
    itemType: receivedItemType,
}:{
    isOpen: boolean, onClose: () => void,
    itemId: string
    itemType: 'useCase' | 'nestedUseCase' | 'functionalRequirement'
}) {
    const ActionsManager = new ManageComponentUcfrActions()

    const addTagToItemHandler = (scopedTagId: string) => {
        switch (receivedItemType) {
            case 'useCase':
                ActionsManager.addTagToUseCaseHandler({
                    useCaseId: receivedItemId,
                    tagId: scopedTagId,
                })
                break;
            case 'nestedUseCase':
                ActionsManager.addTagToNestedUseCaseHandler({
                    nestedUseCaseId: receivedItemId,
                    tagId: scopedTagId,
                })
                break;
            case 'functionalRequirement':
                ActionsManager.addTagToFunctionalRequirementHandler({
                    functionalRequirementId: receivedItemId,
                    tagId: scopedTagId,
                })
                break;
            default:
                break;
        }

        onClose()
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent backgroundColor={customTheme.colors[10]}>
                <ModalHeader>{'add tags'}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                <div className="flex gap-2 justify-center items-center flex-wrap">
                    {
                        ActionsManager.ucfrListsFromContext.tags.map(scopedTag => {
                            return (
                                <button type="button" className="
                                inline-block 
                                px-6 py-2.5 h-[2rem]
                                bg-blue-600 hover:bg-blue-800
                                text-white font-medium text-xs 
                                leading-tight uppercase rounded shadow-md 
                                transition duration-150 ease-in-out opacity-60
                                cursor-pointer
                                "
                                    key={scopedTag.id}
                                    onClick={() => {addTagToItemHandler(scopedTag.id)}}
                                >
                                    {scopedTag.name}
                                </button>
                            )
                        })
                    }
                </div>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={onClose}>Close</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}