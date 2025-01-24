import { postEngineItems } from "@/interfaces/general_use_interfaces"


export const orderItems = (items: postEngineItems) => {
    let orderedItemsArray = [];
    let mayorOrderNumber = 0;

    const itemsValues = Object.values(items)
    for (let i = 0; i < itemsValues.length; i++) {
        if (itemsValues[i].order > mayorOrderNumber) {
            mayorOrderNumber = itemsValues[i].order
        }
    }
    for (const item in items) {
        if (items[item].order === mayorOrderNumber) {
            orderedItemsArray.push(items[item]);
        }
    }
    for (let i = mayorOrderNumber-1; i > -1; i--) {
        for (const item in items) {
            if (items[item].order === i) {
                orderedItemsArray.unshift(items[item])
            }
        }
    }
    for (let i = 0; i < orderedItemsArray.length; i ++) {
        orderedItemsArray[i].order = i + 1
    }
    return orderedItemsArray;
}