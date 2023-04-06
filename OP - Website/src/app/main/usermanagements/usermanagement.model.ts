import { FuseUtils } from '@fuse/utils';

export class Usermanagement
{
    EditUserID:string;
    RoleID:string;
    FirstName:string;
    LastName:string;
    RoleName:string;
    EMailID:string;
    UserName:string;
    MobileNo:string; 
    CountryID:string;
    StateID:string;   
    Address:string;
    City:string;
    Zipcode:string;
    RequestDate:string;
    ApprovalDate:string;
    RegionID:string;
    RegionName:string;
    CompanyName:string;
    DistributorID:string;    
    Contact:boolean;
    JobTitle:string;
    DepartmentID:string;
    TeamID:string;
    ProfileURL:string;
    TimeZoneID:string;
    StateListIDs: string[];
    /**
     * Constructor
     *
     * @param usermanagement
     */
    constructor(usermanagement)
    {
        {
            this.EditUserID = usermanagement.EditUserID || FuseUtils.generateGUID();
            this.RoleID = usermanagement.RoleID || '';
            this.FirstName = usermanagement.FirstName || '';
           // this.avatar = usermanagement.avatar || 'assets/images/avatars/profile.jpg';
            this.LastName = usermanagement.LastName || '';
            this.RoleName = usermanagement.RoleName || '';
            this.EMailID = usermanagement.EMailID || '';
            this.UserName = usermanagement.UserName || '';
            this.MobileNo = usermanagement.MobileNo || '';
            this.CountryID = usermanagement.CountryID || '';
            this.StateID = usermanagement.StateID || '';
          
            this.Address = usermanagement.Address || '';
            this.City = usermanagement.v || '';
            this.Zipcode = usermanagement.Zipcode || '';
            this.RequestDate = usermanagement.RequestDate ||'';
            this.ApprovalDate= usermanagement.ApprovalDate || '';
            this.RegionID = usermanagement.RegionID || '';
            this.RegionName = usermanagement.RegionName || '';
            this.CompanyName=usermanagement.CompanyName || '';
            this.DistributorID=usermanagement.DistributorID || '';
            this.Contact = usermanagement.Contact||false;
            this.JobTitle=usermanagement.JobTitle || '';
            this.DepartmentID=usermanagement.DepartmentID || '';
            this.TeamID=usermanagement.TeamID || '';
            this.ProfileURL=usermanagement.ProfileURL||'';
            this.TimeZoneID = usermanagement.TimeZoneID || '';
            this.StateListIDs = usermanagement.StateListIDs || [];

        }
    }
}
