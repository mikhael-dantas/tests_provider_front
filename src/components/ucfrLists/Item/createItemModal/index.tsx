import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react"
import { IFunctionalRequirement, IModule, INestedUseCase, IUseCase, useCurrentModuleContext } from "@myContexts/UcfrsContext"
import { customTheme } from "@myStyles/GlobalStyles"
import React, { useEffect, useState } from "react"
import { ManageComponentUcfrActions } from "src/lib/componentActions"


export default function CreateItemModal({
    isOpen, onClose, 
    itemType,
    addTo
} : {
    isOpen: boolean, onClose: () => void
    itemType: "useCase" | "nestedUseCase" | "functionalRequirement"
    addTo?: {type: "useCase" | "nestedUseCase" | "functionalRequirement", id: string}
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
        try {
            createItemFunction({itemType, itemNameInput, nestedUseCaseParent, currentModuleFromContext, ActionsManager})
            .then((res) => {
                if (addTo) {
                    addToFunction({itemType, ActionsManager, addTo, itemId: res.id})
                }
                onClose()
            })
        } catch (error) {
            ActionsManager.alert('error', error.message)
        }
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


    // // Disclosures
    // const { isOpen: isOpenAddTagModal, onOpen: onOpenAddTagModal, onClose: onCloseAddTagModal } = useDisclosure()


    useEffect(() => {
        if (isOpen) {
            setItemNameInput("")
            setNestedUseCaseParent("")
        }
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

            <h1 className="w-[100%] mt-4">Name</h1>
            <textarea className="w-[100%] p-1"
            value={itemNameInput} onChange={itemNameInputHandler} placeholder="Item name" />

            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mt-4"
            onClick={createItemHandler} >Create</button>
        </ModalBody>
    </ModalContent>
    </Modal>
    )
}

async function createItemFunction({
    itemType, itemNameInput, nestedUseCaseParent, currentModuleFromContext,
    ActionsManager
}:{
    itemType: "useCase" | "nestedUseCase" | "functionalRequirement", 
    itemNameInput: string, nestedUseCaseParent: string, currentModuleFromContext: IModule,
    ActionsManager: ManageComponentUcfrActions
}): Promise<IUseCase | INestedUseCase | IFunctionalRequirement> {
    switch (itemType) {
        case "useCase":
            return ActionsManager.ucfrListsInterfaces.createUseCase({name: itemNameInput, moduleId: currentModuleFromContext.id})
        case "nestedUseCase":
            return ActionsManager.ucfrListsInterfaces.createNestedUseCase({name: itemNameInput, moduleId: currentModuleFromContext.id, parentId: nestedUseCaseParent})
        case "functionalRequirement":
            return ActionsManager.ucfrListsInterfaces.createFunctionalRequirement({name: itemNameInput, moduleId: currentModuleFromContext.id})
    }
}

async function addToFunction({
    itemType,
    ActionsManager, addTo, itemId
}:{
    itemType: "useCase" | "nestedUseCase" | "functionalRequirement", 
    ActionsManager: ManageComponentUcfrActions,
    addTo: {type: "useCase" | "nestedUseCase" | "functionalRequirement", id: string}
    itemId: string
}): Promise<void> {
    switch (itemType) {
        case "useCase":
            switch (addTo.type) {
                case "useCase":
                    return ActionsManager.ucfrListsInterfaces.addUseCaseToUseCasePipeline({
                        useCaseIdToAdd: itemId,
                        useCasePipelineId: addTo.id
                    })
                case "nestedUseCase":
                    return ActionsManager.ucfrListsInterfaces.addUseCaseToNestedUseCasePipeline({
                        useCaseIdToAdd: itemId,
                        nestedUseCasePipelineId: addTo.id
                    })
                case "functionalRequirement":
                    throw new Error("Cannot add use case to functional requirement")
            }
        case "nestedUseCase":
            throw new Error("Cannot add nested use case to anything")
        case "functionalRequirement":
            switch (addTo.type) {
                case "useCase":
                    return ActionsManager.ucfrListsInterfaces.addFunctionalRequirementToUseCase({
                        useCaseId: addTo.id,
                        functionalRequirementId: itemId
                    })
                case "nestedUseCase":
                    return ActionsManager.ucfrListsInterfaces.addFunctionalRequirementToNestedUseCase({
                        nestedUseCaseId: addTo.id,
                        functionalRequirementId: itemId
                    })
                case "functionalRequirement":
                    return ActionsManager.ucfrListsInterfaces.addFunctionalRequirementToFunctionalRequirement({
                        functionalRequirementReceiverId: addTo.id,
                        functionalRequirementId: itemId
                    })
            }
    }
}