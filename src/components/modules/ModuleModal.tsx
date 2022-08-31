import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Input, ModalFooter, Button } from '@chakra-ui/react'
import React from 'react'
import { customTheme } from '../../theme'
import { IModule, useUcfrListsContext, useUpdateUcfrListsContext } from '../../UcfrsContext'

function ModuleModal({isOpen, onClose, module: receivedModule}: 
    {isOpen: boolean, onClose: () => void, module: IModule}
    ) {
        const ucfrListsFromContext = useUcfrListsContext()
        const updateUcfrListsFromContext = useUpdateUcfrListsContext()


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
            updateUcfrListsFromContext({
                ...ucfrListsFromContext,
                modules: ucfrListsFromContext.modules.filter(m => m.id !== receivedModule.id)
            })
        }

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
                    <button onClick={deleteModuleHandler}>Delete module</button>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={onClose}>
                    Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default ModuleModal