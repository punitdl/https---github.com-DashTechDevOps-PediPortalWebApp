import { MatChipInputEvent } from '@angular/material/chips';

import { FuseUtils } from '@fuse/utils';

export class System
{
    SystemID: string;
    SystemName: string;
    BrandName: String;
    BrandID: string[];
    handle: string;
    SystemDescription: string;
    categories: string[];
    tags: string[];
    ImageURL:string[];
    documents: {       
        ResourceTypeID: string,
        ResourceURL: string,      
        ResourceTypeName: string,
        Sharable: boolean
    }[];
    Training: {      
        TrainingSourceName: string,
        TrainingSourceID: string,
        TrainingMaterialID: string,
        TrainingMaterialName: string,
        LinkURL:string

    }[];
    images: {
        default: boolean,
        id: string,
        url: string,
        type: string
    }[];
    // priceTaxExcl: number;
    // priceTaxIncl: number;
    // taxRate: number;
    // comparedPrice: number;
    // quantity: number;
    // sku: string;
    // width: string;
    // height: string;
    // depth: string;
    // weight: string;
    // extraShippingFee: number;
    // active: boolean;
    AnatomyID       : string[];
    DiseaseID       :string[];
    ProcedureID    : string[];
    TrainingMaterialID: string[];

    /**
     * Constructor
     *
     * @param system
     */
    constructor(system?)
    {
        system = system || {};
        this.SystemID = system.SystemID || '';
        this.SystemName = system.SystemName || '';
        this.BrandName = system.BrandName || '';
        this.BrandID = system.BrandID || [];
        this.handle = system.handle || FuseUtils.handleize(this.SystemName);
        this.SystemDescription = system.SystemDescription || '';
        this.categories = system.categories || [];
        this.tags = system.tags || [];
        this.ImageURL=system.ImageURL||[];
        this.documents = system.documents || {};
        this.images = system.images || [];
        // this.priceTaxExcl = system.priceTaxExcl || 0;
        // this.priceTaxIncl = system.priceTaxIncl || 0;
        // this.taxRate = system.taxRate || 0;
        // this.comparedPrice = system.comparedPrice || 0;
        // this.quantity = system.quantity || 0;
        // this.sku = system.sku || 0;
        // this.width = system.width || 0;
        // this.height = system.height || 0;
        // this.depth = system.depth || 0;
        // this.weight = system.weight || 0;
        // this.extraShippingFee = system.extraShippingFee || 0;
        // this.active = system.active || true;
        this.AnatomyID = system.AnatomyID || [];
        this.DiseaseID   = system.DiseaseID || [];
        this.ProcedureID = system.ProcedureID || [];
        this.TrainingMaterialID = system.TrainingMaterialID || [];
        this.Training=system.Training||[];

    }

    /**
     * Add category
     *
     * @param {MatChipInputEvent} event
     */
    addCategory(event: MatChipInputEvent): void
    {
        const input = event.input;
        const value = event.value;

        // Add category
        if ( value )
        {
            this.categories.push(value);
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
     * @param category
     */
    removeCategory(category): void
    {
        const index = this.categories.indexOf(category);

        if ( index >= 0 )
        {
            this.categories.splice(index, 1);
        }
    }

    /**
     * Add tag
     *
     * @param {MatChipInputEvent} event
     */
    addTag(event: MatChipInputEvent): void
    {
        const input = event.input;
        const value = event.value;

        // Add tag
        if ( value )
        {
            this.tags.push(value);
        }

        // Reset the input value
        if ( input )
        {
            input.value = '';
        }
    }

    /**
     * Remove tag
     *
     * @param tag
     */
    removeTag(tag): void
    {
        const index = this.tags.indexOf(tag);

        if ( index >= 0 )
        {
            this.tags.splice(index, 1);
        }
    }
}
