import { IAlertStackComponentArrayItem, GenerateAlertComponent, useUpdateAlertStackComponentContext, useAlertStackComponentContext } from "@myContexts/AlertStackContext"
import { IFunctionalRequirement, INestedUseCase, IUcfrLists, IUseCase, useUcfrListsContext, useUpdateUcfrListsContext } from "@myContexts/UcfrsContext"
import { TFilters, UcfrListsContextInterfaces } from "src/lib/featuresInterfaces/UcfrListsContextInterfaces"

// @applyDecoratorToMethods({
//     decorator: handleAlertsInPromises,
//     blackList: [
//         'alert',
//     ]
// })
// @applyDecoratorToMethods({
//     decorator: test,
//     blackList: [
//         'alert',
//     ]
// })
export class ManageComponentUcfrActions {
    // context
    ucfrListsInterfaces: UcfrListsContextInterfaces
    ucfrListsFromContext: IUcfrLists
    private updateUcfrListsFromContext: React.Dispatch<React.SetStateAction<IUcfrLists>>
    private alertStackComponentFromContext: IAlertStackComponentArrayItem[]
    private updateAlertStackComponentFromContext: React.Dispatch<React.SetStateAction<IAlertStackComponentArrayItem[]>>

    // properties
    private alerts: {
        success: boolean,
        error: boolean,
    } = { success: true, error: true }

    constructor() {
        this.ucfrListsFromContext = useUcfrListsContext()
        this.updateUcfrListsFromContext = useUpdateUcfrListsContext()
        this.alertStackComponentFromContext = useAlertStackComponentContext()
        this.updateAlertStackComponentFromContext = useUpdateAlertStackComponentContext()
        this.ucfrListsInterfaces = new UcfrListsContextInterfaces(
            this.ucfrListsFromContext,
            this.updateUcfrListsFromContext
        )
    }


    alert(status: 'success' | 'error', text: string ) {
        if (status === 'success' && !this.alerts.success) return
        if (status === 'error' && !this.alerts.error) return
        this.updateAlertStackComponentFromContext([
            ...this.alertStackComponentFromContext,
            {
                component: GenerateAlertComponent({ status, text })
            }
        ])
    }


    @handleAlertsInPromises
    async searchSubstringAndFilter(value:string, options: TFilters): Promise<{
        useCases: IUseCase[],
        nestedUseCases: INestedUseCase[],
        functionalRequirements: IFunctionalRequirement[],
    }> {
        return this.ucfrListsInterfaces.searchSubstringAndFilter(value, options)
    }


    @handleAlertsInPromises
    async updateUseCaseByIdHandler({
        id,
        name,
        completed,
    }:{
        id: string,
        name: string,
        completed: boolean,
    }) {
        return this.ucfrListsInterfaces.updateUseCaseById({
            useCaseId: id,
            name,
            completed,
        })
    }

    @handleAlertsInPromises
    async deleteUseCaseHandler({id}: {id: string}) {
        return this.ucfrListsInterfaces.removeUseCaseById({
            useCaseId: id,
        })
    }


    @handleAlertsInPromises
    async removeTagFromUseCaseHandler({ tagId, useCaseId }: { tagId: string, useCaseId: string }) {
        return this.ucfrListsInterfaces.removeTagFromUseCaseById({
            useCaseId,
            tagId,
        })
    }


    @handleAlertsInPromises
    async addTagToUseCaseHandler({ tagId, useCaseId }: { tagId: string, useCaseId: string }) {
        return this.ucfrListsInterfaces.addTagToUseCaseById({
            useCaseId,
            tagId,
        })
    }


    @handleAlertsInPromises
    async removeFRequirementFromUseCaseHandler({ fRequirementId, useCaseId }: { fRequirementId: string, useCaseId: string }) {
        return this.ucfrListsInterfaces.removeFunctionalRequirementFromUseCase({
            useCaseId,
            functionalRequirementId: fRequirementId,
        })
    }


    @handleAlertsInPromises
    async addFRequirementToUseCaseHandler({ fRequirementId, useCaseId }: { fRequirementId: string, useCaseId: string }) {
        return this.ucfrListsInterfaces.addFunctionalRequirementToUseCase({
            useCaseId,
            functionalRequirementId: fRequirementId,
        })
    }


    // nested use cases
    @handleAlertsInPromises
    async updateNestedUseCaseByIdHandler({
        id,
        name,
        completed,
    }:{
        id: string,
        name: string,
        completed: boolean,
    }) {
        return this.ucfrListsInterfaces.updateNestedUseCaseById({
            nestedUseCaseId: id,
            name,
            completed,
        })
    }

    @handleAlertsInPromises
    async addTagToNestedUseCaseHandler({ tagId, nestedUseCaseId }: { tagId: string, nestedUseCaseId: string }) {
        return this.ucfrListsInterfaces.addTagToNestedUseCaseById({
            nestedUseCaseId,
            tagId,
        })
    }


    // functional requirements
    @handleAlertsInPromises
    async updateFunctionalRequirementByIdHandler({
        id,
        name,
        completed,
    }:{
        id: string,
        name: string,
        completed: boolean,
    }) {
        return this.ucfrListsInterfaces.updateFunctionalRequirementById({
            functionalRequirementId: id,
            name,
            completed,
        })
    }

    @handleAlertsInPromises
    async addTagToFunctionalRequirementHandler({ tagId, functionalRequirementId }: { tagId: string, functionalRequirementId: string }) {
        return this.ucfrListsInterfaces.addTagToFunctionalRequirementById({
            functionalRequirementId,
            tagId,
        })
    }


