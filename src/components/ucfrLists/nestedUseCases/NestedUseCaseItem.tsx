import { EditIcon } from "@chakra-ui/icons";
import { Flex, Grid, useDisclosure } from "@chakra-ui/react";
import { GenerateAlertComponent, useAlertStackComponentContext, useUpdateAlertStackComponentContext } from "../../../AlertStackContext";
import { customTheme } from "../../../theme";
import { INestedUseCase, UcfrListsContextInterfaces, useUcfrListsContext, useUpdateUcfrListsContext } from "../../../UcfrsContext";
import NestedUseCaseModal from "./NestedUseCaseModal";
import NestedUseCaseTag from "./NestedUseCaseTag";


export default function NestedUseCaseItem(
   {nestedUseCase: nestedUseCaseReceived}:
   {nestedUseCase: INestedUseCase}
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
      ucfrListsInterfaces.updateNestedUseCaseById({
         nestedUseCaseId: nestedUseCaseReceived.id,
         completed: !nestedUseCaseReceived.completed,
         name: nestedUseCaseReceived.name,
      })
      .then(() => {
         updateAlertStackComponentFromContext([
            ...alertStackComponentFromContext,
            {
               component: GenerateAlertComponent({
                  status: "success",
                  text: "nested use case updated"
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
                  text: error.message
               })
            }
         ])
      })
   }

   const { isOpen, onOpen, onClose } = useDisclosure()
   
   return (
      <Flex className={'nestedUseCasesListItemContainer'}
         cursor={'pointer'}
         direction={'column'}
      >
         <Grid className={'nestedUseCasesListItem'}
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

            <Flex className="nestedUseCaseContent"
            direction={'column'}
            >
               <Flex className={'nestedUseCaseItemId'}
               fontSize={'.6rem'}
               >
                  {nestedUseCaseReceived.id}
               </Flex>
               <Grid className={'nestedUseCaseInfo'} 
               templateColumns='1fr 10fr 1fr' 
               alignItems={'center'}
               marginTop={'.4rem'}
               >
                  <input width={'10%'}type='checkbox' checked={nestedUseCaseReceived.completed} onChange={completedToggleHandler} />
                  <Flex maxWidth={'90%'} fontSize={'1.2rem'}>{nestedUseCaseReceived.name}</Flex>
               </Grid>
            </Flex>

            <Flex className="actions"
            direction={'column'}
            alignItems={'center'}
            justifyContent={'center'}
            >
               <EditIcon className="editNestedUseCase"
               width={'60%'}
               height={'60%'}
               cursor={'pointer'}
               onClick={onOpen}/>

               <NestedUseCaseModal isOpen={isOpen} onClose={onClose} nestedUseCaseId={nestedUseCaseReceived.id} />
            </Flex>
         </Grid>


         <Flex className={'nestedUseCaseTags'}
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
            {nestedUseCaseReceived.tagIds.map(tagId => (
               <NestedUseCaseTag
               key={tagId}
               tagId={tagId}
               />
            ))}
         </Flex>
      </Flex>
   )
}