import { Button, Flex, Grid, useDisclosure } from "@chakra-ui/react";
import React from "react";
import { useAlertStackComponentContext, useUpdateAlertStackComponentContext } from "../../../AlertStackContext";
import { INestedUseCase, IUseCase, UcfrListsContextInterfaces, useCurrentModuleContext, useUcfrListsContext, useUpdateUcfrListsContext } from "../../../UcfrsContext";
import { GenerateUUID } from "../../../utils/UUIDGenerator";
import AddNestedUseCase from "./AddNestedUseCase";
import NestedUseCaseItem from "./NestedUseCaseItem";
import SelectUseCaseModal from "./SelectUseCaseModal";


export default function NestedUseCaseList() {
   // contextManagement SDK
   const ucfrListsFromContext = useUcfrListsContext()
   const updateUcfrListsFromContext = useUpdateUcfrListsContext()
   const ucfrListsInterfaces = new UcfrListsContextInterfaces(
      ucfrListsFromContext,
      updateUcfrListsFromContext
   )
   const alertStackComponentFromContext = useAlertStackComponentContext()
   const updateAlertStackComponentFromContext = useUpdateAlertStackComponentContext()

   const currentModuleFromContext = useCurrentModuleContext()


   const [selectedUseCaseToNestFrom, setSelectedUseCaseToNestFrom] = React.useState<IUseCase | null>(null)




   // make a draggable list of usecases
   const [dragItem, setDragItem] = React.useState<any>(null)

   const dragStart = (e: any, item: any) => {
      setDragItem(item)
   }
   const dragEnd = (e: any) => {
      setDragItem(null)
   }
   const dragOver = (e: React.DragEvent) => {
      e.preventDefault()
      e.dataTransfer.dropEffect = 'move'
   }
   const dragDrop = (e: React.DragEvent, id: string) => {
    // the drag use case should exit the list, then on drop it should take place of the dropped index and send the item back to the first index
      if (dragItem) {
         const module = ucfrListsFromContext.modules.find(m => m.id === currentModuleFromContext.id)
         if (!module) { throw new Error("Module not found")}
         const newNestedUseCases = [...module.nestedUseCases]
         const dragIndex = newNestedUseCases.indexOf(dragItem)
         const dropIndex = newNestedUseCases.findIndex(u => u.id === id)
         newNestedUseCases[dragIndex] = newNestedUseCases[dropIndex]
         newNestedUseCases[dropIndex] = dragItem
         updateUcfrListsFromContext({
            ...ucfrListsFromContext,
            modules: ucfrListsFromContext.modules.map(m => {
               if (m.id !== currentModuleFromContext.id) {
                  return m
               }
               return {
                  ...m,
                  nestedUseCases: newNestedUseCases
               }
            }
            )
         })
      }
   }


   const { isOpen: isOpenSelectUseCaseModal, onOpen: onOpenSelectUseCaseModal, onClose: onCloseSelectUseCaseModal } = useDisclosure()
   return (
      <Flex direction={'column'}>
         <Grid
         templateColumns="2fr 3fr 3fr 2fr"
         backgroundColor={'gray'}
         >
            <button className='button' onClick={onOpenSelectUseCaseModal}>Select Use Case To Deal With</button>
            <SelectUseCaseModal
               isOpen={isOpenSelectUseCaseModal} onClose={onCloseSelectUseCaseModal} 
               setSelectedUseCaseToNestFrom={setSelectedUseCaseToNestFrom} selectedUseCaseToNestFrom={selectedUseCaseToNestFrom} 
            />
            <Flex>Selected Use Case</Flex>
            <Flex>{selectedUseCaseToNestFrom ? selectedUseCaseToNestFrom.name : 'None'}</Flex>
         </Grid>
         {selectedUseCaseToNestFrom ? 
            <>
            <Flex className={'nestedUseCaseAddContainer'} direction={'column'}>
               <AddNestedUseCase selectedUseCase={selectedUseCaseToNestFrom} />
            </Flex>
            <Flex className={'nestedUseCasesListContainer'}
               direction={'column'}
               alignItems={'center'}
               width={'100%'}
            >
               teste
            </Flex>
            </> 
            : null
         }
      </Flex>
   )
}