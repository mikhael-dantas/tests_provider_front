import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Input, ModalFooter, Button, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import { customTheme } from '../../theme'
import { IModule, useCurrentModuleContext, useUcfrListsContext, useUpdateUcfrListsContext } from '../../UcfrsContext'
import ConfirmationModal from '../ConfirmationModal'

function ModuleModal({isOpen, onClose, module: receivedModule}: 
    {isOpen: boolean, onClose: () => void, module: IModule}
    ) {
    const ucfrListsFromContext = useUcfrListsContext()
    const updateUcfrListsFromContext = useUpdateUcfrListsContext()

    const currentModuleFromContext = useCurrentModuleContext()


    const [moduleEditNameInput, setModuleEditNameInput] = React.useState<string>("")

    const moduleEditNameInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setModuleEditNameInput(e.target.value)
    }

    const moduleEditNameHandler = () => {
        if (moduleEditNameInput === '') {
            return
        }

        const moduleToEdit = ucfrListsFromContext.modules.find(m => m.id === receivedModule.id)

        if (!moduleToEdit) {
            console.log(`moduleToEdit not found: ${receivedModule.id}`)
            return
        }

        const newModule = {
            ...moduleToEdit,
            name: moduleEditNameInput,
        }

        updateUcfrListsFromContext({
            ...ucfrListsFromContext,
            modules: ucfrListsFromContext.modules.map(m => {
                if (m.id === newModule.id) {
                    return newModule
                }
                return m
            }
            )
        })
    }

    const deleteModuleHandler = () => {
        if (currentModuleFromContext?.id === receivedModule.id) {
            console.log('Cannot delete current module')
            return
        }

        updateUcfrListsFromContext({
            ...ucfrListsFromContext,
            modules: ucfrListsFromContext.modules.filter(m => m.id !== receivedModule.id)
        })
    }

    const { isOpen: secondIsOpen, onOpen: secondOnOpen, onClose: secondOnClose } = useDisclosure()

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent backgroundColor={customTheme.colors[10]}>
                <ModalHeader>{receivedModule.name}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <input 
                    style={{backgroundColor: 'white', color: 'black'}}
                    value={moduleEditNameInput} onChange={moduleEditNameInputHandler} />
                    <button onClick={moduleEditNameHandler}>Save name</button>
                    <button onClick={secondOnOpen}>Delete module</button>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={onClose}>
                    Close
                    </Button>
                </ModalFooter>
            </ModalContent>
            <ConfirmationModal isOpen={secondIsOpen} onClose={secondOnClose} callback={deleteModuleHandler}/>
        </Modal>
    )
}

export default ModuleModal