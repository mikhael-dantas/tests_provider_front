import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react"
import { IUseCase, useCurrentModuleContext } from "@myContexts/UcfrsContext"
import { customTheme } from "@myStyles/GlobalStyles"
import React, { useEffect, useState } from "react"
import { ManageComponentUcfrActions } from "src/lib/componentActions"


export default function CreateItemModal({
    isOpen, onClose, 
    itemType
} : {
    isOpen: boolean, onClose: () => void
    itemType: "useCase" | "nestedUseCase" | "functionalRequirement"
} ) {

    const ActionsManager = new ManageComponentUcfrActions()
    const currentModuleFromContext = useCurrentModuleContext()


    const [itemNameInput, setItemNameInput] = useState("")
    const itemNameInputHandler = (e) => {setItemNameInput(e.target.value)}

    const [nestedUseCaseParent, setNestedUseCaseParent] = React.useState("")


    const [value, setValue] = useState('');
    const [options, setOptions] = useState<IUseCase[]>([]);

    const createItemHandler = () => {
        if (itemType === "nestedUseCase" && nestedUseCaseParent === "") return
        if (itemNameInput === "") return
        switch (itemType) {
            case "useCase":
                ActionsManager.ucfrListsInterfaces.createUseCase({name: itemNameInput, moduleId: currentModuleFromContext.id})
                break;
            case "nestedUseCase":
                ActionsManager.ucfrListsInterfaces.createNestedUseCase({name: itemNameInput, moduleId: currentModuleFromContext.id, parentId: nestedUseCaseParent})
                break;
            case "functionalRequirement":
                ActionsManager.ucfrListsInterfaces.createFunctionalRequirement({name: itemNameInput, moduleId: currentModuleFromContext.id})
                break;
        }
        onClose()
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        setValue(inputValue);
    
        ActionsManager.ucfrListsInterfaces.searchSubstringAndFilter(inputValue, {
            searchIn: {
                functionalRequirements: false,
                nestedUseCases: false,
                useCases: true
            }
        }).then((res) => {
            setOptions(res.useCases)
        })
    };

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;
        setNestedUseCaseParent(selectedValue)
    };


    // Disclosures
    const { isOpen: isOpenAddTagModal, onOpen: onOpenAddTagModal, onClose: onCloseAddTagModal } = useDisclosure()


    useEffect(() => {
    }, [isOpen])

    if (!isOpen) return null

    return (
    <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent backgroundColor={customTheme.colors[10]} >
        <ModalHeader>{ 
            itemType === "useCase" ? "Use Case" : 
            itemType === "nestedUseCase" ? "Nested Use Case" : 
            "Functional Requirement"
        } Creation</ModalHeader>

        <ModalCloseButton />

        <ModalBody>
            {itemType === "nestedUseCase" && (
            <div>
                <label htmlFor="input">Filter:</label>
                <input type="text" id="input" value={value} onChange={handleInputChange} />
        
                <label htmlFor="select">Options:</label>
                <select id="select" onChange={handleSelectChange} defaultValue={nestedUseCaseParent}>
                    <option value="">Select an option</option>
                    {options.map((option) => (
                        <option key={option.id} value={option.id}>
                        {option.name}
                        </option>
                    ))}
                </select>
            </div>
            )}

            <input className=""
            type="text" value={itemNameInput} onChange={itemNameInputHandler} placeholder="Item name" />

            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
            onClick={createItemHandler} >Create</button>
        </ModalBody>
    </ModalContent>
    </Modal>
    )
}