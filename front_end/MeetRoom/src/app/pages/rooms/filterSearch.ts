import {Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filterSearch',
    pure: false
})
export class filterSearch implements PipeTransform {
    transform(items: any[], searchedItems: any): any {
        if (searchedItems.length <= 0) {
            return (items);
        }
        return (searchedItems);
    }
}