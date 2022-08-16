import { Flex } from "@chakra-ui/react"
import { IUseCase } from "../../../UcfrsContext"


export default function UseCaseItem(
{usecase}: {
   usecase: IUseCase
}) {
   return (
      <Flex>{usecase.name}</Flex>
   )
}


