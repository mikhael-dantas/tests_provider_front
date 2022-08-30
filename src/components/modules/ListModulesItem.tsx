import React from 'react'
import { IModule } from '../../UcfrsContext'

function ListModulesItem({ key, module }: {key: string, module: IModule}) {
    return (
        <div>
            {module.name}
        </div>
    )
}

export default ListModulesItem