    // generics
    @handleAlertsInPromises
    async removeTagFromItemByIdHandler({
        tagId, itemId, itemType
    } : {
        tagId: string, itemId: string, itemType: 'useCase' | 'nestedUseCase' | 'functionalRequirement'
    }) {
        switch (itemType) {
            case 'useCase':
                return this.ucfrListsInterfaces.removeTagFromUseCaseById({
                    useCaseId: itemId,
                    tagId,
                })
            case 'nestedUseCase':
                return this.ucfrListsInterfaces.removeTagFromNestedUseCaseById({
                    nestedUseCaseId: itemId,
                    tagId,
                })
            case 'functionalRequirement':
                return this.ucfrListsInterfaces.removeTagFromFunctionalRequirementById({
                    functionalRequirementId: itemId,
                    tagId,
                })
        }
    }


    @handleAlertsInPromises
    async removeFRequirementFromItemByIdHandler({
        fRequirementId, itemId, itemType
    } : {
        fRequirementId: string, itemId: string, itemType: 'useCase' | 'nestedUseCase'
    }) {
        switch (itemType) {
            case 'useCase':
                return this.ucfrListsInterfaces.removeFunctionalRequirementFromUseCase({
                    useCaseId: itemId,
                    functionalRequirementId: fRequirementId,
                })
            case 'nestedUseCase':
                return this.ucfrListsInterfaces.removeFunctionalRequirementFromNestedUseCase({
                    nestedUseCaseId: itemId,
                    functionalRequirementId: fRequirementId,
                })
        }
    }


    @handleAlertsInPromises
    async addUseCaseToPipelineHandler({ itemId, pipelineId, itemType }: { itemId: string, pipelineId: string, itemType: 'useCase' | 'nestedUseCase' }) {
        switch (itemType) {
            case 'useCase':
                return this.ucfrListsInterfaces.addUseCaseToUseCasePipeline({
                    useCaseIdToAdd: itemId,
                    useCasePipelineId: pipelineId,
                })
            case 'nestedUseCase':
                return this.ucfrListsInterfaces.addUseCaseToNestedUseCasePipeline({
                    useCaseIdToAdd: itemId,
                    nestedUseCasePipelineId: pipelineId,
                })
        }
    }


    @handleAlertsInPromises
    async removeUseCaseFromPipelineHandler({ itemId, pipelineId, itemType }: { itemId: string, pipelineId: string, itemType: 'useCase' | 'nestedUseCase' }) {
        switch (itemType) {
            case 'useCase':
                return this.ucfrListsInterfaces.removeUseCaseFromUseCasePipeline({
                    useCaseIdToRemove: itemId,
                    useCasePipelineId: pipelineId,
                })
            case 'nestedUseCase':
                return this.ucfrListsInterfaces.removeUseCaseFromNestedUseCasePipeline({
                    useCaseIdToRemove: itemId,
                    nestedUseCasePipelineId: pipelineId,
                })
        }
    }


    @handleAlertsInPromises
    async addFunctionalRequirementToItemHandler({ itemId, fRequirementId, itemType }: { itemId: string, fRequirementId: string, itemType: 'useCase' | 'nestedUseCase' | 'functionalRequirement' }) {
        switch (itemType) {
            case 'useCase':
                return this.ucfrListsInterfaces.addFunctionalRequirementToUseCase({
                    useCaseId: itemId,
                    functionalRequirementId: fRequirementId,
                })
            case 'nestedUseCase':
                return this.ucfrListsInterfaces.addFunctionalRequirementToNestedUseCase({
                    nestedUseCaseId: itemId,
                    functionalRequirementId: fRequirementId,
                })
            case 'functionalRequirement':
                return this.ucfrListsInterfaces.addFunctionalRequirementToFunctionalRequirement({
                    functionalRequirementId: itemId,
                    functionalRequirementReceiverId: fRequirementId,
                })
        }
    }


    @handleAlertsInPromises
    async deleteItemByIdHandler({ itemId, itemType }: { itemId: string, itemType: 'useCase' | 'nestedUseCase' | 'functionalRequirement' }) {
        switch (itemType) {
            case 'useCase':
                return this.ucfrListsInterfaces.removeUseCaseById({useCaseId: itemId})
            case 'nestedUseCase':
                return this.ucfrListsInterfaces.removeNestedUseCaseById({nestedUseCaseId: itemId})
            case 'functionalRequirement':
                return this.ucfrListsInterfaces.removeFunctionalRequirementById({functionalRequirementId: itemId})
        }
    }
}


function handleAlertsInPromises
(target: any, propertyKey: any, descriptor?: any) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
        return originalMethod.apply(this, args)
        .then((result) => {
            this.alert('success', 'Done')
            return result
        })
        .catch((error) => {
            this.alert('error', error.message )
        })
    };

    return descriptor;
}


// function applyDecoratorToMethods({
//     decorator,
//     blackList
// }:{decorator: MethodDecorator, blackList: string[]}) {
//     return function<T extends { new (...args: any[]): {} }>(constructor: T) {
//     const originalMethods = Object.getOwnPropertyNames(constructor.prototype);

//     originalMethods.forEach(methodName => {
//         const originalMethod = constructor.prototype[methodName];
//         if (typeof originalMethod === 'function' && methodName !== 'constructor' && !blackList.includes(methodName)) {
//         const decoratedMethod = decorator(constructor.prototype, methodName, Object.getOwnPropertyDescriptor(constructor.prototype, methodName));
//         Object.defineProperty(constructor.prototype, methodName, decoratedMethod as any);
//         }
//     });

//     return class extends constructor {};
//     };
// }

function test(target: any, propertyKey: any, descriptor?: any) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
        console.log('test')
        return originalMethod.apply(this, args)
    };

    return descriptor;
}