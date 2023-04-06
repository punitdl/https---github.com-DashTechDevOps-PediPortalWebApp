import { FuseUtils } from '@fuse/utils';

export class casecoverage
{

    CaseCoverageID: string;
    Date:string;
    RepresentativeID: string;
    RepresentativeName: string;
    DiseaseName: string;
    HospitalName: string;
    SurgeonID: string;
    SurgeonName: string;
    FormattedDate: string;
    FormattedTime: string;
    SurgeonPreference:string;
    Notes:string;
    SystemName:string;
    ProcedureName:string;
    
    /**
     * Constructor
     *
     * @param system
     */
    constructor(casecoverage)
    {
        {
            this.CaseCoverageID = casecoverage.CaseCoverageID || FuseUtils.generateGUID();
            this.Date = casecoverage.Date || '';
            this.RepresentativeID = casecoverage.RepresentativeID || '';
            this.RepresentativeName = casecoverage.RepresentativeName || '';           
            this.DiseaseName = casecoverage.DiseaseName || '';
            this.HospitalName = casecoverage.HospitalName || '';
            this.SurgeonID = casecoverage.SurgeonID || '';
            this.SurgeonName = casecoverage.SurgeonName || '';
            this.FormattedDate = casecoverage.FormattedDate || '';
            this.FormattedTime = casecoverage.FormattedTime || '';
            this.SurgeonPreference = casecoverage.SurgeonPreference || '';
            this.Notes=casecoverage.Notes || '';
            this.SystemName=casecoverage.SystemName || '';
            this.ProcedureName=casecoverage.ProcedureName || '';
          
            
        }
    }
}
