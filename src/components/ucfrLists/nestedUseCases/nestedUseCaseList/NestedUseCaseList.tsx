import { useDisclosure, Flex, Grid } from "@chakra-ui/react"
import { useAlertStackComponentContext, useUpdateAlertStackComponentContext } from "@myContexts/AlertStackContext"
import { UcfrListsContextInterfaces } from "@myFeaturesInterfaces/UcfrListsContextInterfaces"
import { useUcfrListsContext, useUpdateUcfrListsContext,  useCurrentModuleContext, IUseCase } from "@myContexts/UcfrsContext"
import { customTheme } from "@myStyles/GlobalStyles"
import React from "react"
import CreateNestedUseCase from "../CreateNestedUseCase"
import SelectUseCaseModal from "../SelectUseCaseModal"
import NestedUseCaseItem from "./nestedUseCaseListItem/NestedUseCaseItem"



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
         ucfrListsInterfaces.dragAndDropNestedUseCase({
            dragNestedUseCaseId: dragItem.id,
            dropNestedUseCaseId: id,
         })
      }
   }


   const [selectedUseCaseToNestFrom, setSelectedUseCaseToNestFrom] = React.useState<IUseCase | null>(null)



   const { isOpen: isOpenSelectUseCaseModal, onOpen: onOpenSelectUseCaseModal, onClose: onCloseSelectUseCaseModal } = useDisclosure()
   return (
      <Flex direction={'column'}>
         <Grid className='useCaseSelectManagement'
         templateColumns="2fr 3fr"
         backgroundColor={customTheme.colors[30]}
         alignItems={'center'}
         marginBottom={'.5rem'}
         >
            <button className='button' onClick={onOpenSelectUseCaseModal}>Select Use Case To Deal With</button>
            <SelectUseCaseModal
               isOpen={isOpenSelectUseCaseModal} onClose={onCloseSelectUseCaseModal} 
               setSelectedUseCaseToNestFrom={setSelectedUseCaseToNestFrom} selectedUseCaseToNestFrom={selectedUseCaseToNestFrom} 
            />


            <Grid className="useCaseSelectedDisplay"
            templateRows={'1fr 3fr'}
            >
               <Flex align={'center'} justify={'center'}>Selected Use Case:</Flex>
               {selectedUseCaseToNestFrom ? 
                  <Flex className='selectedUseCaseName'
                  backgroundColor="lightblue" 
                  height={'95%'} width='95%' 
                  margin={'0 auto'}
                  maxWidth={'95%'}
                  cursor={'pointer'}
                  borderRadius={'.4rem'}
                  alignItems={'center'} justify={'center'}
                  flexWrap={'wrap'} textAlign='center'
                  >
                     {selectedUseCaseToNestFrom.name.length > 50 ?
                     selectedUseCaseToNestFrom.name.slice(0, 50) + '...' :
                     selectedUseCaseToNestFrom.name}
                  </Flex>

                  :

                  <Flex 
                  backgroundColor={'lightcoral'}
                  height={'95%'} width='95%' margin={'0 auto'} 
                  align='center' justify={'center'}>None Selected</Flex>
               }
            </Grid>
         </Grid>

         {selectedUseCaseToNestFrom ? 
            <>
               <Flex className={'nestedUseCaseAddContainer'} direction={'column'}>
                  <CreateNestedUseCase selectedUseCase={selectedUseCaseToNestFrom} />
               </Flex>

               <Flex className={'nestedUseCasesListContainer'}
                  direction={'column'}
                  alignItems={'center'}
                  width={'100%'}
               >
                  {ucfrListsFromContext.modules.find(m => m.id === currentModuleFromContext.id)?.nestedUseCases.map((nestedUseCase) => {
                     if (nestedUseCase.parentUseCaseId === selectedUseCaseToNestFrom.id) {
                        return (
                           <NestedUseCaseItem
                              key={nestedUseCase.id}
                              nestedUseCase={nestedUseCase}
                              dragStart={dragStart}
                              dragEnd={dragEnd}
                              dragOver={dragOver}
                              dragDrop={dragDrop}
                           />
                        )
                     }
                  })}
               </Flex>
            </>

            : 

            null
         }
      </Flex>
   )
}