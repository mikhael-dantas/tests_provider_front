import { EditIcon } from "@chakra-ui/icons"
import { Flex, Grid, useDisclosure } from "@chakra-ui/react"
import React from "react"
import { customTheme } from "../../../theme"
import { IUseCase, useUcfrListsContext, useUpdateUcfrListsContext } from "../../../UcfrsContext"
import UseCaseModal from "./UseCaseModal"

export default function UseCaseItem(
{usecase}: {
   usecase: IUseCase
}) {
   const [completed, setCompleted] = React.useState(usecase.completed)

   const ucfrListsFromContext = useUcfrListsContext()
   const updateUcfrListsFromContext = useUpdateUcfrListsContext()

   const completedHandler = () => {
      setCompleted(!completed)
      updateUcfrListsFromContext({
         ...ucfrListsFromContext,
         modules: ucfrListsFromContext.modules.map(module => {
            if (module.id === usecase.moduleId) {
               return {
                  ...module,
                  useCases: module.useCases.map(uc => {
                     if (uc.id === usecase.id) {
                        return {
                           ...uc,
                           completed: !completed,
                        }
                     }
                     return uc
                  })
               }
            }
            return module
         })
      })
   }


   const getTagNameById = (tagId: string) => {
      const tag = ucfrListsFromContext.tags.find(t => t.id === tagId)
      if (!tag) {
         return "tag not found"
      }
      return tag.name
   }
   const getUseCasePipelineNameById = (useCasePipelineId: string) => {
      const allUseCasesFromAllModules = ucfrListsFromContext.modules.reduce((acc, module) => {
         return [...acc, ...module.useCases]
      } ,[])

      const useCasePipeline = allUseCasesFromAllModules.find(uc => uc.id === useCasePipelineId)

      if (!useCasePipeline) {
         return "not found"
      }
      // return only 20 characters if bigger than 20
      return useCasePipeline.name.length > 20 ? useCasePipeline.name.slice(0, 20) + "..." : useCasePipeline.name
   }
   const getNeededFrsToWorkNameById = (neededFrsToWorkId: string) => {
      const allNeededFrsToWorkFromAllModules = ucfrListsFromContext.modules.reduce((acc, module) => {
         return [...acc, ...module.functionalRequirements]
      } ,[])

      const neededFrsToWork = allNeededFrsToWorkFromAllModules.find(nf => nf.id === neededFrsToWorkId)

      if (!neededFrsToWork) {
         return "not found"
      }
      // return only 20 characters if bigger than 20
      return neededFrsToWork.name.length > 20 ? neededFrsToWork.name.slice(0, 20) + "..." : neededFrsToWork.name
   }

   const { isOpen, onOpen, onClose } = useDisclosure()

   return (
      <Grid
      backgroundColor={customTheme.colors[60]}
      marginTop={'.5rem'}
      templateColumns={'7fr 1fr'}
      padding={'.4rem'}
      borderRadius={'.3rem'}
      boxShadow={'0px 0px 5px rgba(0,0,0,0.5)'}
      alignItems={'center'}
      margin={'0 auto'}
      width={'90%'}
      >
         <Flex className="content"
         direction={'column'}
         >
            <Flex className={'useCaseItemId'}
            fontSize={'.6rem'}
            >
               {usecase.id}
            </Flex>
            <Grid className={'useCaseInfo'} 
            templateColumns='1fr 10fr 1fr' 
            alignItems={'center'}
            marginTop={'.4rem'}
            >
               <input width={'10%'}type='checkbox' checked={completed} onChange={completedHandler} />
               <Flex maxWidth={'90%'}>{usecase.name}</Flex>
            </Grid>

            <Flex className={'useCaseItemTagsTitle'}
            marginTop={'1rem'}
            >Tags</Flex>
            <Grid className={'useCaseTags'} templateColumns={'1fr 1fr'}>
               {usecase.tagIds.map(tagId => {
                  return (
                  <Flex key={`${usecase.id} ${tagId}`}className={'tagItem'}
                  backgroundColor={customTheme.colors[45]}
                  borderRadius={'.3rem'}
                  padding={'.2rem'}
                  margin={'.2rem'}
                  alignItems={'center'}
                  justifyContent={'center'}
                  width={'95%'}
                  >
                     <Flex className={'tagName'} key={tagId}>{getTagNameById(tagId)}</Flex>
                  </Flex>
                  )
               })}
            </Grid>

            <Flex>UseCase Pipelines</Flex>
            <Grid className={'useCasePipelines'} templateColumns={'1fr'} 
            >
               {usecase.useCasesPipelineIds.map(useCasePipelineId => {
                  return (
                  <Flex key={usecase.id + useCasePipelineId}
                  backgroundColor={customTheme.colors[45]}
                  borderRadius={'.3rem'}
                  padding={'.2rem'}
                  margin={'.2rem'}
                  alignItems={'center'}
                  justifyContent={'center'}
                  >
                     <Flex className={'useCasePipelineName'} key={useCasePipelineId}>{getUseCasePipelineNameById(useCasePipelineId)}</Flex>
                  </Flex>
                  )
               } )}
            </Grid>

            <Flex>Needed FRs to work</Flex>
            <Grid className={'neededFrsToWork'}templateColumns={'1fr'}>
               {usecase.neededFrsToWorkIds.map(neededFr => {
                  return (
                  <Flex key={`${usecase.id} ${neededFr}`}className={'neededFrItem'}>
                     <Flex className={'neededFrName'} key={neededFr}>{getNeededFrsToWorkNameById(neededFr)}</Flex>
                  </Flex>
                  )
               } )}
            </Grid>
         </Flex>

         <Flex className="actions"
         direction={'column'}
         alignItems={'center'}
         justifyContent={'center'}
         >
            <EditIcon
            width={'60%'}
            height={'60%'}
            onClick={onOpen}/>

            <UseCaseModal isOpen={isOpen} onClose={onClose} useCase={usecase} />
         </Flex>

      </Grid>
   )
}
