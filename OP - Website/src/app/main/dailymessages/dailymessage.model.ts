import { FuseUtils } from '@fuse/utils';

export class Dailymessage
{
    MessageID: string;
    FromDate: string;
    ToDate: string;
    Message : string;
    FollowupMessage: string;
    LinkURL: string;
    ImageURL: string;        
    Roles  : string[];
   
    /**
     * Constructor
     *
     * @param dailymessage
     */
    constructor(dailymessage)
    {
        {

            this.MessageID = dailymessage.MessageID || FuseUtils.generateGUID();
            this.FromDate = dailymessage.FromDate || '';
            this.ToDate = dailymessage.ToDate || '';           
            this.Message = dailymessage.Message || '';
            this.FollowupMessage = dailymessage.FollowupMessage || '';           
            this.LinkURL = dailymessage.LinkURL || '';
            this.ImageURL = dailymessage.ImageURL || '';
            this.Roles=dailymessage.Roles || [];

            // this.tags = product.tags || [];
            // this.image = dailymessage.image || '';
            // this.createdby = dailymessage.createdby || '';
            // this.createdon = dailymessage.createdon || '';
        }
    }
}
