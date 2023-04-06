import { FuseUtils } from '@fuse/utils';
import { MatChipInputEvent } from '@angular/material/chips';

export class Role
{
    RoleID: string;
    RoleName: string;
    Freeze: string;
    keywords: string[];
    Modules:string[];
    
    SelectedModule: String[];
    RoleDescription:string;
    DesktopAccess:boolean;

    /**
     * Constructor
     *
     * @param role
     */
    constructor(role)
    {
        {
            //this.RoleID = role.RoleID || FuseUtils.generateGUID();
            this.RoleID = role.RoleID || '';
            this.RoleName = role.RoleName || '';
            this.Freeze = role.Freeze || '';           
            this.keywords = role.keywords|| [];
            this.Modules = role.Modules|| [];
            this.RoleDescription=role.RoleDescription||'';

            this.DesktopAccess=role.DesktopAccess||false;
        }
    }


    addKeywordtree(inputs: string, values:string): void
    {
        const input = inputs;
        const value = values;

        console.log(this.keywords);
        // Add category
        if ( value )
        {
            this.keywords.push(value);
        }
    }

     /**
     * Add category
     *
     * @param {MatChipInputEvent} event
     */
    addKeyword(event: MatChipInputEvent): void
    {
        const input = event.input;
        const value = event.value;

        // Add category
        if ( value )
        {
            this.keywords.push(value);
        }

        // Reset the input value
        if ( input )
        {
            input.value = '';
        }
    }

    /**
     * Remove category
     *
     * @param keyword
     */
    removeKeyword(keyword): void
    {
        const index = this.keywords.indexOf(keyword);

        if ( index >= 0 )
        {
            this.keywords.splice(index, 1);
        }
    }

}
