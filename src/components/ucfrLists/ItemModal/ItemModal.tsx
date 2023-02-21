import { Box, Button, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react"
import TagClickable from "@myComponents/tags/TagClickable"
import { IFunctionalRequirement, INestedUseCase, IUseCase } from "@myContexts/UcfrsContext"
import { customTheme } from "@myStyles/GlobalStyles"
import React, { useEffect } from "react"
import ModalClickable from "./ModalClickable"
import { ManageComponentUcfrActions } from "../../../lib/componentActions"
import AddFRequirementToItemModal from "./fRequirementRelation/AddFRequirementToItemModal"
import AddPipelineModal from "./pipelineRelation/AddPipelineModal"
import AddTagToItemModal from "./tagRelation/addTagToItemModal"
import ConfirmationModal from "@myComponents/ConfirmationModal"


function ItemModal({
    isOpen, onClose, 
    item: itemReceived,
    itemType
} : {
    isOpen: boolean, onClose: () => void
    item: IUseCase | INestedUseCase | IFunctionalRequirement
    itemType: "useCase" | "nestedUseCase" | "functionalRequirement"
} ) {
    const ActionsManager = new ManageComponentUcfrActions()

    const [itemNameInput, setItemNameInput] = React.useState(itemReceived?.name || null)
    const itemNameInputHandler = (e) => {setItemNameInput(e.target.value)}
    const handleItemNameSave = () => {
            switch (itemType) {
                case "useCase":
                    ActionsManager.updateUseCaseByIdHandler({
                        id: itemReceived.id,
                        name: itemNameInput,
                        completed: itemReceived.completed,
                    })
                    break;
                case "nestedUseCase":
                    ActionsManager.updateNestedUseCaseByIdHandler({
                        id: itemReceived.id,
                        name: itemNameInput,
                        completed: itemReceived.completed,
                    })
                    break;
                case "functionalRequirement":
                    ActionsManager.updateFunctionalRequirementByIdHandler({
                        id: itemReceived.id,
                        name: itemNameInput,
                        completed: itemReceived.completed,
                    })
                    break;
                default:
                    break;
            }
    }

    const removeTagHandler = (tagId: string) => {
        ActionsManager.removeTagFromItemByIdHandler({
            itemId: itemReceived.id,
            itemType: itemType,
            tagId: tagId
        })
    }

    const removeFRequirementHandler = (fRequirementId: string) => {
        ActionsManager.removeFRequirementFromItemByIdHandler({
            itemId: itemReceived.id,
            itemType: itemType,
            fRequirementId: fRequirementId
        })
    }


    const deleteItemHandler = () => {
        ActionsManager.deleteItemByIdHandler({
            itemId: itemReceived.id,
            itemType: itemType
        }).then(() => {
            onClose()
        })
    }


    useEffect(() => {
        setItemNameInput(itemReceived.name)
    }, [isOpen, itemType, itemReceived])


    // Disclosures
    const { isOpen: isOpenAddTagModal, onOpen: onOpenAddTagModal, onClose: onCloseAddTagModal } = useDisclosure()

    const { isOpen: isOpenAddUseCasePipelineModal, onOpen: onOpenAddUseCasePipelineModal, onClose: onCloseAddUseCasePipelineModal } = useDisclosure()

    const { isOpen: isConfirmationModalOpen, onOpen: onConfirmationModalOpen, onClose: onConfirmationModalClose} = useDisclosure()
    const { isOpen: isOpenAddFRequirementToItModal, onOpen: onOpenAddFRequirementToItModal, onClose: onCloseAddFRequirementToItModal } = useDisclosure()

    if (!isOpen || !itemReceived) return null
    return (
    <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent backgroundColor={customTheme.colors[10]} >
        <ModalHeader>{ 
            itemType === "useCase" ? "Use Case" : 
            itemType === "nestedUseCase" ? "Nested Use Case" : 
            "Functional Requirement"
        } View</ModalHeader>

        <ModalCloseButton />

        <ModalBody>

            <div className='idContainer flex items-center justify-center w-100 rounded bg-gray-100 p-2 mt-[-1rem]'> {itemReceived.id}</div>

            <div className='itemNameContainer
            items-center mt-3
            ' 
            >
                <div className='useCaseNameLabel mt-2'>
                    Name
                </div>
                <textarea className='useCaseNameInput
                    bg-transparent
                    text-black
                    border-b-2
                    border-black
                    p-0.2
                    m-0.5
                    w-[100%]
                    p-1
                    '
                    value={itemNameInput} onChange={itemNameInputHandler} 
                />
                <Button colorScheme={"green"} mr={3} onClick={handleItemNameSave}>
                    Save Name
                </Button>
            </div>



        <hr className="border-gray-300 my-5"/>



            <div className='itemTagsContainer
                flex flex-col mt-2
            '>
                <div className='itemTags
                w-[95%] m-auto
                flex flex-wrap
                gap-3
                p-2
                text-xs
                items-center
                '
                >
                    {itemReceived.tagIds.map((tagId, i) => (
                        <div className="tagContainer
                        flex align-center justify-center
                        " key={tagId}>
                            <div className="tagClickable
                                inline-block 
                                h-[2rem]
                                bg-blue-600
                                text-white font-medium text-xs 
                                leading-tight rounded shadow-md 
                                transition duration-150 ease-in-out
                                cursor-pointer
                                "
                                key={tagId}
                            >
                                <TagClickable style={{
                                    width: '100%', height: '100%', margin: "0 auto",
                                    display: "flex", justifyContent: "center", alignItems: "center",
                                    padding: '0 1rem'
                                }}
                                tagId={tagId}
                                />
                            </div>
                            <button className="removeTagButton
                            inline-block 
                            px-3 py-2.5 h-[2rem]
                            bg-red-400 hover:bg-red-600
                            text-white font-medium text-xs 
                            leading-tight uppercase rounded shadow-md 
                            transition duration-150 ease-in-out
                            cursor-pointer
                            " onClick={() => {removeTagHandler(tagId)}}>X</button>
                        </div>
                    ))}
                </div>
                <button className=' addTagButton
                inline-block px-6 py-2.5 
                mt-2
                bg-blue-400 text-white 
                font-medium text-xs leading-tight uppercase 
                rounded shadow-md 
                hover:bg-blue-500 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out
                ' onClick={onOpenAddTagModal}>+ Add Tag</button>
                <AddTagToItemModal isOpen={isOpenAddTagModal} onClose={onCloseAddTagModal} itemId={itemReceived.id} itemType={itemType}/>
            </div>



        <hr className="border-gray-300 my-5"/>


            {("useCase" === itemType || "nestedUseCase" === itemType) && (<>
            <Box  flex='1' textAlign='left' color='black'>
                    Required PipeLines
            </Box>
            <button className='addPipelineButton inline-block px-6 py-2.5 
                mt-2
                bg-blue-400 text-white 
                font-medium text-xs leading-tight uppercase 
                rounded shadow-md 
                hover:bg-blue-500 hover:shadow-lg 
                focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 
                active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out
                w-[100%]
            'onClick={onOpenAddUseCasePipelineModal}>Add Use Case Pipeline</button>
            <AddPipelineModal isOpen={isOpenAddUseCasePipelineModal} onClose={onCloseAddUseCasePipelineModal} itemId={itemReceived.id} itemType={itemType}/>

            <Flex className='pipelinesList'>
                {itemReceived["useCasesPipelineIds"].map((useCasePipelineId: string) => {
                    const foundScopedUseCase = ActionsManager.ucfrListsFromContext.modules
                    .reduce((acc, module) => { return acc.concat(module.useCases) }, [])
                    .find(useCase => useCase.id === useCasePipelineId)
                    return foundScopedUseCase ? (
                        <div key={useCasePipelineId}>
                            <ModalClickable item={foundScopedUseCase} itemType={"useCase"}>
                                {foundScopedUseCase.name}
                            </ModalClickable>
                        </div>
                    ) : (
                        <>error</>
                )})}
            </Flex>
            </>)}



        <hr className="border-gray-300 my-5"/>



            <h2>
                <Box flex='1' textAlign='left' color='black'>
                    Required functionalities
                </Box>
            </h2>

            <button className='addFRToItem inline-block px-6 py-2.5 
            mt-2
            bg-blue-400 text-white 
            font-medium text-xs leading-tight uppercase 
            rounded shadow-md 
            hover:bg-blue-500 hover:shadow-lg 
            focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 
            active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out
            w-[100%]
            ' onClick={onOpenAddFRequirementToItModal}>Add Functional Requirement</button>
            <AddFRequirementToItemModal isOpen={isOpenAddFRequirementToItModal} onClose={onCloseAddFRequirementToItModal} itemId={itemReceived.id} itemType={itemType}/>

            {(ActionsManager.ucfrListsFromContext.modules.reduce((acc, module) => { 
                if (itemType === "useCase") {
                    return [...acc, ...module.useCases] 
                }
                if (itemType === "nestedUseCase") {
                    return [...acc, ...module.nestedUseCases]
                }
                return [...acc, ...module.functionalRequirements]
            }, [])
                .find((scopedItem) => scopedItem.id === itemReceived.id) as IUseCase | INestedUseCase | IFunctionalRequirement)[
                    "neededFrsToWorkIds" in itemReceived ? "neededFrsToWorkIds" : "frDependencies"
                ].map((dependencyId) => {
                    const fRequirementFound = ActionsManager.ucfrListsFromContext.modules
                    .reduce((acc, module) => { return [...acc, ...module.functionalRequirements] }, [])
                    .find((fr) => fr.id === dependencyId)
                    return fRequirementFound ? (
                        <ModalClickable key={dependencyId} item={fRequirementFound} itemType={"functionalRequirement"}>
                            <Flex className='FRDependency' >
                                <h1>
                                    {fRequirementFound.name}
                                </h1>
                                <Button colorScheme={"blue"} onClick={() => { removeFRequirementHandler(dependencyId) }}>X</Button>
                            </Flex>
                        </ModalClickable>
                    ) : <>error</>
            })}

        </ModalBody>

        <ModalFooter>
            <Button colorScheme={"blue"} mr={3} 
            onClick={onConfirmationModalOpen}
            >
                Delete {itemType}
            </Button>
            <ConfirmationModal isOpen={isConfirmationModalOpen} onClose={onConfirmationModalClose} callback={deleteItemHandler}/>
        </ModalFooter>
    </ModalContent>
    </Modal>
    )
}

export default ItemModal

