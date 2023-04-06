import { FuseUtils } from '@fuse/utils';
import { MatChipInputEvent } from '@angular/material/chips';

export class Training
{
    TrainingMaterialID: string;
    TrainingSourceID: string;
    TrainingSourceName: string;
    TrainingMaterialName: string;
    LinkURL: string;
    CategoryID: string;    
    CategoryKeywords: string[];
    Keywords: 
    {
        Keyword: string
    }[];
    KeywordsNew: String[];
    KeywordsNew1: String[];
    /**
     * Constructor
     *
     * @param training
     */
    constructor(training)
    {
        {
           
            this.TrainingMaterialID = training.TrainingMaterialID || FuseUtils.generateGUID();
            this.TrainingSourceID = training.TrainingSourceID || '';
            this.TrainingSourceName = training.TrainingSourceName || '';
            this.TrainingMaterialName = training.TrainingMaterialName || '';
            this.LinkURL = training.LinkURL || '';
            this.CategoryID = training.CategoryID || '';          
            this.CategoryKeywords = training.CategoryKeywords|| [];
            this.Keywords = training.CategoryKeywords|| [];
            this.KeywordsNew = training.KeywordsNew || [];
            this.KeywordsNew1 = training.KeywordsNew1 || [];
        }
    }


    addKeywordtree(inputs: string, values:string): void
    {
        const input = inputs;
        const value = values;

        console.log(this.CategoryKeywords);
        // Add category
        if ( value )
        {
            this.CategoryKeywords.push(value);
           // this.Keywords.push(value);
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
            this.CategoryKeywords.push(value);
            //this.Keywords.push(value);
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
        const index = this.CategoryKeywords.indexOf(keyword);

        if ( index >= 0 )
        {
            this.CategoryKeywords.splice(index, 1);
            this.Keywords.splice(index, 1);
        }
    }

}
