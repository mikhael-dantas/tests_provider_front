import { Flex } from "@chakra-ui/react";
import React from "react";
import { useCurrentModuleContext, useUcfrListsContext, useUpdateUcfrListsContext } from "../../../UcfrsContext";
import UseCaseItem from "./UseCaseItem";


export default function UseCasesList() {
   const ucfrListsFromContext = useUcfrListsContext();
   const updateUcfrListsFromContext = useUpdateUcfrListsContext();

   const currentModuleFromContext = useCurrentModuleContext()


   // make a draggable list of useCases
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
    // the drag use case should exit the list, then on drop it should be added to the list moving the forward elements to the right
      if (dragItem) {
         const module = ucfrListsFromContext.modules.find(m => m.id === currentModuleFromContext.id)
         if (!module) { throw new Error("Module not found")}
         const newUseCases = [...module.useCases]
         const dragIndex = newUseCases.indexOf(dragItem)
         const dropIndex = newUseCases.findIndex(u => u.id === id)
         newUseCases.splice(dragIndex, 1)
         newUseCases.splice(dropIndex, 0, dragItem)
         updateUcfrListsFromContext({
            ...ucfrListsFromContext,
            modules: ucfrListsFromContext.modules.map(m => {
               if (m.id === currentModuleFromContext.id) {
                  return {
                     ...m,
                     useCases: newUseCases
                  }
               } else {
                  return m
               }
            }
            )
         })
      }
   }
   return (
      <Flex
         className={'useCasesListContainer'}
         direction={'column'}
         alignItems={'center'}
         width={'100%'}
      >
         {ucfrListsFromContext.modules.find(m => m.id === currentModuleFromContext.id)?.useCases.map((scopedUseCase, i) => (
            <Flex
               key={scopedUseCase.id + "useCaseItem"}
               draggable={true} 
               onDragStart={(e) => dragStart(e, scopedUseCase)} 
               onDragEnd={(e) => dragEnd(e)} 
               onDragOver={(e) => dragOver(e)} 
               onDrop={(e) => dragDrop(e, scopedUseCase.id)}
               direction={'row'} alignItems={'center'} 
               width={'95%'}
               marginTop={'.5rem'}
               padding={'.5rem'}
            >
               <UseCaseItem useCase={scopedUseCase}/>
            </Flex>
         ))}
      </Flex>
   )
}