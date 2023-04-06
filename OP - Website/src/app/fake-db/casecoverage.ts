export class CasecoveragesFakeDb
{   
    public static casecoverage = [
        {
            'id'      : '5725a680b3249760ea21de52',
            'name'    : 'Knee injury',
            'lastName': 'Keitch',
            'avatar'  : 'assets/images/avatars/trauma-collage.jpg',
            'nickname': 'Royalguard',
            'company' : 'Mayo Clinic',
            'jobTitle': 'Digital Archivist',
            'email'   : 'abbott@withinpixels.com',
            'phone'   : '+1-202-555-0175',
            'address' : '933 8th Street Stamford, CT 06902',
            'birthday': '',
           
            'categoryid'    : '1',
            'categoryname'    : 'Trauma & Deformity',
            'productname'    : 'Product 1',
            'nos': '2',
            'createdby': 'Chris Toner',
            'createdon': '9/13/2020 16:05:07',
            'preferences'   : 'Trauma & Deformity,Category 1,Product 1 ',
            'notes'   : 'Product 1 Notes ',
            'Disease': 'Abbott',
            'Hospital': 'Abbott',
            'Suregeon': 'Abbott'        
        },
        {
            'id'      : '5725a680606588342058356d',
            'name'    : 'Leg Fracture',
            'lastName': 'Matlock',
            'avatar'  : 'assets/images/avatars/trauma-collage.jpg',
            'nickname': 'Wanderer',
            'company' : 'Massachusetts General Hospital',
            'jobTitle': 'Graphic Artist',
            'email'   : 'arnold@withinpixels.com',
            'phone'   : '+1-202-555-0141',
            'address' : '906 Valley Road Michigan City, IN 46360',
            'birthday': '',
           
            'categoryid'    : '1',
            'categoryname'    : 'Trauma & Deformity',
            'productname'    : 'Product 2',
            'nos': '2',
            'createdby': 'John',
            'createdon': '9/3/2020 09:02:07',
            'preferences'   : 'Trauma & Deformity,Category 1,Product 1 ',
            'notes'   : 'Product 2 ',
            'Disease': 'Abbott',
            'Hospital': 'Abbott',
            'Suregeon': 'Abbott'            
        },       
         {
            'id'      : '5725a6809413bf8a0a5272b1',
            'name'    : 'Head Injury',
            'lastName': 'Smethley',
            'avatar'  : 'assets/images/avatars/trauma-collage.jpg',
            'nickname': 'Strifedream',
            'company' : 'Cleveland Clinic',
            'jobTitle': 'Publications Editor',
            'email'   : 'velezquez@withinpixels.com',
            'phone'   : '+1-202-555-0146',
            'address' : '261 Cleveland Street Riverside, NJ 08075',
            'birthday': '',
            'preferences'   : 'Trauma & Deformity,Category 1,Product 1 ',
            'notes'   : 'Product 3' ,
            'categoryid'    : '1',
            'categoryname'    : 'Trauma & Deformity',
            'productname'    : 'Product 3',
            'nos': '2',
            'createdby': 'Abbott',
            'createdon': '2/3/2020 12:05:07',
            'Disease': 'Abbott',
            'Hospital': 'Abbott',
            'Suregeon': 'Abbott'            
        }
        ,
        {
            'id'      : '5725a6809413bf8a0a5272b1',
            'name'    : 'Left Hand Fracture',
            'lastName': 'Smethley',
            'avatar'  : 'assets/images/avatars/trauma-collage.jpg',
            'nickname': 'Strifedream',
            'company' : 'Johns Hopkins Hospital',
            'jobTitle': 'Publications Editor',
            'email'   : 'velezquez@withinpixels.com',
            'phone'   : '+1-202-555-0146',
            'address' : '261 Cleveland Street Riverside, NJ 08075',
            'birthday': '',
            'preferences'   : 'Trauma & Deformity,Category 1,Product 1 ',
            'notes'   : 'Deformity,Category 1,Product 1 ',
            'categoryid'    : '1',
            'categoryname'    : 'Trauma & Deformity',
            'productname'    : 'Product 3',
            'nos': '2',
            'createdby': 'Haley	Adams',
            'createdon': '2/3/2020 05:05:07',
           
            'disease': 'Abbott',
            'hospital': 'Abbott',
            'suregeon': 'Abbott'           
        }
    ];

    public static productsgrid = [
        {
            'id'      : '5725a680b3249760ea21de52',
            'categoryname'    : 'Category 1',
            'productname'    : 'Product 1',
            'nos': '2',
            'createdby': 'Abbott',
            'createdon': 'Jan 10 2020'            
        },
        {
            'id'      : '5725a680b3249120ea21de52',
            'categoryname'    : 'Category 2',
            'productname'    : 'Product 2',
            'nos': '2',
            'createdby': 'Royalguard',
            'createdon': 'Jan 10 2020'            
        },
        {
            'id'      : '5725a680b32489760ea21de52',
            'categoryname'    : 'Category 2',
            'productname'    : 'Product 3',
            'nos': '2',
            'createdby': 'Abbott',
            'createdon': 'Jan 10 2020'            
        },
        {
            'id'      : '5725a680b3249760e671de52',
            'categoryname'    : 'Category 2',
            'productname'    : 'Product 4',
            'nos': '2',
            'createdby': 'Royalguard',
            'createdon': 'Jan 10 2020'            
        }
    ];

    public static categorylist = [
        {
            'id'      : '1',
            'desc'    : 'Trauma & Deformity',         
        },
        {
            'id'      : '2',
            'desc'    : 'Scoliosis',     
        },
        {
            'id'      : '3',
            'desc'    : 'Sports Medicine',        
        },
        {
            'id'      : '4',
            'desc'    : 'Clinical Education',        
        }
    ];

    public static representativelist = [
        {
            'id'      : '-1',
            'desc'    : 'All',         
        },
        {
            'id'      : '1',
            'desc'    : 'Sam',         
        },
        {
            'id'      : '2',
            'desc'    : 'Shenoy',     
        },
        {
            'id'      : '3',
            'desc'    : 'John',        
        },
        {
            'id'      : '4',
            'desc'    : 'Franklin',        
        }
    ];
    public static hospitallist = [
        {
            'id'      : '-1',
            'desc'    : 'All',         
        },
        {
            'id'      : '1',
            'desc'    : 'Apollo',         
        },
        {
            'id'      : '2',
            'desc'    : 'AIMS',     
        },
        {
            'id'      : '3',
            'desc'    : '24 hrs',        
        },
        {
            'id'      : '4',
            'desc'    : 'Franklin orthopediatric',        
        }
    ];
    public static surgeonlist = [
        {
            'id'      : '-1',
            'desc'    : 'All',         
        },
        {
            'id'      : '1',
            'desc'    : 'andrew',         
        },
        {
            'id'      : '2',
            'desc'    : 'william',     
        },
        {
            'id'      : '3',
            'desc'    : 'John',        
        },
        {
            'id'      : '3',
            'desc'    : 'Franklin',        
        }
    ];


    public static user = [
        {
            'id'              : '5725a6802d10e277a0f35724',
            'name'            : 'John Doe',
            'avatar'          : 'assets/images/avatars/profile.jpg',
            'starred'         : [
                '5725a680ae1ae9a3c960d487',
                '5725a6801146cce777df2a08',
                '5725a680bbcec3cc32a8488a',
                '5725a680bc670af746c435e2',
                '5725a68009e20d0a9e9acf2a'
            ],
            'frequentContacts': [
                '5725a6809fdd915739187ed5',
                '5725a68031fdbb1db2c1af47',
                '5725a680606588342058356d',
                '5725a680e7eb988a58ddf303',
                '5725a6806acf030f9341e925',
                '5725a68034cb3968e1f79eac',
                '5725a6801146cce777df2a08',
                '5725a680653c265f5c79b5a9'
            ],
            'groups'          : [
                {
                    'id'        : '5725a6802d10e277a0f35739',
                    'name'      : 'Friends',
                    'contactIds': [
                        '5725a680bbcec3cc32a8488a',
                        '5725a680e87cb319bd9bd673',
                        '5725a6802d10e277a0f35775'
                    ]
                },
                {
                    'id'        : '5725a6802d10e277a0f35749',
                    'name'      : 'Clients',
                    'contactIds': [
                        '5725a680cd7efa56a45aea5d',
                        '5725a68018c663044be49cbf',
                        '5725a6809413bf8a0a5272b1',
                        '5725a6803d87f1b77e17b62b'
                    ]
                },
                {
                    'id'        : '5725a6802d10e277a0f35329',
                    'name'      : 'Recent Workers',
                    'contactIds': [
                        '5725a680bbcec3cc32a8488a',
                        '5725a680653c265f5c79b5a9',
                        '5725a6808a178bfd034d6ecf',
                        '5725a6801146cce777df2a08'
                    ]
                }
            ]
        }
    ];
}
