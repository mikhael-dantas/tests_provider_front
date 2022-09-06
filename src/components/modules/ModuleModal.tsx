import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { GenerateAlertComponent, useAlertStackComponentContext, useUpdateAlertStackComponentContext } from '../../AlertStackContext'
import { customTheme } from '../../theme'
import { IModule, UcfrListsContextInterfaces, useUcfrListsContext, useUpdateUcfrListsContext } from '../../UcfrsContext'
import ConfirmationModal from '../ConfirmationModal'
import { ModalInputStyle } from '../GlobalStyles'

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
                    <Button colorScheme='green' mr={3} onClick={moduleEditNameHandler}>
                        Save
                    </Button>
                    <Button colorScheme='red' mr={3} 
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