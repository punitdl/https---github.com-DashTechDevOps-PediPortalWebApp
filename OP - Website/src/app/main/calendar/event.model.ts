import { CalendarEventAction } from 'angular-calendar';
import { startOfDay, endOfDay } from 'date-fns';

export class CalendarEventModel
{
    start: Date;
    end?: Date;
    eventid:string;
    title: string;
    color: {
        primary: string;
        secondary: string;
    };
    actions?: CalendarEventAction[];
    allDay?: boolean;
    cssClass?: string;
    resizable?: {
        beforeStart?: boolean;
        afterEnd?: boolean;
    };
    draggable?: boolean;
    meta?: {
        location: string,
        notes: string,
        address : string,
        city : string,
        CountryID:string,
        StateID : string,
        zipcode : string,
        eventImage: string,
        eventOfficialWebSite: string,
        registrationLink: string
    };

    /**
     * Constructor
     *
     * @param data
     */
    constructor(data?)
    {
        data = data || {};
        this.start = new Date(data.start) || startOfDay(new Date());
        this.end = new Date(data.end) || endOfDay(new Date());
        this.eventid = data.eventid || '';
        this.title = data.title || '';
        this.color = {
            primary  : data.color && data.color.primary || '#1e90ff',
            secondary: data.color && data.color.secondary || '#D1E8FF'
        };
        this.draggable = data.draggable;
        this.resizable = {
            beforeStart: data.resizable && data.resizable.beforeStart || true,
            afterEnd   : data.resizable && data.resizable.afterEnd || true
        };
        this.actions = data.actions || [];
        this.allDay = data.allDay || false;
        this.cssClass = data.cssClass || '';
        this.meta = {
            location: data.meta && data.meta.location || '',
            notes   : data.meta && data.meta.notes || '',
            address :  data.meta && data.meta.address || '',
            city :  data.meta && data.meta.city || '',
            CountryID :  data.meta && data.meta.CountryID || '',
            StateID :  data.meta && data.meta.StateID || '',
            zipcode :  data.meta && data.meta.zipcode || '',
            eventImage:  data.meta && data.meta.eventImage || '',
            eventOfficialWebSite:  data.meta && data.meta.eventOfficialWebSite || '',
            registrationLink:  data.meta && data.meta.registrationLink || ''
        };
    }
}
