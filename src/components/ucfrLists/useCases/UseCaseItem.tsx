import { Flex } from "@chakra-ui/react"
import { IUseCase } from "../../../UcfrsContext"

// export interface IUseCase {
//    id: string
//    tagIds: string[]
//    name: string
//    completed: boolean
//    neededFrsToWorkIds: string[]
//    usecasesPipelineIds: string[]
// }

export default function UseCaseItem(
{usecase}: {
   usecase: IUseCase
}) {
   return (
      <Flex
      backgroundColor='blue'
      marginTop={'.5rem'}>{usecase.name}</Flex>
   )
}


