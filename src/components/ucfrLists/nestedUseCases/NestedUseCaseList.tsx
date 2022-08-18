import { Flex, Grid } from "@chakra-ui/react";
import React from "react";
import { INestedUseCase, useCurrentModuleContext, useUcfrListsContext, useUpdateUcfrListsContext } from "../../../UcfrsContext";
import { GenerateUUID } from "../../../utils/UUIDGenerator";


export default function NestedUseCaseList() {
   const ucfrListsFromContext = useUcfrListsContext();
   const updateUcfrListsFromContext = useUpdateUcfrListsContext();

   const currentModuleFromContext = useCurrentModuleContext()

   const [nestedUseCaseAncorSelectValue, setNestedUseCaseAncorSelectValue] = React.useState<string>("")
   const nestedUseCaseAncorSelectValueHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setNestedUseCaseAncorSelectValue(e.target.value)
   }


   const [nestedUseCaseAddInput, setNestedUsecaseAddInput] = React.useState<string>("")
   const nestedUseCaseAddInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
      setNestedUsecaseAddInput(e.target.value)
   }
   const nestedUseCaseAddHandler = () => {
      if ("" === nestedUseCaseAddInput) {
         return
      }
      const newNestedUseCase: INestedUseCase = {
         id: GenerateUUID(),
         name: nestedUseCaseAddInput,
         moduleId: currentModuleFromContext.id,
         completed: false,
         parentUseCaseId: nestedUseCaseAncorSelectValue,
         neededFrsToWorkIds: [],
         tagIds: []
      }
      updateUcfrListsFromContext({
         ...ucfrListsFromContext,
         modules: ucfrListsFromContext.modules.map(m => {
            if (m.id !== currentModuleFromContext.id) {
               return m
            }
            return {
               ...m,
               nestedUseCases: [...m.nestedUseCases, newNestedUseCase]
            }
         }
         )
      })

      setNestedUsecaseAddInput("")
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
   return (
      <>
         <Flex className={'nestedUseCaseAddContainer'} direction={'column'}>
            <select className='select' onChange={nestedUseCaseAncorSelectValueHandler}>
               <option value={''}>Select a use case to add</option>
               {ucfrListsFromContext.modules.find(m => m.id === currentModuleFromContext.id)?.useCases.map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
               ))}
            </select>

            <Grid className={'addNestedUseCaseForm'} 
               templateColumns={'3fr 1fr'}
               width={'100%'}
               height={'2rem'}
            >
               <input className={'input'} type={'text'} value={nestedUseCaseAddInput} onChange={nestedUseCaseAddInputHandler} />
               <button className={'button'} onClick={nestedUseCaseAddHandler}>Add</button>
            </Grid>
         </Flex>
         <Flex className={'nestedUseCasesListContainer'}
            direction={'column'}
            alignItems={'center'}
            width={'100%'}
         >
            {ucfrListsFromContext.modules.find(m => m.id === currentModuleFromContext.id)?.nestedUseCases.filter(nestedU => nestedU.parentUseCaseId === nestedUseCaseAncorSelectValue).map(nestedU => (
               <Flex
                  key={nestedU.id}
                  draggable={true} 
                  onDragStart={(e) => dragStart(e, nestedU)} 
                  onDragEnd={(e) => dragEnd(e)} 
                  onDragOver={(e) => dragOver(e)} 
                  onDrop={(e) => dragDrop(e, nestedU.id)} 
                  direction={'row'} alignItems={'center'} 
                  width={'100%'}
                  marginTop={'.5rem'}
               >
                  <div>
                     {nestedU.name}
                  </div>
               </Flex>
            ))}
         </Flex>
      </>
   )
}