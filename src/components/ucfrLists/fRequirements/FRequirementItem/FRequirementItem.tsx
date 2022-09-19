import { EditIcon } from "@chakra-ui/icons"
import { useDisclosure, Flex, Grid } from "@chakra-ui/react"
import TagClickable from "@myComponents/tags/TagClickable"
import { useAlertStackComponentContext, useUpdateAlertStackComponentContext, GenerateAlertComponent } from "@myContexts/AlertStackContext"
import { IFunctionalRequirement, useUcfrListsContext, useUpdateUcfrListsContext } from "@myContexts/UcfrsContext"
import { UcfrListsContextInterfaces } from "@myFeaturesInterfaces/UcfrListsContextInterfaces"
import { customTheme } from "@myStyles/GlobalStyles"
import FRequirementModal from "../fRequirementModal/FRequirementModal"

export default function FRequirementItem(
   {
      FRequirementReceived,
      dragStart,
      dragEnd,
      dragOver,
      dragDrop
   }:
   {
      FRequirementReceived: IFunctionalRequirement,
      dragStart: (e: any, item: any) => void,
      dragEnd: (e: any) => void,
      dragOver: (e: React.DragEvent) => void,
      dragDrop: (e: any, id: string) => void,
   }
) {
   // contextManagement SDK
   const ucfrListsFromContext = useUcfrListsContext()
   const updateUcfrListsFromContext = useUpdateUcfrListsContext()
   const ucfrListsInterfaces = new UcfrListsContextInterfaces(
      ucfrListsFromContext,
      updateUcfrListsFromContext
   )
   const alertStackComponentFromContext = useAlertStackComponentContext()
   const updateAlertStackComponentFromContext = useUpdateAlertStackComponentContext()


   const completedToggleHandler = () => {
      ucfrListsInterfaces.updateFunctionalRequirementById({
         name: FRequirementReceived.name,
         done: !FRequirementReceived.done,
         functionalRequirementId: FRequirementReceived.id,
      })
      .then(() => {
         updateAlertStackComponentFromContext([
            ...alertStackComponentFromContext,
            {
               component: GenerateAlertComponent({
                  status: "success",
                  text: "Functional requirement updated successfully",
               })
            }
         ])
      })
      .catch((error) => {
         updateAlertStackComponentFromContext([
            ...alertStackComponentFromContext,
            {
               component: GenerateAlertComponent({
                  status: "error",
                  text: error.message,
               })
            }
         ])
      })
   }


   const { isOpen, onOpen, onClose } = useDisclosure()
   return (
      <Flex className={'fRequirementsListItemContainer'}
         cursor={'pointer'}
         direction={'column'}
         margin={'0.7rem 0'}
         draggable={true}
         onDragStart={(e) => dragStart(e, FRequirementReceived)}
         onDragEnd={dragEnd}
         onDragOver={dragOver}
         onDrop={(e) => dragDrop(e, FRequirementReceived.id)}
      >
         <Grid className={'fRequirementsListItem'}
         templateColumns={'7fr 1fr'}
         alignItems={'center'}
         width={'100%'}
         marginTop={'.5rem'}
         margin={'0 auto'}
         padding={'.4rem'}
         borderRadius={'.3rem'}
         boxShadow={'0px 0px 5px rgba(0,0,0,0.5)'}
         backgroundColor={customTheme.colors[60]}
         >

            <Flex className="fRequirementContent"
            direction={'column'}
            >
               <Flex className={'fRequirementItemId'}
               fontSize={'.6rem'}
               >
                  {FRequirementReceived.id}
               </Flex>
               <Grid className={'fRequirementInfo'} 
               templateColumns='1fr 10fr 1fr' 
               alignItems={'center'}
               marginTop={'.4rem'}
               >
                  <input width={'10%'}type='checkbox' checked={FRequirementReceived.done} onChange={completedToggleHandler} />
                  <Flex maxWidth={'90%'} fontSize={'1.2rem'}>{FRequirementReceived.name}</Flex>
               </Grid>
            </Flex>

            <Flex className="actions"
            direction={'column'}
            alignItems={'center'}
            justifyContent={'center'}
            >
               <EditIcon className="editFRequirement"
               width={'60%'}
               height={'60%'}
               cursor={'pointer'}
               onClick={onOpen}/>

               <FRequirementModal isOpen={isOpen} onClose={onClose} fRequirementId={FRequirementReceived.id} />
            </Flex>
         </Grid>


         <Flex className={'fRequirementTags'}
         width={'95%'}
         margin={'0 auto'}
         backgroundColor={customTheme.colors[60]}
         flexWrap={'wrap'}
         justifyContent={'space-around'}
         fontSize={'.8rem'}
         borderRadius={'0 0 .5rem .5rem'}
         borderTop={'1px solid '+customTheme.colors[30]}
         padding={'.3rem'}
         >
            {FRequirementReceived.tagIds.map(tagId => (
               <TagClickable
               key={tagId}
               tagId={tagId}
               />
            ))}
         </Flex>
      </Flex>
   )
}