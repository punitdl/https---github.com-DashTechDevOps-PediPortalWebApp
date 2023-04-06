import { addDays, addHours, endOfDay, endOfMonth, startOfDay, subDays } from 'date-fns';

export class CalendarFakeDb
{

    public static data = [
        {
            id  : 'events',
            data: [
                {
                    start    : subDays(startOfDay(new Date()), 1),
                    end      : addDays(new Date(), 1),
                    title    : '2020 POSNA Annual Meeting',
                    allDay   : true,
                    color    : {
                        primary  : '#F44336',
                        secondary: '#FFCDD2'
                    },
                    // resizable: {
                    //     beforeStart: true,
                    //     afterEnd   : true
                    // },
                    draggable: true,
                    meta     : {
                        location: 'Los Angeles',
                        notes   : 'Eos eu verear adipiscing, ex ornatus denique iracundia sed, quodsi oportere appellantur an pri.',
                        address : 'My address',
                        city : 'My City',
                        state : 'St.Louis',
                        zipcode : '12344',
                        eventImage: '',
                        eventOfficialWebSite: 'https://www.orthopediatrics.com',
                        registrationLink: 'Https://Events.Eply.com/Cpot2020'
                    }
                },
                {
                    start    : startOfDay(new Date()),
                    end      : endOfDay(new Date()),
                    title    : 'CA PO Trauma Meeting',
                    allDay   : false,
                    color    : {
                        primary  : '#FF9800',
                        secondary: '#FFE0B2'
                    },
                    // resizable: {
                    //     beforeStart: true,
                    //     afterEnd   : true
                    // },
                    draggable: true,
                    meta     : {
                        location: 'Los Angeles',
                        notes   : 'This course is designed for community Orthopaedic surgeons who treat fractures.',
                        address : 'My address',
                        city : 'My City',
                        state : 'St.Louis',
                        zipcode : '12344',
                        eventImage: '',
                        eventOfficialWebSite: 'www.abcd.com',
                        registrationLink: 'Link Address'
                    }
                },
                {
                    start    : subDays(endOfMonth(new Date()), 3),
                    end      : addDays(endOfMonth(new Date()), 3),
                    title    : '2020 POSNA Annual Meeting',
                    allDay   : false,
                    color    : {
                        primary  : '#1E90FF',
                        secondary: '#D1E8FF'
                    },
                    // resizable: {
                    //     beforeStart: true,
                    //     afterEnd   : true
                    // },
                    draggable: true,
                    meta     : {
                        location: 'Los Angeles',
                        notes   : 'This course is designed for community Orthopaedic surgeons who treat fractures.',
                        address : 'My address',
			city : 'My City',
			state : 'St.Louis',
			zipcode : '12344',
			eventImage: '',
			eventOfficialWebSite: 'https://www.orthopediatrics.com',
			registrationLink: 'Https://Events.Eply.com/Cpot2020'
                    }
                },
                {
                    start    : addHours(startOfDay(new Date()), 2),
                    end      : new Date(),
                    title    : 'Scoliosis Meeting',
                    allDay   : false,
                    color    : {
                        primary  : '#673AB7',
                        secondary: '#D1C4E9'
                    },
                    // resizable: {
                    //     beforeStart: true,
                    //     afterEnd   : true
                    // },
                    draggable: true,
                    meta     : {
                        location: 'Los Angeles',
                        notes   : 'This course is designed for community Orthopaedic surgeons who treat fractures.',
                        address : 'My address',
                        city : 'My City',
                        state : 'St.Louis',
                        zipcode : '12344',
                        eventImage: '',
                        eventOfficialWebSite: 'https://www.orthopediatrics.com',
                        registrationLink: 'Https://Events.Eply.com/Cpot2020'
                    }
                }
            ]
        }
    ];
}
