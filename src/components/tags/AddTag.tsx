import { Flex } from "@chakra-ui/react"
import React from "react"
import { ITag, useUcfrListsContext, useUpdateUcfrListsContext } from "../../UcfrsContext"
import { GenerateUUID } from "../../utils/UUIDGenerator"


export default function AddTag() {
   const ucfrListsFromContext = useUcfrListsContext()
   const updateUcfrListsFromContext = useUpdateUcfrListsContext()


   const [TagAddInput, setTagAddInput] = React.useState<string>("")
   const [TagAddDescriptionInput, setTagAddDescriptionInput] = React.useState<string>("")

   const TagAddInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
      setTagAddInput(e.target.value)
   }
   const TagAddDescriptionInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
      setTagAddDescriptionInput(e.target.value)
   }
   const TagAddHandler = () => {
      const alreadyExists = ucfrListsFromContext.tags.find(m => m.name === TagAddInput)
      if (alreadyExists) {
         return
      }

      const newTag: ITag = {
         id: GenerateUUID(),
         name: TagAddInput,
         description: TagAddDescriptionInput,
      }
      updateUcfrListsFromContext({
         ...ucfrListsFromContext,
         tags: [...ucfrListsFromContext.tags, newTag]
      })
      setTagAddInput("")
      setTagAddDescriptionInput("")
   }

   return (
      <Flex direction="column">
         <input className={'input'} type="text" value={TagAddInput} onChange={TagAddInputHandler} />
         <input className={'input'} type="text" value={TagAddDescriptionInput} onChange={TagAddDescriptionInputHandler} />
         <button className={'button'} onClick={TagAddHandler}>Add Item</button>
      </Flex>
   )
}