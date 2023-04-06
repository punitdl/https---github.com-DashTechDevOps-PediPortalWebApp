import { FuseUtils } from '@fuse/utils';

export class Onboardtask
{
    OnBoardingID: string;
    OnBoardingName: string;
    OnBoardingDescription:string;
    OnBoardingTask: string;
   
    /**
     * Constructor
     *
     * @param Onboardtask
     */
    constructor(Onboardtask)
    {
        {

            this.OnBoardingID = Onboardtask.OnBoardingID || null;
            this.OnBoardingName = Onboardtask.OnBoardingName || '';
            this.OnBoardingDescription=Onboardtask.OnBoardingDescription||'';
            this.OnBoardingTask = Onboardtask.OnBoardingTask || '';           
       
        }
    }
}
