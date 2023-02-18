import { Flex } from "@chakra-ui/react"
import { IFunctionalRequirement, INestedUseCase, IUseCase, useCurrentModuleContext } from "@myContexts/UcfrsContext"
import React, { useEffect } from "react"
import { ManageComponentUcfrActions } from "src/lib/componentActions"
import Item from "./Item/Item"


export default function ItemList({
   itemType,
}:{
   itemType: "useCase" | "functionalRequirement" | "nestedUseCase"
}) {
   const ActionsManager = new ManageComponentUcfrActions()

   const currentModuleFromContext = useCurrentModuleContext()


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
      switch (itemType) {
         case "useCase":
            if (dragItem) {
               ActionsManager.ucfrListsInterfaces.dragAndDropUseCase({
                  dragUseCaseId: dragItem.id,
                  dropUseCaseId: id,
               })
            }
            break;
         case "nestedUseCase":
            if (dragItem) {
               ActionsManager.ucfrListsInterfaces.dragAndDropNestedUseCase({
                  dragNestedUseCaseId: dragItem.id,
                  dropNestedUseCaseId: id,
               })
            }
            break;
         case "functionalRequirement":
            if (dragItem) {
               ActionsManager.ucfrListsInterfaces.dragAndDropFunctionalRequirement({
                  dragFunctionalRequirementId: dragItem.id,
                  dropFunctionalRequirementId: id,
               })
            }
            break;
         default:
            break;
      }
   }

   useEffect(() => {
   }, [ActionsManager.ucfrListsFromContext, currentModuleFromContext, itemType])

   return (
      <div
         className='useCasesListContainer
         flex flex-col
         items-center
         w-100
         '
      >
         {ActionsManager.ucfrListsFromContext.modules.find(m => m.id === currentModuleFromContext.id)[`${itemType}s`].map((scopedItem: IUseCase | INestedUseCase | IFunctionalRequirement) => (
            <Flex
               key={scopedItem.id + "Item"}
               draggable={true} 
               onDragStart={(e) => dragStart(e, scopedItem)} 
               onDragEnd={(e) => dragEnd(e)} 
               onDragOver={(e) => dragOver(e)} 
               onDrop={(e) => dragDrop(e, scopedItem.id)}
               direction={'row'} alignItems={'center'} 
               width={'95%'}
               marginTop={'.5rem'}
               padding={'.5rem'}
            >
               <Item item={scopedItem} itemType={itemType} />
            </Flex>
         ))}
      </div>
   )
}