import { Flex } from "@chakra-ui/react";
import React from "react";
import { useCurrentModuleContext, useUcfrListsContext, useUpdateUcfrListsContext } from "../../../UcfrsContext";
import UseCaseItem from "./UseCaseItem";


export default function UseCasesList() {
   const ucfrListsFromContext = useUcfrListsContext();
   const updateUcfrListsFromContext = useUpdateUcfrListsContext();

   const currentModuleFromContext = useCurrentModuleContext()


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
    // the drag use case should exit the list, then on drop it should be added to the list moving the forward elements to the right
      if (dragItem) {
         const module = ucfrListsFromContext.modules.find(m => m.id === currentModuleFromContext.id)
         if (!module) { throw new Error("Module not found")}
         const newUsecases = [...module.useCases]
         const dragIndex = newUsecases.indexOf(dragItem)
         const dropIndex = newUsecases.findIndex(u => u.id === id)
         newUsecases.splice(dragIndex, 1)
         newUsecases.splice(dropIndex, 0, dragItem)
         updateUcfrListsFromContext({
            ...ucfrListsFromContext,
            modules: ucfrListsFromContext.modules.map(m => {
               if (m.id === currentModuleFromContext.id) {
                  return {
                     ...m,
                     useCases: newUsecases
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
         className={'usecasesListContainer'}
         direction={'column'}
         alignItems={'center'}
         width={'100%'}
      >
         {ucfrListsFromContext.modules.find(m => m.id === currentModuleFromContext.id)?.useCases.map((usecase, i) => (
            <Flex
               key={usecase.id}
               draggable={true} 
               onDragStart={(e) => dragStart(e, usecase)} 
               onDragEnd={(e) => dragEnd(e)} 
               onDragOver={(e) => dragOver(e)} 
               onDrop={(e) => dragDrop(e, usecase.id)} 
               direction={'row'} alignItems={'center'} 
               width={'100%'}
            >
               <UseCaseItem usecase={usecase}/>
            </Flex>
         ))}
      </Flex>
   )
}