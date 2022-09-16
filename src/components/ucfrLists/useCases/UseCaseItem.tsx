import { EditIcon } from "@chakra-ui/icons"
import { Flex, Grid, useDisclosure } from "@chakra-ui/react"
import { GenerateAlertComponent, useAlertStackComponentContext, useUpdateAlertStackComponentContext } from "../../../AlertStackContext"
import { customTheme } from "../../../theme"
import { IUseCase, UcfrListsContextInterfaces, useUcfrListsContext, useUpdateUcfrListsContext } from "../../../UcfrsContext"
import UseCaseModal from "./UseCaseModal"
import UseCaseTag from "./UseCaseTag"

export default function UseCaseItem(
{useCase: useCaseReceived}: {
   useCase: IUseCase
}) {
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
      ucfrListsInterfaces.updateUseCaseById({
         useCaseId: useCaseReceived.id,
         name: useCaseReceived.name,
         completed: !useCaseReceived.completed,
      })
      .then(() => {
         updateAlertStackComponentFromContext([
            ...alertStackComponentFromContext,
            {
               component: GenerateAlertComponent({
                  status: "success",
                  text: "Use case updated successfully",
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

      <Flex className={'useCasesListItemContainer'}
         cursor={'pointer'}
         direction={'column'}
      >
         <Grid className={'useCasesListItem'}
         templateColumns={'7fr 1fr'}
         alignItems={'center'}
         width={'100%'}
         marginTop={'.5rem'}
         margin={'0 auto'}
         padding={'.4rem'}
         borderRadius={'.3rem'}
         boxShadow={'0px 0px 5px rgba(0,0,0,0.5)'}
         backgroundColor={useCaseReceived.completed ? customTheme.colors.green[80] : customTheme.colors[60]}
         >

            <Flex className="useCaseContent"
            direction={'column'}
            >
               <Flex className={'useCaseItemId'}
               fontSize={'.6rem'}
               >
                  {useCaseReceived.id}
               </Flex>
               <Grid className={'useCaseInfo'} 
               templateColumns='1fr 10fr 1fr' 
               alignItems={'center'}
               marginTop={'.4rem'}
               >
                  <input width={'10%'}type='checkbox' checked={useCaseReceived.completed} onChange={completedToggleHandler} />
                  <Flex maxWidth={'90%'} fontSize={'1.2rem'}>{useCaseReceived.name}</Flex>
               </Grid>
            </Flex>

            <Flex className="actions"
            direction={'column'}
            alignItems={'center'}
            justifyContent={'center'}
            >
               <EditIcon className="editUseCase"
               width={'60%'}
               height={'60%'}
               cursor={'pointer'}
               onClick={onOpen}/>

               <UseCaseModal isOpen={isOpen} onClose={onClose} useCase={useCaseReceived} />
            </Flex>
         </Grid>
         <Flex className={'useCaseTags'}
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
            {useCaseReceived.tagIds.map(tagId => (
               <UseCaseTag
               key={tagId}
               tagId={tagId}
               />
            ))}
         </Flex>
      </Flex>
   )
}