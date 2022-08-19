import { Flex, Grid } from "@chakra-ui/react";
import React from "react";
import { IFunctionalRequirement, useCurrentModuleContext, useUcfrListsContext, useUpdateUcfrListsContext } from "../../../UcfrsContext";
import { GenerateUUID } from "../../../utils/UUIDGenerator";
import FRequirementItem from "./FRequirementItem";


export default function FRequirementList() {
   const ucfrListsFromContext = useUcfrListsContext();
   const updateUcfrListsFromContext = useUpdateUcfrListsContext();

   const currentModuleFromContext = useCurrentModuleContext()

   // const [FRequirementAncorSelectValue, setFRequirementAncorSelectValue] = React.useState<string>("")
   // const FRequirementAncorSelectValueHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
   //    if (!e.target.value || e.target.value === "") {
   //       return
   //    }
   //    setFRequirementAncorSelectValue(e.target.value)
   // }


   const [FRequirementAddInput, setFRequirementAddInput] = React.useState<string>("")
   const FRequirementAddInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFRequirementAddInput(e.target.value)
   }
   const FRequirementAddHandler = () => {
      if ("" === FRequirementAddInput) {
         return
      }
      // if ("" === FRequirementAncorSelectValue || !FRequirementAncorSelectValue) {
      //    return
      // }
      const newFRequirement: IFunctionalRequirement = {
         id: GenerateUUID(),
         name: FRequirementAddInput,
         moduleId: currentModuleFromContext.id,
         done: false,
         tagIds: [],
         frDependencies: [],
      }
      updateUcfrListsFromContext({
         ...ucfrListsFromContext,
         modules: ucfrListsFromContext.modules.map(m => {
            if (m.id !== currentModuleFromContext.id) {
               return m
            }
            return {
               ...m,
               functionalRequirements: [...m.functionalRequirements, newFRequirement]
            }
         }
         )
      })

      setFRequirementAddInput("")
   }

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
         const newFRequirements = [...module.functionalRequirements]
         const dragIndex = newFRequirements.indexOf(dragItem)
         const dropIndex = newFRequirements.findIndex(u => u.id === id)
         newFRequirements[dragIndex] = newFRequirements[dropIndex]
         newFRequirements[dropIndex] = dragItem
         updateUcfrListsFromContext({
            ...ucfrListsFromContext,
            modules: ucfrListsFromContext.modules.map(m => {
               if (m.id !== currentModuleFromContext.id) {
                  return m
               }
               return {
                  ...m,
                  FRequirements: newFRequirements
               }
            }
            )
         })
      }
   }
   return (
      <>
         <Flex className={'FRequirementAddContainer'} direction={'column'}>
            {/* <select className='select' onChange={FRequirementAncorSelectValueHandler}>
               <option value={''}>Select a use case to add</option>
               {ucfrListsFromContext.modules.find(m => m.id === currentModuleFromContext.id)?.reduce((acc, m) => {
                  return [...acc, ...m.useCases, m.nestedUseCases]
               }, []).map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
               ))}
            </select> */}

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
                  draggable={true} 
                  onDragStart={(e) => dragStart(e, FR)} 
                  onDragEnd={(e) => dragEnd(e)} 
                  onDragOver={(e) => dragOver(e)} 
                  onDrop={(e) => dragDrop(e, FR.id)} 
                  direction={'row'} alignItems={'center'} 
                  width={'100%'}
                  marginTop={'.5rem'}
               >
                  <FRequirementItem FRequirementReceived={FR}/>
               </Flex>
            ))}
         </Flex>
      </>
   )
}