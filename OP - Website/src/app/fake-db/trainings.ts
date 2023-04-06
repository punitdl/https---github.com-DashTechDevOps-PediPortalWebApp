export class TrainingsFakeDb
{

    


    
    public static trainings = [
        {
            'id'      : '5725a680b3249760ea21de52',
            'name'    : 'Training Doc1',
            'lastName': 'Keitch',
            'avatar'  : 'https://www.orthopediatrics.com/op_site/products/spine',
            'nickname': 'Royalguard',
            'company' : 'Saois',
            'jobTitle': 'Digital Archivist',
            'email'   : 'abbott@withinpixels.com',
            'phone'   : '+1-202-555-0175',
            'address' : '933 8th Street Stamford, CT 06902',
            'birthday': '',
            'notes'   : '',
            'categoryid'    : '1',
            'categoryname'    : 'Doc Matter',
            'productname'    : 'Product 1',
            'nos': '2',
            'createdby': 'Abbott',
            'createdon': 'Jan 10 2020',
            'keywords'      : [
                'keyword1',
                'keyword2',
            ]           
        },
        {
            'id'      : '5725a680606588342058356d',
            'name'    : 'Training Doc2',
            'lastName': 'Matlock',
            'avatar'  : 'https://www.orthopediatrics.com/op_site/products/trauma',
            'nickname': 'Wanderer',
            'company' : 'Laotcone',
            'jobTitle': 'Graphic Artist',
            'email'   : 'arnold@withinpixels.com',
            'phone'   : '+1-202-555-0141',
            'address' : '906 Valley Road Michigan City, IN 46360',
            'birthday': '',
            'notes'   : '',
            'categoryid'    : '1',
            'categoryname'    : 'Doc Matter',
            'productname'    : 'Product 2',
            'nos': '2',
            'createdby': 'Abbott 2',
            'createdon': 'Jan 10 2020',
            'keywords'      : [
                'keyword1',
                'keyword2'
            ]             
        },       
         {
            'id'      : '5725a6809413bf8a0a5272b1',
            'name'    : 'Training Doc3',
            'lastName': 'Smethley',
            'avatar'  : 'https://www.orthopediatrics.com/op_site/products/sports',
            'nickname': 'Strifedream',
            'company' : 'ranex',
            'jobTitle': 'Publications Editor',
            'email'   : 'velezquez@withinpixels.com',
            'phone'   : '+1-202-555-0146',
            'address' : '261 Cleveland Street Riverside, NJ 08075',
            'birthday': '',
            'notes'   : '',
            'categoryid'    : '2',
            'categoryname'    : 'LITMOS',
            'productname'    : 'Product 3',
            'nos': '2',
            'createdby': 'Abbott',
            'createdon': 'Jan 10 2020'  ,
            'keywords'      : [
                'keyword1',
                'keyword2'
            ]             
        }
        ,
        {
            'id'      : '5725a6809413bf8a0a5272b1',
            'name'    : 'Training Doc4',
            'lastName': 'Smethley',
            'avatar'  : 'https://www.orthopediatrics.com/op_site/clinical-education',
            'nickname': 'Strifedream',
            'company' : 'ranex',
            'jobTitle': 'Publications Editor',
            'email'   : 'velezquez@withinpixels.com',
            'phone'   : '+1-202-555-0146',
            'address' : '261 Cleveland Street Riverside, NJ 08075',
            'birthday': '',
            'notes'   : '',
            'categoryid'    : '2',
            'categoryname'    : 'LITMOS',
            'productname'    : 'Product 3',
            'nos': '2',
            'createdby': 'Abbott',
            'createdon': 'Jan 10 2020',
            'keywords'      : [
                'keyword1',
                'keyword2'
            ]             
            
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
            'desc'    : 'Pediatric Orthopaedics',         
        },
        {
            'id'      : '2',
            'desc'    : 'Pediatric',     
        },
        {
            'id'      : '3',
            'desc'    :  'Orthopaedics',        
        }
    ];

    public static sourcelist = [
        {
            'id'      : '1',
            'desc'    : 'Doc Matter',         
        },
        {
            'id'      : '2',
            'desc'    : 'LITMOS',     
        },
        {
            'id'      : '3',
            'desc'    :  'OP',        
        },
        {
            'id'      : '3',
            'desc'    :  'Master Control'      
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
