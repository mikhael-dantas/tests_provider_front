import { Flex, Grid } from "@chakra-ui/react"
import { useAlertStackComponentContext, useUpdateAlertStackComponentContext, GenerateAlertComponent } from "@myContexts/AlertStackContext"
import { useUcfrListsContext, useUpdateUcfrListsContext, useCurrentModuleContext } from "@myContexts/UcfrsContext"
import { UcfrListsContextInterfaces } from "@myFeaturesInterfaces/UcfrListsContextInterfaces"
import React from "react"
import FRequirementItem from "./FRequirementItem/FRequirementItem"


export default function FRequirementList() {
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


   const [FRequirementAddInput, setFRequirementAddInput] = React.useState<string>("")
   const FRequirementAddInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFRequirementAddInput(e.target.value)
   }

   const FRequirementAddHandler = () => {
      ucfrListsInterfaces.createFunctionalRequirement({
         moduleId: currentModuleFromContext.id,
         name: FRequirementAddInput,
      })
      .then(() => {
         updateAlertStackComponentFromContext([
            ...alertStackComponentFromContext,
            {
               component: GenerateAlertComponent({ status: "success", text: "Functional Requirement created" }),
            },
         ])
         setFRequirementAddInput("")
      })
      .catch((err) => {
         updateAlertStackComponentFromContext([
            ...alertStackComponentFromContext,
            {
               component: GenerateAlertComponent({ status: "error", text: err.message }),
            },
         ])
      })
   }

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
         ucfrListsInterfaces.dragAndDropFunctionalRequirement({
            dragFunctionalRequirementId: dragItem.id,
            dropFunctionalRequirementId: id,
         })
      }
   }

   return (
      <>
         <Flex className={'FRequirementAddContainer'} direction={'column'}>
            <Grid className={'addFRequirementForm'} 
               templateColumns={'3fr 1fr'}
               width={'100%'}
               height={'2rem'}
            >
               <input className={'input'} type={'text'} value={FRequirementAddInput} onChange={FRequirementAddInputHandler} />
               <button className={'button'} onClick={FRequirementAddHandler}>Add</button>
            </Grid>
         </Flex>
         <Flex className={'FRequirementsListContainer'}
            direction={'column'}
            alignItems={'center'}
            width={'100%'}
         >
            {ucfrListsFromContext.modules.find(m => m.id === currentModuleFromContext.id)?.functionalRequirements.map(FR => (
               <Flex
                  key={FR.id}
                  direction={'row'} alignItems={'center'} 
                  width={'100%'}
                  marginTop={'.5rem'}
               >
                  <FRequirementItem FRequirementReceived={FR} dragDrop={dragDrop} dragStart={dragStart} dragEnd={dragEnd} dragOver={dragOver} />
               </Flex>
            ))}
         </Flex>
      </>
   )
}