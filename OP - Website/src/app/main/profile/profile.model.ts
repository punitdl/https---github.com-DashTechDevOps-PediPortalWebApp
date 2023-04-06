import { FuseUtils } from '@fuse/utils';

export class Profile
{
    UserID: string;
    FirstName: string;
    LastName: string;
    EMailID : string;
    MobileNo: string;
  
   
    /**
     * Constructor
     *
     * @param profile
     */
    constructor(profile)
    {
        {

            this.UserID = profile.UserID || '';
            this.FirstName = profile.FirstName || '';
            this.LastName = profile.LastName || '';           
            this.EMailID = profile.EMailID || '';
            this.MobileNo = profile.MobileNo || '';           
           
        }
    }
}
