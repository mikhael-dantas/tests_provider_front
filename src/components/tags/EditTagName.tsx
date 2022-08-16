import { Flex, Grid } from "@chakra-ui/react";
import React from "react";
import { useUcfrListsContext, useUpdateUcfrListsContext } from "../../UcfrsContext";

export default function EditTagName() {
   const ucfrListsFromContext = useUcfrListsContext()
   const updateUcfrListsFromContext = useUpdateUcfrListsContext()

   const [tagEditNameInput, setTagEditNameInput] = React.useState<string>("")
   const [tagEditNameSelect, setTagEditNameSelect] = React.useState<string>("")
   const [tagEditDescriptionInput, setTagEditDescriptionInput] = React.useState<string>("")

   const tagEditNameSelectHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedTag = ucfrListsFromContext
      .tags.find(m => m.id === e.target.value)
      if (!selectedTag) {
         return
      }
      setTagEditNameSelect(selectedTag.name)
   }
   const tagEditNameInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
      setTagEditNameInput(e.target.value)
   }
   const tagEditDescriptionInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
      setTagEditDescriptionInput(e.target.value)
   }
   const tagEditNameHandler = () => {
      const TagToEdit = ucfrListsFromContext.tags.find(m => m.name === tagEditNameSelect)
      if (!TagToEdit) {
         console.log("TagToEdit not found")
         return
      }

      const newTag = {
         ...TagToEdit,
         name: tagEditNameInput,
         description: tagEditDescriptionInput
      }

      updateUcfrListsFromContext({
         ...ucfrListsFromContext,
         tags: ucfrListsFromContext.tags.map(m => {
            if (m.id === newTag.id) {
               return newTag
            }
            return m
         })
      })
   }
   return (
      <Grid templateRows={'1fr 1fr'}>
         <Flex>
            <select onChange={tagEditNameSelectHandler}>
               {ucfrListsFromContext.tags.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
               ))}
            </select>
         </Flex>
         <Flex direction={'column'}>
            <input value={tagEditNameInput} onChange={tagEditNameInputHandler} />
            <input value={tagEditDescriptionInput} onChange={tagEditDescriptionInputHandler} />
            <button onClick={tagEditNameHandler}>Edit</button>
         </Flex>
      </Grid>
   )
}