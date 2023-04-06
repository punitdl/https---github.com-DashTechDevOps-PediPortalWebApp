import { FuseUtils } from '@fuse/utils';
import { MatChipInputEvent } from '@angular/material/chips';

export class Disease
{
    id: string;
    name: string;
    lastName: string;
    avatar: string;
    nickname: string;
    company: string;
    jobTitle: string;
    email: string;
    phone: string;
    address: string;
    birthday: string;
    notes: string;
    categoryname: string;
    trainingname: string;
    nos: string;
    createdby: string;
    createdon: string;
    keywords: string[];
    categoryid:string;
    /**
     * Constructor
     *
     * @param disease
     */
    constructor(disease)
    {
        {
            this.id = disease.id || FuseUtils.generateGUID();
            this.name = disease.name || '';
            this.lastName = disease.lastName || '';
            this.avatar = disease.avatar || 'assets/images/avatars/profile.jpg';
            this.nickname = disease.nickname || '';
            this.company = disease.company || '';
            this.jobTitle = disease.jobTitle || '';
            this.email = disease.email || '';
            this.phone = disease.phone || '';
            this.address = disease.address || '';
            this.birthday = disease.birthday || '';
            this.notes = disease.notes || '';
            this.categoryname = disease.categoryname || '';
            this.trainingname = disease.trainingname || '';
            this.nos = disease.nos || '';
            this.createdby = disease.createdby || '';
            this.createdon = disease.createdon || '';
            this.keywords = disease.keywords|| [];
            this.categoryid = disease.categoryid|| [];
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
