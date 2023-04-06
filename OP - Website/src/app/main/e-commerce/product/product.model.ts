import { MatChipInputEvent } from '@angular/material/chips';

import { FuseUtils } from '@fuse/utils';

export class Product
{
    ProductID: string;
    ProductName: string;
    BrandName: String;
    BrandID: string;
    ImageURL:string;
    SystemID : String;
    systemname : string;
   // handle: string;
    ProductDescription: string;
    categories: string[];
    tags: string[];
    documents: {
        default: boolean,
        id: string,
        url: string,
        type: string,
        name: string,
        share: boolean

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
    DiseaseID       : string[];
    ProcedureID    : string[];
    TrainingMaterialID: string[];
    /**
     * Constructor
     *
     * @param product
     */
    constructor(product?)
    {
        product = product || {};
        this.ProductID = product.ProductID ;
        this.ProductName = product.ProductName || '';
        this.BrandName = product.BrandName || '';
        this.BrandID = product.BrandID || '';
        this.ImageURL=product.ImageURL||'';
        this.systemname = product.systemname || '';
        this.SystemID = product.SystemID || '';
      //  this.handle = product.handle || FuseUtils.handleize(this.ProductName);
        this.ProductDescription = product.ProductDescription || '';
        this.categories = product.categories || [];
        this.tags = product.tags || [];
        this.documents = product.documents || [];
        this.images = product.images || [];
        // this.priceTaxExcl = product.priceTaxExcl || 0;
        // this.priceTaxIncl = product.priceTaxIncl || 0;
        // this.taxRate = product.taxRate || 0;
        // this.comparedPrice = product.comparedPrice || 0;
        // this.quantity = product.quantity || 0;
        // this.sku = product.sku || 0;
        // this.width = product.width || 0;
        // this.height = product.height || 0;
        // this.depth = product.depth || 0;
        // this.weight = product.weight || 0;
        // this.extraShippingFee = product.extraShippingFee || 0;
        // this.active = product.active || true;
        this.AnatomyID = product.AnatomyID || [];
        this.DiseaseID   = product.DiseaseID || [];
        this.ProcedureID = product.ProcedureID ||[];
        this.TrainingMaterialID = product.TrainingMaterialID ||[];

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
