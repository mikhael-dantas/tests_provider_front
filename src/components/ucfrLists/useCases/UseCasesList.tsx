import { Flex } from "@chakra-ui/react";
import React from "react";
import { useAlertStackComponentContext, useUpdateAlertStackComponentContext } from "../../../AlertStackContext";
import { UcfrListsContextInterfaces, useCurrentModuleContext, useUcfrListsContext, useUpdateUcfrListsContext } from "../../../UcfrsContext";
import UseCaseItem from "./UseCaseItem";


export default function UseCasesList() {
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
      if (dragItem) {
         ucfrListsInterfaces.dragAndDropUseCase({
            dragUseCaseId: dragItem.id,
            dropUseCaseId: id,
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