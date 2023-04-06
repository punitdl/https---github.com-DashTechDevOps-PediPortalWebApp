import { FuseUtils } from '@fuse/utils';

export class Distributor
{
    DistributorID: string;
    RegionID:string;
    Region:string;
    FirstName: string;
    LastName: string;
    CompanyName: string;
    EMailID: string;
    PhoneNo: string;
    MobileNo: string;
    StateID: string;
    StateDescription: string;
    City:string;
    PhotoURL: string;
    Address:string;
    Zipcode: string;
    StateListIDs: string[];
    

    /**
     * Constructor
     *
     * @param distributor
     */
    constructor(distributor)
    {
        {
            this.DistributorID = distributor.DistributorID || FuseUtils.generateGUID();
            this.RegionID = distributor.RegionID || '';
            this.Region = distributor.Region || '';
            this.FirstName = distributor.FirstName || '';
            this.LastName = distributor.LastName || '';
            this.CompanyName = distributor.CompanyName || '';
            this.EMailID = distributor.EMailID || '';
            this.PhoneNo = distributor.PhoneNo || '';
            this.MobileNo = distributor.MobileNo || '';
            this.StateID = distributor.StateID || '';
            this.StateDescription = distributor.StateDescription || '';
            this.City= distributor.City || '';
            this.PhotoURL = distributor.PhotoURL || 'assets/images/avatars/profile.jpg';
            this.Address=distributor.Address || '';
            this.Zipcode=distributor.Zipcode || '';
            this.StateListIDs= distributor.StateListIDs || [];
        }
    }
}
