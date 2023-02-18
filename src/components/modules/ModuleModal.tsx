import { useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button } from "@chakra-ui/react"
import ConfirmationModal from "@myComponents/ConfirmationModal"
import { useAlertStackComponentContext, useUpdateAlertStackComponentContext, GenerateAlertComponent } from "@myContexts/AlertStackContext"
import { useUcfrListsContext, useUpdateUcfrListsContext } from "@myContexts/UcfrsContext"
import { UcfrListsContextInterfaces } from "src/lib/featuresInterfaces/UcfrListsContextInterfaces"
import { customTheme, ModalInputStyle } from "@myStyles/GlobalStyles"
import React, { useEffect } from "react"


function ModuleModal({isOpen, onClose, moduleId: receivedModuleId}: 
    {isOpen: boolean, onClose: () => void, moduleId: string}
    ) {

    // contextManagement SDK
    const ucfrListsFromContext = useUcfrListsContext()
    const updateUcfrListsFromContext = useUpdateUcfrListsContext()
    const ucfrListsInterfaces = new UcfrListsContextInterfaces(
        ucfrListsFromContext,
        updateUcfrListsFromContext
    )
    const alertStackComponentFromContext = useAlertStackComponentContext()
    const updateAlertStackComponentFromContext = useUpdateAlertStackComponentContext()



    const [moduleEditNameInput, setModuleEditNameInput] = React.useState<string>("")
    const moduleEditNameInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setModuleEditNameInput(e.target.value)
    }

    const moduleEditNameHandler = () => {
        ucfrListsInterfaces.updateModuleById({moduleId: receivedModuleId, newModuleName: moduleEditNameInput})
        .then(() => {
            setModuleEditNameInput("")
            updateAlertStackComponentFromContext([
                ...alertStackComponentFromContext,
                {component: GenerateAlertComponent({status: "success", text: "Module edited successfully"})}
            ])
        })
        .catch(err => {
            updateAlertStackComponentFromContext([
                ...alertStackComponentFromContext, 
                { component:  GenerateAlertComponent({ status: 'error', text: err.message })}
            ])
        })
    }

    const deleteModuleHandler = () => {
        ucfrListsInterfaces.removeModule({moduleId: receivedModuleId})
        .then(() => {
            updateAlertStackComponentFromContext([
                ...alertStackComponentFromContext,
                {component: GenerateAlertComponent({status: "success", text: "Module deleted successfully"})}
            ])
        })
        .catch(err => {
            updateAlertStackComponentFromContext([
                ...alertStackComponentFromContext, 
                { component:  GenerateAlertComponent({ status: 'error', text: err.message })}
            ])
        })
    }

    useEffect(() => {
        ucfrListsInterfaces.readModuleById({moduleId: receivedModuleId}).then(module => {
            setModuleEditNameInput(module.name)
        })
        .catch(err => {
            updateAlertStackComponentFromContext([
                ...alertStackComponentFromContext,
                {component: GenerateAlertComponent({status: "error", text: err.message})}
            ])
        })
    }, [receivedModuleId])



    const { isOpen: secondIsOpen, onOpen: secondOnOpen, onClose: secondOnClose } = useDisclosure()

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent backgroundColor={customTheme.colors[10]}>
                <ModalHeader>{'Module View & edit'}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {"Name:"} 
                    <input 
                    style={ModalInputStyle}
                    value={moduleEditNameInput} onChange={moduleEditNameInputHandler} />
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme={"blue"} mr={3} onClick={moduleEditNameHandler}>
                        Save
                    </Button>
                    <Button colorScheme={"blue"} mr={3} 
                    onClick={secondOnOpen}
                    >
                        Delete Module
                    </Button>
                </ModalFooter>
            </ModalContent>
            <ConfirmationModal isOpen={secondIsOpen} onClose={secondOnClose} callback={deleteModuleHandler}/>
        </Modal>
    )
}

export default ModuleModal