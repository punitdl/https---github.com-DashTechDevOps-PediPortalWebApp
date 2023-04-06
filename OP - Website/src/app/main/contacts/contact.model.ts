import { FuseUtils } from '@fuse/utils';

export class Contact
{
    ContactID:string;
    FirstName:string;
    LastName:string;
    JobTitle:string;
    DepartmentID:string;
    DepartmentName:string;
    TeamID:string;
    TeamName:string;
    EMailID:string;
    PhoneNo:string;
    MobileNo:string;
    PhotoURL:string;
   

    

    /**
     * Constructor
     *
     * @param contact
     */
    constructor(contact)
    {
        {
            this.ContactID = contact.ContactID || FuseUtils.generateGUID();
            this.FirstName = contact.FirstName || '';
            this.LastName = contact.LastName || '';            
            this.JobTitle= contact.JobTitle || '';
            this.DepartmentID= contact.DepartmentID || '';
            this.DepartmentName= contact.DepartmentName || '';
            this.TeamID= contact.TeamID || '';
            this.TeamName= contact.TeamName || '';
            this.EMailID= contact.EMailID || '';
            this.PhoneNo= contact.PhoneNo || '';
            this.MobileNo= contact.MobileNo || '';
            this.PhotoURL = contact.PhotoURL || 'assets/images/avatars/profile.jpg';
        }
    }
}
