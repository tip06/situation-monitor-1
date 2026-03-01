// Generated from https://github.com/delusan/www.submarinecablemap.com
// Generated at: 2026-03-01T15:49:23.113Z

export interface SubmarineCableRoute {
	id: string;
	name: string;
	rfs: string;
	length: string;
	owners: string;
	url: string;
	points: [number, number][]; // [lon, lat]
	landingPointIds: string[];
}

export interface SubmarineLandingPoint {
	id: string;
	name: string;
	lat: number;
	lon: number;
	desc: string;
	cableCount: number;
}

export const SUBMARINE_CABLE_ROUTES: SubmarineCableRoute[] = [
	{
		"id": "1571",
		"name": "ACS Alaska-Oregon Network (AKORN)",
		"rfs": "April 2009",
		"length": "3,000 km",
		"owners": "Alaska Communications Systems Group",
		"url": "http://www.alaskacommunications.com/",
		"points": [
			[
				-149.858376,
				61.217431
			],
			[
				-124.09984,
				43.982131
			],
			[
				-151.544271,
				59.646378
			],
			[
				-151.291698,
				60.689798
			]
		],
		"landingPointIds": [
			"4067",
			"8539",
			"8392",
			"8540"
		]
	},
	{
		"id": "1307",
		"name": "Aden-Djibouti",
		"rfs": "1994",
		"length": "266 km",
		"owners": "Djibouti Telecom,  Tele Yemen,  Tata Communications",
		"url": "n.a.",
		"points": [
			[
				45.033503,
				12.800704
			],
			[
				43.148039,
				11.594657
			]
		],
		"landingPointIds": [
			"5969",
			"4177"
		]
	},
	{
		"id": "1317",
		"name": "Adria-1",
		"rfs": "September 1996",
		"length": "440 km",
		"owners": "T-Hrvatski Telekom,  OTE,  Albania Telecom",
		"url": "n.a.",
		"points": [
			[
				19.91955,
				39.619323
			],
			[
				18.106465,
				42.641868
			],
			[
				19.450041,
				41.316663
			]
		],
		"landingPointIds": [
			"6024",
			"6043",
			"6025"
		]
	},
	{
		"id": "1629",
		"name": "Africa Coast to Europe (ACE)",
		"rfs": "December 2012",
		"length": "17,000 km",
		"owners": "France Telecom,  Portugal Telecom,  Cote d\u2019Ivoire Telecom,  Gambia Telecommunications Company,  Expresso Telecom,  Orange Cameroon,  Sonatel,  Cable Consortium of Liberia,  Companhia Santomense de Telecomunica\u00e7\u00f5es,  International Mauritania Telecom,  Republic of Gabon,  Orange Guinea,  Orange Mali,  Orange Niger,  Republic of Equatorial Guinea,  Sierra Leone Cable Company",
		"url": "http://www.ace-submarinecable.com",
		"points": [
			[
				-4.026252,
				5.323497
			],
			[
				-0.201065,
				5.558302
			],
			[
				-16.581371,
				13.455928
			],
			[
				9.768242,
				1.860054
			],
			[
				18.421981,
				-33.919086
			],
			[
				-13.703835,
				9.51354
			],
			[
				2.439909,
				6.356577
			],
			[
				-17.451925,
				14.686669
			],
			[
				-13.238091,
				8.485379
			],
			[
				9.910389,
				2.932888
			],
			[
				3.423247,
				6.438895
			],
			[
				9.454332,
				0.394308
			],
			[
				-9.150142,
				38.725681
			],
			[
				13.234998,
				-8.812863
			],
			[
				-10.797187,
				6.30016
			],
			[
				12.349888,
				-5.93337
			],
			[
				-15.978298,
				18.083857
			],
			[
				-4.338706,
				47.811283
			],
			[
				6.532877,
				0.8596
			],
			[
				14.528079,
				-22.67828
			],
			[
				-16.522745,
				28.292788
			]
		],
		"landingPointIds": [
			"3316",
			"4181",
			"4348",
			"9434",
			"3921",
			"4208",
			"3315",
			"4180",
			"4212",
			"10095",
			"3280",
			"4221",
			"3146",
			"4190",
			"4178",
			"9426",
			"4192",
			"3119",
			"10094",
			"9845",
			"7713"
		]
	},
	{
		"id": "1606",
		"name": "ALASIA",
		"rfs": "Q1 2014",
		"length": "n.a.",
		"owners": "Cytaglobal,  Syrian Telecommunications Establishment",
		"url": "http://www.cytaglobal.com",
		"points": [
			[
				33.603568,
				34.828466
			],
			[
				35.897807,
				34.89171
			]
		],
		"landingPointIds": [
			"5812",
			"6030"
		]
	},
	{
		"id": "1168",
		"name": "Alaska United East",
		"rfs": "February 1999",
		"length": "3,751 km",
		"owners": "GCI",
		"url": "http://www.alaskaunited.com",
		"points": [
			[
				-134.406848,
				58.29949
			],
			[
				-122.315817,
				47.824032
			],
			[
				-146.353323,
				61.130396
			],
			[
				-148.684704,
				60.772919
			]
		],
		"landingPointIds": [
			"4816",
			"5770",
			"5764",
			"6255"
		]
	},
	{
		"id": "1567",
		"name": "Alaska United South East",
		"rfs": "November 2008",
		"length": "626 km",
		"owners": "GCI",
		"url": "http://www.alaskaunited.com",
		"points": [
			[
				-134.582274,
				57.501816
			],
			[
				-134.741789,
				58.128129
			],
			[
				-134.406848,
				58.29949
			],
			[
				-131.647819,
				55.341895
			],
			[
				-132.970063,
				56.807642
			],
			[
				-135.334372,
				57.052887
			],
			[
				-132.383805,
				56.470744
			]
		],
		"landingPointIds": [
			"8553",
			"8552",
			"4816",
			"8551",
			"8550",
			"8554",
			"8549"
		]
	},
	{
		"id": "1348",
		"name": "Alaska United West",
		"rfs": "June 2004",
		"length": "2,485 km",
		"owners": "GCI",
		"url": "http://www.alaskaunited.com",
		"points": [
			[
				-149.443126,
				60.112173
			],
			[
				-123.923862,
				46.165141
			]
		],
		"landingPointIds": [
			"5755",
			"6191"
		]
	},
	{
		"id": "1529",
		"name": "ALBA-1",
		"rfs": "August 2012",
		"length": "1,860 km",
		"owners": "Transbit,  Telecom Venezuela",
		"url": "n.a.",
		"points": [
			[
				-66.889636,
				10.603137
			],
			[
				-77.103234,
				18.39857
			],
			[
				-75.712376,
				19.963699
			]
		],
		"landingPointIds": [
			"8352",
			"7688",
			"8351"
		]
	},
	{
		"id": "1319",
		"name": "Aletar",
		"rfs": "April 1997",
		"length": "787 km",
		"owners": "Syrian Telecommunications Establishment,  Telecom Egypt,  Liban Telecom",
		"url": "n.a.",
		"points": [
			[
				29.889861,
				31.191856
			],
			[
				35.897807,
				34.89171
			]
		],
		"landingPointIds": [
			"6044",
			"6030"
		]
	},
	{
		"id": "1664",
		"name": "Algeria-Spain",
		"rfs": "n.a.",
		"length": "500 km",
		"owners": "Algerie Telecom",
		"url": "http://www.algerietelecom.dz",
		"points": [
			[
				-0.641964,
				35.70163
			],
			[
				-0.376943,
				39.468342
			]
		],
		"landingPointIds": [
			"8359",
			"3066"
		]
	},
	{
		"id": "1289",
		"name": "Alonso de Ojeda",
		"rfs": "1999",
		"length": "128 km",
		"owners": "n.a.",
		"url": "n.a.",
		"points": [
			[
				-70.02647,
				12.52464
			],
			[
				-68.896618,
				12.095286
			]
		],
		"landingPointIds": [
			"4233",
			"10729"
		]
	},
	{
		"id": "1234",
		"name": "ALPAL-2",
		"rfs": "July 2002",
		"length": "312 km",
		"owners": "Telecom Italia Sparkle,  France Telecom,  Algerie Telecom,  Telefonica",
		"url": "n.a.",
		"points": [
			[
				5.7342,
				36.313387
			],
			[
				2.971005,
				39.354604
			]
		],
		"landingPointIds": [
			"5774",
			"5948"
		]
	},
	{
		"id": "1686",
		"name": "America Movil Submarine Cable System-1 (AMX-1)",
		"rfs": "Q3 2013",
		"length": "16,000 km",
		"owners": "Am\u00e9rica M\u00f3vil",
		"url": "http://www.americamovil.com",
		"points": [
			[
				-74.779783,
				10.940437
			],
			[
				-86.767566,
				21.09566
			],
			[
				-75.505679,
				10.386704
			],
			[
				-38.542979,
				-3.718838
			],
			[
				-81.655723,
				30.331743
			],
			[
				-80.226416,
				25.78864
			],
			[
				-88.597215,
				15.727178
			],
			[
				-70.691232,
				19.799366
			],
			[
				-43.209557,
				-22.903448
			],
			[
				-38.504631,
				-12.969979
			],
			[
				-66.106669,
				18.465829
			]
		],
		"landingPointIds": [
			"4315",
			"3842",
			"5693",
			"3347",
			"3655",
			"3696",
			"5848",
			"5823",
			"3242",
			"3342",
			"4262"
		]
	},
	{
		"id": "1600",
		"name": "American Samoa-Hawaii (ASH)",
		"rfs": "May 2009",
		"length": "4,250 km",
		"owners": "American Samoa Government,  Elandia",
		"url": "n.a.",
		"points": [
			[
				-158.151726,
				21.425732
			],
			[
				-170.695703,
				-14.276512
			]
		],
		"landingPointIds": [
			"5754",
			"9070"
		]
	},
	{
		"id": "1645",
		"name": "Americas-I North",
		"rfs": "September 1994",
		"length": "2,012 km",
		"owners": "n.a.",
		"url": "n.a.",
		"points": [
			[
				-64.937114,
				18.372971
			],
			[
				-80.394263,
				27.638366
			]
		],
		"landingPointIds": [
			"5758",
			"3813"
		]
	},
	{
		"id": "1148",
		"name": "Americas-II",
		"rfs": "August 2000",
		"length": "8,373 km",
		"owners": "Embratel,  AT&T,  Verizon Business,  Sprint,  CANTV,  Tata Communications,  Entel Chile,  Level 3,  Centennial of Puerto Rico,  Corporacion Nacional de Telecommunicaciones,  Telecom Argentina,  France Telecom,  Portugal Telecom",
		"url": "n.a.",
		"points": [
			[
				-66.878292,
				10.606149
			],
			[
				-52.32106,
				4.941325
			],
			[
				-38.542979,
				-3.718838
			],
			[
				-80.160211,
				26.010194
			],
			[
				-61.094259,
				14.615495
			],
			[
				-66.082878,
				18.453381
			],
			[
				-61.516686,
				10.649817
			],
			[
				-64.81941,
				17.771855
			],
			[
				-68.896618,
				12.095286
			]
		],
		"landingPointIds": [
			"5966",
			"5575",
			"3347",
			"3650",
			"5905",
			"5762",
			"4236",
			"5750",
			"4275"
		]
	},
	{
		"id": "1227",
		"name": "Antillas 1",
		"rfs": "June 1997",
		"length": "650 km",
		"owners": "AT&T,  Verizon Business,  Sprint,  Tata Communications",
		"url": "n.a.",
		"points": [
			[
				-66.016873,
				18.441736
			],
			[
				-66.082878,
				18.453381
			],
			[
				-68.438252,
				18.621328
			],
			[
				-69.983304,
				18.49996
			]
		],
		"landingPointIds": [
			"5773",
			"5762",
			"5694",
			"4242"
		]
	},
	{
		"id": "1049",
		"name": "APCN-2",
		"rfs": "December 2001",
		"length": "19,000 km",
		"owners": "SingTel,  Verizon Business,  KDDI,  Chunghwa,  AT&T,  BT,  France Telecom,  Softbank Telecom,  NTT,  Tata Communications,  Telekom Malaysia,  Starhub,  PLDT,  China Unicom,  KT,  SingTel Optus,  REACH,  Telstra,  PCCW,  China Telecom,  LG Uplus,  New World Telecom,  Vodafone",
		"url": "http://www.apcn2na.com",
		"points": [
			[
				121.065017,
				13.765521
			],
			[
				139.95469,
				34.976637
			],
			[
				121.395289,
				31.619905
			],
			[
				103.904706,
				1.309333
			],
			[
				140.750958,
				36.801769
			],
			[
				103.322563,
				3.815086
			],
			[
				113.9484,
				22.27149
			],
			[
				128.999384,
				35.170083
			],
			[
				116.675506,
				23.354563
			],
			[
				121.462649,
				25.1813
			]
		],
		"landingPointIds": [
			"3218",
			"5885",
			"5802",
			"5939",
			"5703",
			"5903",
			"5852",
			"4183",
			"5803",
			"5982"
		]
	},
	{
		"id": "1303",
		"name": "Aphrodite 2",
		"rfs": "September 1994",
		"length": "868 km",
		"owners": "OTE",
		"url": "n.a.",
		"points": [
			[
				24.012217,
				35.511799
			],
			[
				32.466588,
				34.766427
			]
		],
		"landingPointIds": [
			"5723",
			"5811"
		]
	},
	{
		"id": "1213",
		"name": "Apollo",
		"rfs": "February 2003",
		"length": "13,000 km",
		"owners": "Alcatel-Lucent,  Vodafone",
		"url": "http://www.apollo-scs.com",
		"points": [
			[
				-4.544398,
				50.828106
			],
			[
				-3.45992,
				48.730224
			],
			[
				-74.04706,
				40.123365
			],
			[
				-72.872234,
				40.800273
			]
		],
		"landingPointIds": [
			"4554",
			"5837",
			"3686",
			"3783"
		]
	},
	{
		"id": "1743",
		"name": "APX-East",
		"rfs": "Q1 2015",
		"length": "12,500 km",
		"owners": "SubPartners",
		"url": "http://www.subpartners.net",
		"points": [
			[
				174.770419,
				-36.88441
			],
			[
				-118.39953,
				33.862244
			],
			[
				-158.000042,
				21.438883
			],
			[
				151.20704,
				-33.869897
			]
		],
		"landingPointIds": [
			"3319",
			"4966",
			"5769",
			"3030"
		]
	},
	{
		"id": "1744",
		"name": "APX-West",
		"rfs": "Q4 2014",
		"length": "4,600 km",
		"owners": "SubPartners",
		"url": "http://www.subpartners.net",
		"points": [
			[
				106.827868,
				-6.171889
			],
			[
				115.857254,
				-31.953413
			],
			[
				103.853007,
				1.293672
			]
		],
		"landingPointIds": [
			"3012",
			"3239",
			"3029"
		]
	},
	{
		"id": "1078",
		"name": "ARCOS",
		"rfs": "December 2001",
		"length": "8,600 km",
		"owners": "Columbus Networks,  Axtel,  CANTV,  Codetel,  Hondutel,  Belize Telemedia,  Enitel,  AT&T,  Alestra,  Verizon Business,  RACSA,  United Telecommunication Services (UTS),  Telecarrier,  Tricom USA,  Telecomunicaciones Ultramarinas de Puerto Rico,  Internexa,  Orbinet Overseas,  Telepuerto San Isidro,  Bahamas Telecommunications Company",
		"url": "http://www.columbus-networks.com",
		"points": [
			[
				-88.181614,
				17.495491
			],
			[
				-83.771474,
				11.991787
			],
			[
				-86.767566,
				21.09566
			],
			[
				-75.505679,
				10.386704
			],
			[
				-75.525907,
				24.403303
			],
			[
				-79.900009,
				9.353724
			],
			[
				-74.19498,
				22.62967
			],
			[
				-66.016873,
				18.441736
			],
			[
				-79.753544,
				9.437346
			],
			[
				-77.340247,
				25.06706
			],
			[
				-80.162369,
				25.932896
			],
			[
				-72.120237,
				21.851071
			],
			[
				-88.597215,
				15.727178
			],
			[
				-83.393919,
				14.021607
			],
			[
				-87.946056,
				15.844831
			],
			[
				-83.776794,
				15.261283
			],
			[
				-83.037697,
				9.98857
			],
			[
				-70.691232,
				19.799366
			],
			[
				-68.438252,
				18.621328
			],
			[
				-70.204356,
				11.708596
			],
			[
				-72.952744,
				11.482927
			],
			[
				-85.954735,
				15.915102
			],
			[
				-87.463598,
				20.212558
			],
			[
				-68.896618,
				12.095286
			]
		],
		"landingPointIds": [
			"5791",
			"5920",
			"3842",
			"5693",
			"5784",
			"6093",
			"5782",
			"5773",
			"5928",
			"4230",
			"5772",
			"4258",
			"5848",
			"5921",
			"5851",
			"5692",
			"5810",
			"5823",
			"5694",
			"5965",
			"5807",
			"5850",
			"5908",
			"4275"
		]
	},
	{
		"id": "1617",
		"name": "Asia Pacific Gateway (APG)",
		"rfs": "Q3 2014",
		"length": "10,400 km",
		"owners": "NTT,  China Telecom,  China Unicom,  Chunghwa,  KT,  Starhub,  LG Uplus,  China Mobile,  Viettel Corporation,  Vietnam Telecom International,  Global Transit,  Facebook",
		"url": "n.a.",
		"points": [
			[
				121.395289,
				31.619905
			],
			[
				108.214811,
				16.051528
			],
			[
				103.322563,
				3.815086
			],
			[
				139.81696,
				35.037472
			],
			[
				121.191404,
				30.306345
			],
			[
				128.999384,
				35.170083
			],
			[
				136.874423,
				34.336772
			],
			[
				100.596963,
				7.078459
			],
			[
				103.946567,
				1.327202
			],
			[
				121.801454,
				24.863576
			],
			[
				114.258695,
				22.31827
			]
		],
		"landingPointIds": [
			"5802",
			"5986",
			"5903",
			"5887",
			"5804",
			"4183",
			"5883",
			"4265",
			"9135",
			"5981",
			"5857"
		]
	},
	{
		"id": "1679",
		"name": "Asia Submarine-cable Express (ASE)/Cahaya Malaysia",
		"rfs": "August 2012",
		"length": "7,500 km",
		"owners": "NTT,  PLDT,  Telekom Malaysia,  Starhub",
		"url": "n.a.",
		"points": [
			[
				103.987023,
				1.38904
			],
			[
				122.949979,
				14.116573
			],
			[
				139.81696,
				35.037472
			],
			[
				103.849895,
				2.295532
			],
			[
				114.258695,
				22.31827
			]
		],
		"landingPointIds": [
			"5937",
			"10355",
			"5887",
			"5902",
			"5857"
		]
	},
	{
		"id": "1507",
		"name": "Asia-America Gateway (AAG) Cable System",
		"rfs": "November 2009",
		"length": "20,000 km",
		"owners": "Telekom Malaysia,  AT&T,  Starhub,  PLDT,  Communications Authority of Thailand,  airtel (Bharti),  Telstra,  Telkom Indonesia,  BT,  Eastern Telecom,  PT Indonesia Satellite Corp.,  Telecom New Zealand,  Viettel Corporation,  Saigon Postal Corporation,  Vietnam Telecom International,  Brunei International Gateway,  BayanTel (BTI)",
		"url": "http://www.asia-america-gateway.com",
		"points": [
			[
				103.987023,
				1.38904
			],
			[
				120.389715,
				16.582774
			],
			[
				-158.151726,
				21.425732
			],
			[
				113.9484,
				22.27149
			],
			[
				103.849895,
				2.295532
			],
			[
				-120.662699,
				35.285025
			],
			[
				100.930548,
				13.174444
			],
			[
				144.809393,
				13.549087
			],
			[
				114.885811,
				4.926367
			],
			[
				107.079236,
				10.341931
			]
		],
		"landingPointIds": [
			"5937",
			"8536",
			"5754",
			"5852",
			"5902",
			"3772",
			"6014",
			"3251",
			"5970",
			"6013"
		]
	},
	{
		"id": "1143",
		"name": "Atlantic Crossing-1 (AC-1)",
		"rfs": "May 1998",
		"length": "14,301 km",
		"owners": "Level 3",
		"url": "http://www.level3.com",
		"points": [
			[
				4.65695,
				52.486294
			],
			[
				-72.912288,
				40.773169
			],
			[
				8.383407,
				54.898487
			],
			[
				-5.698444,
				50.078518
			]
		],
		"landingPointIds": [
			"3080",
			"4512",
			"3142",
			"3081"
		]
	},
	{
		"id": "1045",
		"name": "Atlantis-2",
		"rfs": "February 2000",
		"length": "8,500 km",
		"owners": "Embratel,  Deutsche Telekom,  Telecom Italia Sparkle,  Telecom Argentina,  Telefonica,  Portugal Telecom,  France Telecom,  Telef\u00f3nica Larga Distancia de Puerto Rico,  AT&T,  Belgacom,  KT,  SingTel,  Sprint,  Tata Communications,  Verizon Business,  TPSA,  BT",
		"url": "n.a.",
		"points": [
			[
				-17.451925,
				14.686669
			],
			[
				-16.538606,
				28.046639
			],
			[
				-38.542979,
				-3.718838
			],
			[
				-56.695512,
				-36.472523
			],
			[
				-9.150142,
				38.725681
			],
			[
				-23.521257,
				14.92308
			]
		],
		"landingPointIds": [
			"4180",
			"5722",
			"3347",
			"3330",
			"3146",
			"4257"
		]
	},
	{
		"id": "1512",
		"name": "Atlas Offshore",
		"rfs": "July 2007",
		"length": "1,634 km",
		"owners": "Maroc Telecom",
		"url": "http://www.maroctelecom.ma",
		"points": [
			[
				-6.035744,
				35.470741
			],
			[
				5.372607,
				43.293177
			]
		],
		"landingPointIds": [
			"5910",
			"3210"
		]
	},
	{
		"id": "1102",
		"name": "Australia-Japan Cable (AJC)",
		"rfs": "December 2001",
		"length": "12,700 km",
		"owners": "Softbank Telecom,  NTT,  Telstra,  Verizon Business,  AT&T",
		"url": "http://www.ajcable.com",
		"points": [
			[
				139.81696,
				35.037472
			],
			[
				151.244986,
				-33.737386
			],
			[
				151.228623,
				-33.882144
			],
			[
				136.874423,
				34.336772
			],
			[
				144.809393,
				13.549087
			],
			[
				144.800459,
				13.51355
			]
		],
		"landingPointIds": [
			"5887",
			"5778",
			"5779",
			"5883",
			"3251",
			"5972"
		]
	},
	{
		"id": "1527",
		"name": "Australia-Papua New Guinea-2 (APNG-2)",
		"rfs": "2006",
		"length": "1,800 km",
		"owners": "Telikom Papua New Guinea,  Telstra",
		"url": "http://www.telikompng.com.pg",
		"points": [
			[
				147.156335,
				-9.480235
			],
			[
				151.20704,
				-33.869897
			]
		],
		"landingPointIds": [
			"8350",
			"3030"
		]
	},
	{
		"id": "1683",
		"name": "Australia-Singapore Cable (ASC)",
		"rfs": "n.a.",
		"length": "4,800 km",
		"owners": "Leighton Holdings",
		"url": "n.a.",
		"points": [
			[
				115.857254,
				-31.953413
			],
			[
				103.946567,
				1.327202
			]
		],
		"landingPointIds": [
			"3239",
			"9135"
		]
	},
	{
		"id": "1718",
		"name": "Australia-Singapore Submarine Cable-1 (ASSC-1)",
		"rfs": "n.a.",
		"length": "4,600 km",
		"owners": "ASSC-1 Communications Group,  Telstra",
		"url": "http://www.assc1.com.au",
		"points": [
			[
				106.827868,
				-6.171889
			],
			[
				115.857254,
				-31.953413
			],
			[
				103.853007,
				1.293672
			]
		],
		"landingPointIds": [
			"3012",
			"3239",
			"3029"
		]
	},
	{
		"id": "1069",
		"name": "Bahamas 2",
		"rfs": "June 1997",
		"length": "470 km",
		"owners": "AT&T,  Telefonica,  Verizon Business",
		"url": "n.a.",
		"points": [
			[
				-78.802882,
				26.539633
			],
			[
				-77.340247,
				25.06706
			],
			[
				-80.394263,
				27.638366
			]
		],
		"landingPointIds": [
			"5783",
			"4230",
			"3813"
		]
	},
	{
		"id": "1510",
		"name": "Bahamas Domestic Submarine Network (BDSNi)",
		"rfs": "2006",
		"length": "2,817 km",
		"owners": "Bahamas Telecommunications Company,  Teleco",
		"url": "http://www.btcbahamas.com",
		"points": [
			[
				-75.525907,
				24.403303
			],
			[
				-74.966201,
				23.098376
			],
			[
				-74.530272,
				24.052552
			],
			[
				-74.19498,
				22.62967
			],
			[
				-75.733457,
				22.18325
			],
			[
				-77.84459,
				24.689807
			],
			[
				-75.788017,
				23.516487
			],
			[
				-76.240661,
				25.196057
			],
			[
				-78.736827,
				26.516846
			],
			[
				-73.683058,
				20.950501
			],
			[
				-73.064123,
				22.401591
			],
			[
				-77.340247,
				25.06706
			],
			[
				-74.840567,
				23.652109
			],
			[
				-72.343146,
				18.542725
			],
			[
				-77.399525,
				26.025151
			]
		],
		"landingPointIds": [
			"5784",
			"10360",
			"10364",
			"5782",
			"10361",
			"10358",
			"10359",
			"10357",
			"5785",
			"9581",
			"10362",
			"4230",
			"10363",
			"3878",
			"5788"
		]
	},
	{
		"id": "1232",
		"name": "Bahamas Internet Cable System (BICS)",
		"rfs": "July 2001",
		"length": "1,100 km",
		"owners": "Caribbean Crossings",
		"url": "http://www.caribbeancrossings.com",
		"points": [
			[
				-80.088937,
				26.350304
			],
			[
				-76.574447,
				24.424987
			],
			[
				-76.574447,
				24.424987
			],
			[
				-76.787668,
				25.407773
			],
			[
				-78.736827,
				26.516846
			],
			[
				-76.574447,
				24.424987
			],
			[
				-77.399525,
				26.025151
			],
			[
				-80.067705,
				26.378011
			]
		],
		"landingPointIds": [
			"3563",
			"5786",
			"8355",
			"5787",
			"5785",
			"8354",
			"5788",
			"8357"
		]
	},
	{
		"id": "1696",
		"name": "BalaLink",
		"rfs": "October 2001",
		"length": "274 km",
		"owners": "n.a.",
		"url": "http://www.islalink.es",
		"points": [
			[
				2.605246,
				39.552366
			],
			[
				-0.376943,
				39.468342
			]
		],
		"landingPointIds": [
			"4723",
			"3066"
		]
	},
	{
		"id": "1668",
		"name": "Balkans-Italy Network (BIN)",
		"rfs": "2013",
		"length": "276 km",
		"owners": "UNIFI Communications",
		"url": "http://bin.al",
		"points": [
			[
				16.866689,
				41.125526
			],
			[
				19.499231,
				41.210654
			]
		],
		"landingPointIds": [
			"3160",
			"10178"
		]
	},
	{
		"id": "1199",
		"name": "Baltica",
		"rfs": "March 1997",
		"length": "437 km",
		"owners": "TeliaSonera,  TPSA,  TDC,  Telenor,  Slovak Telekom,  Ukrtelecom",
		"url": "n.a.",
		"points": [
			[
				11.928966,
				54.576346
			],
			[
				15.574912,
				54.17239
			],
			[
				14.992167,
				55.030897
			],
			[
				13.828283,
				55.43134
			]
		],
		"landingPointIds": [
			"5820",
			"5933",
			"5822",
			"5954"
		]
	},
	{
		"id": "1053",
		"name": "BARSAV",
		"rfs": "1996",
		"length": "760 km",
		"owners": "Telefonica,  Telecom Italia Sparkle",
		"url": "n.a.",
		"points": [
			[
				2.168564,
				41.385327
			],
			[
				8.483793,
				44.305577
			]
		],
		"landingPointIds": [
			"3036",
			"5880"
		]
	},
	{
		"id": "1472",
		"name": "Bass Strait-1",
		"rfs": "1995",
		"length": "241 km",
		"owners": "Telstra",
		"url": "n.a.",
		"points": [
			[
				145.62373,
				-40.950776
			],
			[
				146.119641,
				-38.820168
			]
		],
		"landingPointIds": [
			"7813",
			"10799"
		]
	},
	{
		"id": "1492",
		"name": "Bass Strait-2",
		"rfs": "2003",
		"length": "239 km",
		"owners": "Telstra",
		"url": "n.a.",
		"points": [
			[
				145.729538,
				-38.633448
			],
			[
				145.29406,
				-40.760443
			]
		],
		"landingPointIds": [
			"7860",
			"7861"
		]
	},
	{
		"id": "1742",
		"name": "Basslink",
		"rfs": "November 2005",
		"length": "298 km",
		"owners": "Basslink Telecoms",
		"url": "n.a.",
		"points": [
			[
				146.850055,
				-41.033294
			],
			[
				147.071207,
				-38.443617
			]
		],
		"landingPointIds": [
			"10796",
			"10797"
		]
	},
	{
		"id": "1648",
		"name": "Batam Dumai Melaka Cable System (BDMCS)",
		"rfs": "November 2009",
		"length": "353 km",
		"owners": "Moratelindo,  Telekom Malaysia",
		"url": "http://www.moratelindo.co.id",
		"points": [
			[
				103.962529,
				1.13466
			],
			[
				101.44764,
				1.665304
			],
			[
				102.220919,
				2.273146
			]
		],
		"landingPointIds": [
			"5862",
			"7311",
			"6300"
		]
	},
	{
		"id": "1601",
		"name": "Batam-Rengit Cable System (BRCS)",
		"rfs": "November 2007",
		"length": "63 km",
		"owners": "PT Excelcomindo Pratama",
		"url": "http://www.xl.co.id",
		"points": [
			[
				103.962529,
				1.13466
			],
			[
				103.14769,
				1.67715
			]
		],
		"landingPointIds": [
			"5862",
			"8970"
		]
	},
	{
		"id": "1364",
		"name": "BCF-1",
		"rfs": "January 2005",
		"length": "391 km",
		"owners": "SIA Baltcom Fiber",
		"url": "http://www.bcfiber.lv",
		"points": [
			[
				19.055321,
				57.863008
			],
			[
				18.062897,
				59.332168
			],
			[
				21.570009,
				57.389484
			]
		],
		"landingPointIds": [
			"7412",
			"3063",
			"5897"
		]
	},
	{
		"id": "1611",
		"name": "BCS East",
		"rfs": "1995",
		"length": "97.8 km",
		"owners": "TeliaSonera",
		"url": "n.a.",
		"points": [
			[
				21.011256,
				56.508188
			],
			[
				21.08243,
				56.02834
			]
		],
		"landingPointIds": [
			"5310",
			"5311"
		]
	},
	{
		"id": "1222",
		"name": "BCS East-West Interlink",
		"rfs": "November 1997",
		"length": "218 km",
		"owners": "TeliaSonera",
		"url": "n.a.",
		"points": [
			[
				18.845312,
				57.431044
			],
			[
				21.08243,
				56.02834
			]
		],
		"landingPointIds": [
			"10365",
			"5311"
		]
	},
	{
		"id": "1609",
		"name": "BCS North - Phase 1",
		"rfs": "1998",
		"length": "513 km",
		"owners": "TeliaSonera",
		"url": "n.a.",
		"points": [
			[
				22.968195,
				59.82326
			],
			[
				22.302129,
				60.301
			],
			[
				24.932463,
				60.1711
			],
			[
				19.93782,
				60.11388
			],
			[
				18.764601,
				59.822758
			]
		],
		"landingPointIds": [
			"7694",
			"9104",
			"9103",
			"5830",
			"5952"
		]
	},
	{
		"id": "1610",
		"name": "BCS North - Phase 2",
		"rfs": "2000",
		"length": "280.4 km",
		"owners": "TeliaSonera",
		"url": "n.a.",
		"points": [
			[
				24.932463,
				60.1711
			],
			[
				26.883579,
				60.501071
			],
			[
				28.499906,
				59.79987
			]
		],
		"landingPointIds": [
			"9103",
			"4552",
			"9102"
		]
	},
	{
		"id": "1321",
		"name": "Berytar",
		"rfs": "April 1997",
		"length": "134 km",
		"owners": "Syrian Telecommunications Establishment,  Lebanese Ministry of Telecommunications",
		"url": "n.a.",
		"points": [
			[
				35.485217,
				33.89246
			],
			[
				35.386236,
				33.450157
			],
			[
				35.897807,
				34.89171
			],
			[
				35.859158,
				34.439468
			]
		],
		"landingPointIds": [
			"3862",
			"6047",
			"6030",
			"6046"
		]
	},
	{
		"id": "1356",
		"name": "Bharat Lanka Cable System",
		"rfs": "June 2006",
		"length": "325 km",
		"owners": "Bharat Sanchar Nigam Ltd. (BSNL),  Sri Lanka Telecom",
		"url": "n.a.",
		"points": [
			[
				79.866799,
				6.832712
			],
			[
				78.145167,
				8.802199
			]
		],
		"landingPointIds": [
			"5949",
			"7678"
		]
	},
	{
		"id": "1633",
		"name": "Bicentenario",
		"rfs": "2011",
		"length": "250 km",
		"owners": "Antel Uruguay,  Telecom Argentina",
		"url": "n.a.",
		"points": [
			[
				-56.695512,
				-36.472523
			],
			[
				-54.950189,
				-34.900367
			]
		],
		"landingPointIds": [
			"3330",
			"5963"
		]
	},
	{
		"id": "1271",
		"name": "Botnia",
		"rfs": "1994",
		"length": "93 km",
		"owners": "TeliaSonera",
		"url": "n.a.",
		"points": [
			[
				20.262973,
				63.82588
			],
			[
				21.616387,
				63.095165
			]
		],
		"landingPointIds": [
			"6004",
			"5052"
		]
	},
	{
		"id": "1305",
		"name": "CADMOS",
		"rfs": "September 1995",
		"length": "230 km",
		"owners": "Cytaglobal,  Lebanese Ministry of Telecommunications,  OTE,  AT&T,  BT,  Deutsche Telekom,  France Telecom,  Telekom Austria,  Syrian Telecommunications Establishment,  Telecom Italia Sparkle,  Tata Communications",
		"url": "n.a.",
		"points": [
			[
				35.485217,
				33.89246
			],
			[
				33.603568,
				34.828466
			]
		],
		"landingPointIds": [
			"3862",
			"5812"
		]
	},
	{
		"id": "1293",
		"name": "Canada-United States 1 (CANUS 1)",
		"rfs": "October 1995",
		"length": "1,360 km",
		"owners": "n.a.",
		"url": "n.a.",
		"points": [
			[
				-74.04706,
				40.123365
			],
			[
				-63.645638,
				44.434072
			]
		],
		"landingPointIds": [
			"3686",
			"3734"
		]
	},
	{
		"id": "1666",
		"name": "CanaLink",
		"rfs": "2011",
		"length": "2,000 km",
		"owners": "IslaLink",
		"url": "http://www.canalink.es",
		"points": [
			[
				-6.292734,
				36.52952
			],
			[
				-15.396255,
				27.964623
			],
			[
				-17.765232,
				28.663215
			],
			[
				-16.522745,
				28.292788
			]
		],
		"landingPointIds": [
			"4374",
			"5721",
			"7776",
			"7713"
		]
	},
	{
		"id": "1737",
		"name": "CANTAT-3",
		"rfs": "November 1994",
		"length": "2,500 km",
		"owners": "Faroese Telecom",
		"url": "n.a.",
		"points": [
			[
				8.328997,
				55.751574
			],
			[
				4.228399,
				56.078332
			],
			[
				8.383407,
				54.898487
			],
			[
				-7.147226,
				62.289963
			],
			[
				4.748503,
				55.715635
			],
			[
				4.564293,
				55.804076
			],
			[
				-20.267321,
				63.437685
			]
		],
		"landingPointIds": [
			"5818",
			"10780",
			"3142",
			"5724",
			"10782",
			"10781",
			"5858"
		]
	},
	{
		"id": "1634",
		"name": "Caribbean-Bermuda U.S. (CBUS)",
		"rfs": "October 2009",
		"length": "1,600 km",
		"owners": "Cable & Wireless Communications",
		"url": "http://www.cwbda.com",
		"points": [
			[
				-64.769518,
				32.312172
			],
			[
				-64.597254,
				18.414732
			]
		],
		"landingPointIds": [
			"5793",
			"9589"
		]
	},
	{
		"id": "1563",
		"name": "Caucasus Cable System",
		"rfs": "November 2008",
		"length": "1,200 km",
		"owners": "Caucasus Online",
		"url": "http://www.caucasus.net",
		"points": [
			[
				28.167425,
				43.414344
			],
			[
				41.667635,
				42.150776
			]
		],
		"landingPointIds": [
			"9594",
			"5530"
		]
	},
	{
		"id": "1068",
		"name": "Cayman-Jamaica Fiber System",
		"rfs": "June 1997",
		"length": "870 km",
		"owners": "Cable & Wireless Communications",
		"url": "n.a.",
		"points": [
			[
				-79.877673,
				19.690346
			],
			[
				-81.166789,
				19.282977
			],
			[
				-76.792186,
				17.992204
			]
		],
		"landingPointIds": [
			"6048",
			"5799",
			"3272"
		]
	},
	{
		"id": "1699",
		"name": "Ceiba-1",
		"rfs": "June 2011",
		"length": "287 km",
		"owners": "Ministerio de Transportes,  Tecnologia,  Correos y Telecomunicaciones",
		"url": "n.a.",
		"points": [
			[
				9.768242,
				1.860054
			],
			[
				8.783347,
				3.749835
			]
		],
		"landingPointIds": [
			"9434",
			"4224"
		]
	},
	{
		"id": "1054",
		"name": "Celtic",
		"rfs": "August 1994",
		"length": "275 km",
		"owners": "BT,  eircom,  Rostelecom",
		"url": "n.a.",
		"points": [
			[
				-6.584106,
				52.174593
			],
			[
				-5.698745,
				50.076109
			]
		],
		"landingPointIds": [
			"5863",
			"5742"
		]
	},
	{
		"id": "1641",
		"name": "CeltixConnect",
		"rfs": "January 2012",
		"length": "131 km",
		"owners": "Sea Fibre Networks",
		"url": "http://www.seafibrenetworks.com",
		"points": [
			[
				-6.248262,
				53.348014
			],
			[
				-4.630379,
				53.306052
			]
		],
		"landingPointIds": [
			"3077",
			"6035"
		]
	},
	{
		"id": "1596",
		"name": "Challenger Bermuda-1 (CB-1)",
		"rfs": "December 2008",
		"length": "1,448 km",
		"owners": "Cable Co.",
		"url": "http://www.challenger.bm",
		"points": [
			[
				-71.645859,
				41.41193
			],
			[
				-64.788692,
				32.280551
			]
		],
		"landingPointIds": [
			"3580",
			"9069"
		]
	},
	{
		"id": "1146",
		"name": "China-U.S. Cable Network (CHUS)",
		"rfs": "January 2000",
		"length": "30,476 km",
		"owners": "Verizon Business,  AT&T,  KDDI,  Tata Communications,  China Telecom,  Chunghwa,  REACH,  KT,  NTT,  Level 3,  SingTel,  Sprint,  Telekom Malaysia,  Telecom New Zealand,  Telstra,  PCCW,  LG Uplus,  Softbank Telecom,  Rostelecom,  SingTel Optus",
		"url": "n.a.",
		"points": [
			[
				-124.408279,
				43.118504
			],
			[
				139.95469,
				34.976637
			],
			[
				121.395289,
				31.619905
			],
			[
				120.662165,
				22.249204
			],
			[
				127.680604,
				26.212373
			],
			[
				128.999384,
				35.170083
			],
			[
				-120.662699,
				35.285025
			],
			[
				116.675506,
				23.354563
			],
			[
				144.809393,
				13.549087
			]
		],
		"landingPointIds": [
			"3554",
			"5885",
			"5802",
			"5980",
			"5886",
			"4183",
			"3772",
			"5803",
			"3251"
		]
	},
	{
		"id": "1304",
		"name": "CIOS",
		"rfs": "April 1994",
		"length": "250 km",
		"owners": "Cytaglobal,  KPN,  Telecom Italia Sparkle,  BT",
		"url": "n.a.",
		"points": [
			[
				33.999996,
				34.983263
			],
			[
				35.094713,
				33.011266
			]
		],
		"landingPointIds": [
			"6029",
			"5866"
		]
	},
	{
		"id": "1137",
		"name": "Circe North",
		"rfs": "February 1999",
		"length": "203 km",
		"owners": "VTLWavenet,  euNetworks",
		"url": "n.a.",
		"points": [
			[
				1.729221,
				52.471336
			],
			[
				4.527251,
				52.370448
			]
		],
		"landingPointIds": [
			"3084",
			"3141"
		]
	},
	{
		"id": "1323",
		"name": "Circe South",
		"rfs": "February 1999",
		"length": "115 km",
		"owners": "VTLWavenet,  euNetworks",
		"url": "n.a.",
		"points": [
			[
				1.493463,
				50.178804
			],
			[
				0.366722,
				50.819071
			]
		],
		"landingPointIds": [
			"6051",
			"6050"
		]
	},
	{
		"id": "1554",
		"name": "Colombia-Florida Subsea Fiber (CFX-1)",
		"rfs": "August 2008",
		"length": "2,400 km",
		"owners": "Columbus Networks",
		"url": "http://www.columbus-networks.com",
		"points": [
			[
				-80.088937,
				26.350304
			],
			[
				-75.505679,
				10.386704
			],
			[
				-77.816733,
				18.349481
			]
		],
		"landingPointIds": [
			"3563",
			"5693",
			"8685"
		]
	},
	{
		"id": "1643",
		"name": "Columbus-II b",
		"rfs": "December 1994",
		"length": "2,068 km",
		"owners": "n.a.",
		"url": "n.a.",
		"points": [
			[
				-64.937114,
				18.372971
			],
			[
				-80.053349,
				26.71531
			]
		],
		"landingPointIds": [
			"5758",
			"3824"
		]
	},
	{
		"id": "1046",
		"name": "Columbus-III",
		"rfs": "December 1999",
		"length": "9,833 km",
		"owners": "Telecom Italia Sparkle,  AT&T,  Verizon Business,  Telefonica,  Portugal Telecom,  CANTV,  Tata Communications,  Entel Chile,  Ukrtelecom,  Corporacion Nacional de Telecommunicaciones,  Telkom South Africa,  Telecom Argentina",
		"url": "n.a.",
		"points": [
			[
				-6.087192,
				36.276545
			],
			[
				-80.160211,
				26.010194
			],
			[
				-9.150142,
				38.725681
			],
			[
				12.591318,
				37.650037
			],
			[
				-25.668781,
				37.739281
			]
		],
		"landingPointIds": [
			"5944",
			"3650",
			"3146",
			"3215",
			"5945"
		]
	},
	{
		"id": "1538",
		"name": "Concerto",
		"rfs": "1999",
		"length": "550 km",
		"owners": "Interoute",
		"url": "n.a.",
		"points": [
			[
				1.620301,
				52.207118
			],
			[
				1.613074,
				52.180817
			],
			[
				4.527251,
				52.370448
			],
			[
				3.206964,
				51.330742
			]
		],
		"landingPointIds": [
			"8398",
			"8399",
			"3141",
			"3139"
		]
	},
	{
		"id": "1295",
		"name": "Corfu-Bar",
		"rfs": "1999",
		"length": "323 km",
		"owners": "OTE,  PTT Montenegro,  Telecom Italia Sparkle",
		"url": "n.a.",
		"points": [
			[
				19.100294,
				42.093054
			],
			[
				19.91955,
				39.619323
			]
		],
		"landingPointIds": [
			"9342",
			"6024"
		]
	},
	{
		"id": "1427",
		"name": "Corse-Continent 4 (CC4)",
		"rfs": "1992",
		"length": "190 km",
		"owners": "France Telecom",
		"url": "n.a.",
		"points": [
			[
				7.017344,
				43.552878
			],
			[
				8.93714,
				42.636547
			]
		],
		"landingPointIds": [
			"6279",
			"7765"
		]
	},
	{
		"id": "1428",
		"name": "Corse-Continent 5 (CC5)",
		"rfs": "1995",
		"length": "299 km",
		"owners": "France Telecom",
		"url": "n.a.",
		"points": [
			[
				8.738675,
				41.919284
			],
			[
				5.878155,
				43.102944
			]
		],
		"landingPointIds": [
			"6053",
			"7766"
		]
	},
	{
		"id": "1541",
		"name": "Danica North",
		"rfs": "1998",
		"length": "25 km",
		"owners": "TeliaSonera",
		"url": "n.a.",
		"points": [
			[
				12.95542,
				55.770346
			],
			[
				12.545541,
				55.721959
			]
		],
		"landingPointIds": [
			"8403",
			"8402"
		]
	},
	{
		"id": "1568",
		"name": "DANICE",
		"rfs": "August 2009",
		"length": "2,304 km",
		"owners": "Icelandic Shareholders",
		"url": "http://www.farice.is",
		"points": [
			[
				8.328997,
				55.751574
			],
			[
				-20.66676,
				63.733123
			]
		],
		"landingPointIds": [
			"5818",
			"8544"
		]
	},
	{
		"id": "1326",
		"name": "Denmark-Norway 5",
		"rfs": "1992",
		"length": "130 km",
		"owners": "TDC,  Telenor",
		"url": "n.a.",
		"points": [
			[
				8.772405,
				58.461715
			],
			[
				9.995618,
				57.45614
			]
		],
		"landingPointIds": [
			"6056",
			"5821"
		]
	},
	{
		"id": "1327",
		"name": "Denmark-Norway 6",
		"rfs": "1992",
		"length": "120 km",
		"owners": "TDC,  Telenor",
		"url": "n.a.",
		"points": [
			[
				7.996215,
				58.150917
			],
			[
				8.70354,
				56.959126
			]
		],
		"landingPointIds": [
			"3131",
			"6054"
		]
	},
	{
		"id": "1262",
		"name": "Denmark-Poland 2",
		"rfs": "1991",
		"length": "110 km",
		"owners": "TPSA,  TDC,  TeliaSonera,  Telenor",
		"url": "n.a.",
		"points": [
			[
				14.966669,
				55.012627
			],
			[
				16.06229,
				54.259927
			]
		],
		"landingPointIds": [
			"5994",
			"5993"
		]
	},
	{
		"id": "1259",
		"name": "Denmark-Sweden 15",
		"rfs": "1989",
		"length": "5 km",
		"owners": "TDC,  TeliaSonera",
		"url": "n.a.",
		"points": [
			[
				12.69582,
				56.043799
			],
			[
				12.300799,
				55.927853
			]
		],
		"landingPointIds": [
			"3268",
			"5992"
		]
	},
	{
		"id": "1261",
		"name": "Denmark-Sweden 16",
		"rfs": "1991",
		"length": "15 km",
		"owners": "TDC,  TeliaSonera,  GlobalConnect",
		"url": "n.a.",
		"points": [
			[
				12.69582,
				56.043799
			],
			[
				12.300799,
				55.927853
			]
		],
		"landingPointIds": [
			"3268",
			"5992"
		]
	},
	{
		"id": "1730",
		"name": "Denmark-Sweden 17",
		"rfs": "1994",
		"length": "11 km",
		"owners": "TDC,  Tele2",
		"url": "n.a.",
		"points": [
			[
				12.536908,
				56.074919
			],
			[
				13.016757,
				56.516721
			]
		],
		"landingPointIds": [
			"10737",
			"10739"
		]
	},
	{
		"id": "1731",
		"name": "Denmark-Sweden 18",
		"rfs": "1996",
		"length": "n.a.",
		"owners": "Telenor,  TDC",
		"url": "n.a.",
		"points": [
			[
				12.69582,
				56.043799
			],
			[
				12.592121,
				56.030448
			]
		],
		"landingPointIds": [
			"3268",
			"6065"
		]
	},
	{
		"id": "1746",
		"name": "Dhiraagu Cable Network",
		"rfs": "April 2012",
		"length": "1,253 km",
		"owners": "Dhiraagu",
		"url": "http://www.dhiraagu.com.mv",
		"points": [
			[
				72.955573,
				3.608089
			],
			[
				73.070817,
				5.103249
			],
			[
				73.426889,
				-0.298361
			],
			[
				73.455499,
				0.288801
			],
			[
				73.544643,
				1.91858
			],
			[
				73.089188,
				-0.606046
			],
			[
				73.540226,
				4.211915
			],
			[
				73.07142,
				6.622502
			]
		],
		"landingPointIds": [
			"10813",
			"10812",
			"10817",
			"10815",
			"10814",
			"10816",
			"9215",
			"10811"
		]
	},
	{
		"id": "1369",
		"name": "Dhiraagu-SLT Submarine Cable Network",
		"rfs": "February 2007",
		"length": "850 km",
		"owners": "Sri Lanka Telecom,  Dhiraagu",
		"url": "http://www.dhiraagu.com.mv/",
		"points": [
			[
				79.872019,
				6.926774
			],
			[
				73.499971,
				4.16644
			]
		],
		"landingPointIds": [
			"3887",
			"4251"
		]
	},
	{
		"id": "1350",
		"name": "Dumai-Melaka Cable System",
		"rfs": "February 2005",
		"length": "159 km",
		"owners": "Telkom Indonesia,  Telekom Malaysia",
		"url": "n.a.",
		"points": [
			[
				101.44764,
				1.665304
			],
			[
				102.220919,
				2.273146
			]
		],
		"landingPointIds": [
			"7311",
			"6300"
		]
	},
	{
		"id": "1592",
		"name": "EAC-C2C",
		"rfs": "November 2002",
		"length": "36,500 km",
		"owners": "Pacnet",
		"url": "http://www.pacnet.com",
		"points": [
			[
				140.612324,
				36.383558
			],
			[
				121.065017,
				13.765521
			],
			[
				120.820174,
				14.286227
			],
			[
				103.987023,
				1.38904
			],
			[
				139.95469,
				34.976637
			],
			[
				114.203081,
				22.2221
			],
			[
				120.662165,
				22.249204
			],
			[
				121.383243,
				25.14998
			],
			[
				128.999384,
				35.170083
			],
			[
				120.342634,
				36.087115
			],
			[
				121.472487,
				31.247571
			],
			[
				136.874423,
				34.336772
			],
			[
				126.391638,
				36.5763
			],
			[
				121.462649,
				25.1813
			],
			[
				114.258695,
				22.31827
			]
		],
		"landingPointIds": [
			"5884",
			"3218",
			"5931",
			"5937",
			"5885",
			"5856",
			"5980",
			"5983",
			"4183",
			"6012",
			"3246",
			"5883",
			"5977",
			"5982",
			"5857"
		]
	},
	{
		"id": "1671",
		"name": "East-West",
		"rfs": "February 2011",
		"length": "1,750 km",
		"owners": "Cable & Wireless Communications",
		"url": "http://www.cwc.com",
		"points": [
			[
				-70.161842,
				18.699027
			],
			[
				-76.716896,
				17.949741
			],
			[
				-64.597254,
				18.414732
			]
		],
		"landingPointIds": [
			"10120",
			"9600",
			"10121"
		]
	},
	{
		"id": "1246",
		"name": "Eastern Africa Submarine System (EASSy)",
		"rfs": "July 2010",
		"length": "10,500 km",
		"owners": "Botswana Telecom,  Telkom South Africa,  Sudan Telecom Company,  Telecom Malagasy,  Tanzania Telecommunications Company Limited,  Zambia Telecom,  Mauritius Telecom,  Vodacom,  MTN Group,  Comores Telecom,  Neotel,  BT,  Etisalat,  Saudi Telecom,  France Telecom,  airtel (Bharti),  WIOCC",
		"url": "http://www.eassy.org",
		"points": [
			[
				39.269697,
				-6.823198
			],
			[
				43.148039,
				11.594657
			],
			[
				32.580627,
				-25.968556
			],
			[
				39.67285,
				-4.053227
			],
			[
				43.243406,
				-11.700689
			],
			[
				31.757858,
				-28.950645
			],
			[
				37.2197,
				19.615558
			],
			[
				43.663123,
				-23.354787
			]
		],
		"landingPointIds": [
			"4182",
			"4177",
			"4252",
			"5896",
			"4227",
			"5942",
			"5950",
			"7398"
		]
	},
	{
		"id": "1290",
		"name": "Eastern Caribbean Fiber System (ECFS)",
		"rfs": "September 1995",
		"length": "1,730 km",
		"owners": "France Telecom,  Cable & Wireless Communications,  AT&T,  BT,  Verizon Business,  Sprint,  CANTV,  Guyana Telephone and Telegraph (GT&T),  Codetel",
		"url": "n.a.",
		"points": [
			[
				-62.731215,
				17.298431
			],
			[
				-59.613354,
				13.098953
			],
			[
				-61.006822,
				13.994202
			],
			[
				-61.650803,
				10.686157
			],
			[
				-61.715352,
				12.185233
			],
			[
				-61.254677,
				13.187895
			],
			[
				-61.094259,
				14.615495
			],
			[
				-62.215729,
				16.706551
			],
			[
				-61.533099,
				16.241058
			],
			[
				-61.370724,
				15.251746
			],
			[
				-63.073735,
				18.031054
			],
			[
				-61.857951,
				17.05148
			],
			[
				-63.057221,
				18.217372
			]
		],
		"landingPointIds": [
			"4356",
			"4202",
			"4207",
			"8838",
			"6077",
			"4219",
			"5905",
			"4355",
			"4906",
			"4260",
			"3188",
			"4239",
			"4195"
		]
	},
	{
		"id": "1532",
		"name": "ECLink",
		"rfs": "October 2007",
		"length": "987 km",
		"owners": "Columbus Networks",
		"url": "http://www.columbus-networks.com",
		"points": [
			[
				-61.650803,
				10.686157
			],
			[
				-68.896618,
				12.095286
			]
		],
		"landingPointIds": [
			"8838",
			"4275"
		]
	},
	{
		"id": "1684",
		"name": "Emerald Bridge Fibres",
		"rfs": "December 2012",
		"length": "120 km",
		"owners": "Geo,  ESB Telecoms",
		"url": "http:www.geo-uk.net",
		"points": [
			[
				-6.197919,
				53.410053
			],
			[
				-4.630379,
				53.306052
			]
		],
		"landingPointIds": [
			"10313",
			"6035"
		]
	},
	{
		"id": "1691",
		"name": "Emerald Express",
		"rfs": "2014",
		"length": "5,200 km",
		"owners": "Emerald Networks",
		"url": "http://www.emeraldnetworks.com",
		"points": [
			[
				-9.991182,
				54.224691
			],
			[
				-22.44486,
				63.846158
			],
			[
				-72.872234,
				40.800273
			]
		],
		"landingPointIds": [
			"10395",
			"10385",
			"3783"
		]
	},
	{
		"id": "1223",
		"name": "ESAT-1",
		"rfs": "August 1999",
		"length": "262 km",
		"owners": "Esat BT",
		"url": "http://www.esat.net",
		"points": [
			[
				-6.584106,
				52.174593
			],
			[
				-5.698745,
				50.076109
			]
		],
		"landingPointIds": [
			"5863",
			"5742"
		]
	},
	{
		"id": "1224",
		"name": "ESAT-2",
		"rfs": "September 1999",
		"length": "245 km",
		"owners": "Esat BT",
		"url": "http://www.esat.net",
		"points": [
			[
				-6.215436,
				53.33145
			],
			[
				-3.006373,
				53.647969
			]
		],
		"landingPointIds": [
			"5865",
			"3324"
		]
	},
	{
		"id": "1251",
		"name": "Estepona-Tetouan",
		"rfs": "July 1994",
		"length": "113 km",
		"owners": "Telefonica,  Maroc Telecom,  KPN",
		"url": "n.a.",
		"points": [
			[
				-5.145865,
				36.427125
			],
			[
				-5.391813,
				35.565908
			]
		],
		"landingPointIds": [
			"5943",
			"5909"
		]
	},
	{
		"id": "1127",
		"name": "Eurafrica",
		"rfs": "1992",
		"length": "3,100 km",
		"owners": "France Telecom,  Portugal Telecom,  Maroc Telecom,  Tata Communications,  KPN,  Rostelecom,  Telekom Austria,  BT,  Vodafone",
		"url": "n.a.",
		"points": [
			[
				-7.611113,
				33.586984
			],
			[
				-16.905068,
				32.647263
			],
			[
				-9.10276,
				38.44269
			],
			[
				-1.945887,
				46.72018
			]
		],
		"landingPointIds": [
			"3256",
			"5935",
			"5934",
			"5834"
		]
	},
	{
		"id": "1708",
		"name": "EUROPA",
		"rfs": "Q2 2015",
		"length": "n.a.",
		"owners": "Cytaglobal,  Lebanese Ministry of Telecommunications",
		"url": "http://www.cytaglobal.com",
		"points": [
			[
				35.485217,
				33.89246
			],
			[
				33.603568,
				34.828466
			]
		],
		"landingPointIds": [
			"3862",
			"5812"
		]
	},
	{
		"id": "1580",
		"name": "Europe India Gateway (EIG)",
		"rfs": "February 2011",
		"length": "15,000 km",
		"owners": "AT&T,  airtel (Bharti),  Bharat Sanchar Nigam Ltd. (BSNL),  BT,  Djibouti Telecom,  du,  Gibtelecom,  Libya International Telecommunications Company,  MTN Group,  Omantel,  Portugal Telecom,  Saudi Telecom,  Telecom Egypt,  Telkom South Africa,  Verizon Business,  Vodafone",
		"url": "http://www.europeindiagateway.com",
		"points": [
			[
				29.702539,
				31.071894
			],
			[
				58.004373,
				23.679414
			],
			[
				-4.544398,
				50.828106
			],
			[
				43.148039,
				11.594657
			],
			[
				56.333737,
				25.121671
			],
			[
				-5.347693,
				36.155981
			],
			[
				39.182762,
				21.481246
			],
			[
				7.417686,
				43.73257
			],
			[
				72.875866,
				19.075779
			],
			[
				-9.10276,
				38.44269
			],
			[
				13.187314,
				32.87735
			],
			[
				32.649894,
				29.116662
			]
		],
		"landingPointIds": [
			"9485",
			"8947",
			"4554",
			"4177",
			"5962",
			"8948",
			"4361",
			"3255",
			"3212",
			"5934",
			"4271",
			"9486"
		]
	},
	{
		"id": "1240",
		"name": "FARICE-1",
		"rfs": "January 2004",
		"length": "1,395 km",
		"owners": "Icelandic Shareholders",
		"url": "http://www.farice.is",
		"points": [
			[
				-3.346182,
				58.615306
			],
			[
				-6.928132,
				62.244086
			],
			[
				-14.018046,
				65.251372
			]
		],
		"landingPointIds": [
			"5746",
			"5725",
			"5859"
		]
	},
	{
		"id": "1336",
		"name": "Fehmarn B\u00e4lt",
		"rfs": "2000",
		"length": "20 km",
		"owners": "TeliaSonera",
		"url": "n.a.",
		"points": [
			[
				11.212506,
				54.496037
			],
			[
				11.358669,
				54.66308
			]
		],
		"landingPointIds": [
			"5839",
			"5814"
		]
	},
	{
		"id": "1209",
		"name": "Fiber Optic Gulf (FOG)",
		"rfs": "June 1998",
		"length": "1,300 km",
		"owners": "Kuwait Ministry of Communications,  Etisalat,  QTel,  Bahrain Telecommunications Co. BSC",
		"url": "n.a.",
		"points": [
			[
				51.51939,
				25.294336
			],
			[
				55.308487,
				25.26934
			],
			[
				47.974734,
				29.374053
			],
			[
				50.575855,
				26.229037
			]
		],
		"landingPointIds": [
			"3867",
			"3270",
			"3871",
			"4188"
		]
	},
	{
		"id": "1361",
		"name": "Fibralink",
		"rfs": "March 2006",
		"length": "1,000 km",
		"owners": "Columbus Networks",
		"url": "http://www.columbus-networks.com",
		"points": [
			[
				-76.666652,
				17.949741
			],
			[
				-72.343146,
				18.542725
			],
			[
				-70.691232,
				19.799366
			]
		],
		"landingPointIds": [
			"7689",
			"3878",
			"5823"
		]
	},
	{
		"id": "1242",
		"name": "Finland Estonia Connection (FEC)",
		"rfs": "January 2000",
		"length": "250 km",
		"owners": "Elisa",
		"url": "http://www.elisa.com",
		"points": [
			[
				24.932463,
				60.1711
			],
			[
				24.752369,
				59.436169
			]
		],
		"landingPointIds": [
			"3064",
			"3089"
		]
	},
	{
		"id": "1263",
		"name": "Finland-Estonia 2 (EESF-2)",
		"rfs": "1992",
		"length": "98 km",
		"owners": "Elion,  TeliaSonera",
		"url": "n.a.",
		"points": [
			[
				24.932463,
				60.1711
			],
			[
				24.752369,
				59.436169
			]
		],
		"landingPointIds": [
			"3064",
			"3089"
		]
	},
	{
		"id": "1268",
		"name": "Finland-Estonia 3 (EESF-3)",
		"rfs": "1994",
		"length": "104 km",
		"owners": "TeliaSonera,  Elion",
		"url": "n.a.",
		"points": [
			[
				24.932463,
				60.1711
			],
			[
				24.276636,
				59.400832
			]
		],
		"landingPointIds": [
			"3064",
			"5999"
		]
	},
	{
		"id": "1028",
		"name": "FLAG Atlantic-1 (FA-1)",
		"rfs": "June 2001",
		"length": "14,500 km",
		"owners": "Reliance Globalcom",
		"url": "http://www.relianceglobalcom.com",
		"points": [
			[
				-73.655953,
				40.600303
			],
			[
				-72.805276,
				40.818744
			],
			[
				-2.768055,
				48.534771
			],
			[
				-5.675054,
				50.06356
			]
		],
		"landingPointIds": [
			"9763",
			"9762",
			"5836",
			"5741"
		]
	},
	{
		"id": "1027",
		"name": "FLAG Europe-Asia (FEA)",
		"rfs": "November 1997",
		"length": "28,000 km",
		"owners": "Reliance Globalcom",
		"url": "http://www.relianceglobalcom.com",
		"points": [
			[
				29.889861,
				31.191856
			],
			[
				35.006975,
				29.531761
			],
			[
				-5.145865,
				36.427125
			],
			[
				56.333737,
				25.121671
			],
			[
				39.182762,
				21.481246
			],
			[
				128.620826,
				34.880668
			],
			[
				113.9484,
				22.27149
			],
			[
				139.620703,
				35.144082
			],
			[
				72.875866,
				19.075779
			],
			[
				139.255396,
				35.299381
			],
			[
				13.358373,
				38.121453
			],
			[
				100.362961,
				5.353613
			],
			[
				-5.654525,
				50.043081
			],
			[
				100.066118,
				6.613166
			],
			[
				121.472487,
				31.247571
			],
			[
				100.596963,
				7.078459
			],
			[
				32.530133,
				29.972258
			]
		],
		"landingPointIds": [
			"6044",
			"4363",
			"5943",
			"5962",
			"4361",
			"5975",
			"5852",
			"5889",
			"3212",
			"5890",
			"3177",
			"3307",
			"3082",
			"5956",
			"3246",
			"4265",
			"5825"
		]
	},
	{
		"id": "1346",
		"name": "FLAG FALCON",
		"rfs": "September 2006",
		"length": "10,300 km",
		"owners": "Reliance Globalcom",
		"url": "http://www.relianceglobalcom.com",
		"points": [
			[
				52.182344,
				16.210339
			],
			[
				43.008501,
				14.685565
			],
			[
				50.214262,
				26.286157
			],
			[
				47.976541,
				29.369937
			],
			[
				58.176135,
				23.684634
			],
			[
				48.53178,
				29.923369
			],
			[
				56.274409,
				27.187329
			],
			[
				60.629687,
				25.298251
			],
			[
				51.51939,
				25.294336
			],
			[
				55.308487,
				25.26934
			],
			[
				39.182762,
				21.481246
			],
			[
				56.246802,
				26.181353
			],
			[
				50.575855,
				26.229037
			],
			[
				72.875866,
				19.075779
			],
			[
				37.2197,
				19.615558
			],
			[
				32.530133,
				29.972258
			]
		],
		"landingPointIds": [
			"7679",
			"7681",
			"7729",
			"4294",
			"7646",
			"9596",
			"8848",
			"8849",
			"3867",
			"3270",
			"4361",
			"7645",
			"4188",
			"3212",
			"5950",
			"5825"
		]
	},
	{
		"id": "1150",
		"name": "FLAG North Asia Loop/REACH North Asia Loop",
		"rfs": "June 2001",
		"length": "9,504 km",
		"owners": "Reliance Globalcom,  PCCW,  Telstra",
		"url": "n.a.",
		"points": [
			[
				128.999384,
				35.170083
			],
			[
				113.932137,
				22.22732
			],
			[
				121.801454,
				24.863576
			],
			[
				140.016729,
				35.035866
			]
		],
		"landingPointIds": [
			"4183",
			"5855",
			"5981",
			"5892"
		]
	},
	{
		"id": "1551",
		"name": "Gemini Bermuda",
		"rfs": "October 2007",
		"length": "1,287 km",
		"owners": "Cable & Wireless Communications",
		"url": "http://www.cwbda.com",
		"points": [
			[
				-74.04706,
				40.123365
			],
			[
				-64.769518,
				32.312172
			]
		],
		"landingPointIds": [
			"3686",
			"5793"
		]
	},
	{
		"id": "1685",
		"name": "Geo-Eirgrid",
		"rfs": "December 2012",
		"length": "187 km",
		"owners": "Geo,  Eirgrid",
		"url": "http://www.geo-uk.net",
		"points": [
			[
				-3.027555,
				53.20175
			],
			[
				-6.165895,
				53.526301
			]
		],
		"landingPointIds": [
			"10338",
			"10907"
		]
	},
	{
		"id": "1192",
		"name": "Georgia-Russia",
		"rfs": "December 2000",
		"length": "433 km",
		"owners": "Rostelecom,  FOPTNET,  DanTelco",
		"url": "http://www.georgia-russia.com",
		"points": [
			[
				37.772831,
				44.723588
			],
			[
				41.667635,
				42.150776
			],
			[
				39.725855,
				43.615519
			]
		],
		"landingPointIds": [
			"5117",
			"5530",
			"5092"
		]
	},
	{
		"id": "1200",
		"name": "Germany-Denmark 2",
		"rfs": "December 1995",
		"length": "60 km",
		"owners": "TDC",
		"url": "n.a.",
		"points": [
			[
				11.928966,
				54.576346
			],
			[
				12.431502,
				54.243363
			]
		],
		"landingPointIds": [
			"5820",
			"5842"
		]
	},
	{
		"id": "1330",
		"name": "Germany-Netherlands",
		"rfs": "October 1991",
		"length": "322 km",
		"owners": "Deutsche Telekom",
		"url": "n.a.",
		"points": [
			[
				4.746194,
				52.634666
			],
			[
				7.201855,
				53.595467
			]
		],
		"landingPointIds": [
			"3086",
			"5840"
		]
	},
	{
		"id": "1357",
		"name": "GLO-1",
		"rfs": "October 2010",
		"length": "9,800 km",
		"owners": "Globacom Limited",
		"url": "http://www.gloworld.com",
		"points": [
			[
				-0.201065,
				5.558302
			],
			[
				-4.544398,
				50.828106
			],
			[
				3.423247,
				6.438895
			]
		],
		"landingPointIds": [
			"4181",
			"4554",
			"3280"
		]
	},
	{
		"id": "1619",
		"name": "Global Caribbean Network (GCN)",
		"rfs": "September 2006",
		"length": "3,068 km",
		"owners": "Leucadia National Corporation,  Loret Group",
		"url": "http://www.globalcaribbean.net",
		"points": [
			[
				-61.713946,
				16.028941
			],
			[
				-62.731215,
				17.298431
			],
			[
				-61.384828,
				15.303345
			],
			[
				-61.650803,
				10.686157
			],
			[
				-61.554883,
				16.242965
			],
			[
				-61.254677,
				13.187895
			],
			[
				-61.094259,
				14.615495
			],
			[
				-59.612751,
				13.078775
			],
			[
				-60.988552,
				14.035661
			],
			[
				-62.833409,
				17.900049
			],
			[
				-63.050094,
				18.092792
			],
			[
				-66.106669,
				18.465829
			],
			[
				-64.81941,
				17.771855
			],
			[
				-61.711637,
				12.187943
			],
			[
				-61.711637,
				12.187943
			],
			[
				-61.857951,
				17.05148
			]
		],
		"landingPointIds": [
			"8834",
			"4356",
			"8835",
			"8838",
			"8836",
			"4219",
			"5905",
			"6183",
			"8837",
			"7876",
			"7875",
			"4262",
			"5750",
			"4244",
			"4244",
			"4239"
		]
	},
	{
		"id": "1076",
		"name": "GlobeNet",
		"rfs": "October 2000",
		"length": "22,770 km",
		"owners": "Oi",
		"url": "http://www.globenet.net",
		"points": [
			[
				-74.779783,
				10.940437
			],
			[
				-80.088937,
				26.350304
			],
			[
				-38.542979,
				-3.718838
			],
			[
				-66.960358,
				10.599423
			],
			[
				-43.209557,
				-22.903448
			],
			[
				-64.769518,
				32.312172
			],
			[
				-74.337931,
				39.603864
			]
		],
		"landingPointIds": [
			"4315",
			"3563",
			"3347",
			"5968",
			"3242",
			"5793",
			"3808"
		]
	},
	{
		"id": "1715",
		"name": "GlobeNet Segment 5 (Bermuda-U.S.)",
		"rfs": "Q1 2013",
		"length": "1,350 km",
		"owners": "Oi",
		"url": "http://www.globenet.net",
		"points": [
			[
				-64.769518,
				32.312172
			],
			[
				-74.337931,
				39.603864
			]
		],
		"landingPointIds": [
			"5793",
			"3808"
		]
	},
	{
		"id": "1581",
		"name": "GO-1 Mediterranean Cable System",
		"rfs": "December 2008",
		"length": "290 km",
		"owners": "GO plc",
		"url": "http://www.go.com.mt",
		"points": [
			[
				12.591318,
				37.650037
			],
			[
				14.415646,
				35.950389
			]
		],
		"landingPointIds": [
			"3215",
			"8561"
		]
	},
	{
		"id": "1514",
		"name": "Gondwana-1",
		"rfs": "September 2008",
		"length": "2,151 km",
		"owners": "OPT",
		"url": "http://telecom.opt.nc",
		"points": [
			[
				166.439122,
				-22.303336
			],
			[
				151.20704,
				-33.869897
			]
		],
		"landingPointIds": [
			"5704",
			"3030"
		]
	},
	{
		"id": "1383",
		"name": "Greece-Western Europe Network (GWEN)",
		"rfs": "June 2004",
		"length": "700 km",
		"owners": "OTE",
		"url": "http://www.oteglobe.gr",
		"points": [
			[
				16.866689,
				41.125526
			],
			[
				19.923967,
				39.753842
			]
		],
		"landingPointIds": [
			"3160",
			"7730"
		]
	},
	{
		"id": "1569",
		"name": "Greenland Connect",
		"rfs": "March 2009",
		"length": "4,780 km",
		"owners": "TELE Greenland",
		"url": "http://www.tele.gl",
		"points": [
			[
				-20.14229,
				63.642172
			],
			[
				-53.965144,
				48.86434
			],
			[
				-51.729983,
				64.181149
			],
			[
				-46.035394,
				60.71891
			]
		],
		"landingPointIds": [
			"8994",
			"8542",
			"8488",
			"8543"
		]
	},
	{
		"id": "1692",
		"name": "Guam Okinama Kyushu Incheon (GOKI)",
		"rfs": "Q4 2013",
		"length": "4,244 km",
		"owners": "AT&T",
		"url": "http://www.att.com",
		"points": [
			[
				131.032015,
				33.839256
			],
			[
				127.680604,
				26.212373
			],
			[
				144.800459,
				13.51355
			]
		],
		"landingPointIds": [
			"5895",
			"5886",
			"5972"
		]
	},
	{
		"id": "1702",
		"name": "Guernsey-Jersey-4",
		"rfs": "Janaury 1994",
		"length": "37 km",
		"owners": "n.a.",
		"url": "n.a.",
		"points": [
			[
				-2.201422,
				49.247918
			],
			[
				-2.558046,
				49.423294
			]
		],
		"landingPointIds": [
			"10375",
			"10374"
		]
	},
	{
		"id": "1598",
		"name": "Gulf Bridge International Cable System (GBICS)/Middle East North Africa (MENA) Cable System",
		"rfs": "February 2012",
		"length": "n.a.",
		"owners": "Gulf Bridge International,  MENA",
		"url": "http://www.gbiinc.com",
		"points": [
			[
				51.45193,
				25.538577
			],
			[
				50.656264,
				26.241585
			],
			[
				50.214262,
				26.286157
			],
			[
				58.176135,
				23.684634
			],
			[
				48.53178,
				29.923369
			],
			[
				50.842783,
				28.969997
			],
			[
				56.333737,
				25.121671
			],
			[
				47.974734,
				29.374053
			],
			[
				72.875866,
				19.075779
			]
		],
		"landingPointIds": [
			"10232",
			"10233",
			"7729",
			"7646",
			"9596",
			"9683",
			"5962",
			"3871",
			"3212"
		]
	},
	{
		"id": "1621",
		"name": "HANNIBAL System",
		"rfs": "October 2009",
		"length": "173 km",
		"owners": "Tunisia Telecom",
		"url": "http://www.tunisietelecom.tn",
		"points": [
			[
				11.089934,
				36.849352
			],
			[
				12.591318,
				37.650037
			]
		],
		"landingPointIds": [
			"6015",
			"3215"
		]
	},
	{
		"id": "1605",
		"name": "HANTRU1 Cable System",
		"rfs": "March 2010",
		"length": "3,500 km",
		"owners": "Hannon Armstrong,  Federated States of Micronesia Telecommunications Company,  Marshall Islands Telecommunications Authority",
		"url": "n.a.",
		"points": [
			[
				167.424318,
				9.189793
			],
			[
				171.185608,
				7.116204
			],
			[
				144.694751,
				13.464662
			],
			[
				159.070234,
				7.786486
			]
		],
		"landingPointIds": [
			"7879",
			"9060",
			"5973",
			"9062"
		]
	},
	{
		"id": "1523",
		"name": "Hawk",
		"rfs": "2011",
		"length": "3,400 km",
		"owners": "Reliance Globalcom",
		"url": "http://www.relianceglobalcom.com",
		"points": [
			[
				29.889861,
				31.191856
			],
			[
				32.575608,
				34.692643
			],
			[
				5.372607,
				43.293177
			]
		],
		"landingPointIds": [
			"6044",
			"10384",
			"3210"
		]
	},
	{
		"id": "1080",
		"name": "Hibernia Atlantic",
		"rfs": "April 2001",
		"length": "12,200 km",
		"owners": "Hibernia Networks",
		"url": "http://www.hibernianetworks.com",
		"points": [
			[
				-6.676211,
				55.130782
			],
			[
				-6.248262,
				53.348014
			],
			[
				-63.573962,
				44.645788
			],
			[
				-70.95028,
				42.463681
			],
			[
				-3.006373,
				53.647969
			]
		],
		"landingPointIds": [
			"9038",
			"3077",
			"3640",
			"3683",
			"3324"
		]
	},
	{
		"id": "1673",
		"name": "Hibernia Express",
		"rfs": "2014",
		"length": "4,600 km",
		"owners": "Hibernia Networks",
		"url": "http://www.hibernianetworks.com",
		"points": [
			[
				-3.01089,
				51.293699
			],
			[
				-63.573962,
				44.645788
			]
		],
		"landingPointIds": [
			"5736",
			"3640"
		]
	},
	{
		"id": "1697",
		"name": "High-capacity Undersea Guernsey Optical-fibre (HUGO)",
		"rfs": "2007",
		"length": "425 km",
		"owners": "Sure,  Vodafone",
		"url": "n.a.",
		"points": [
			[
				-3.45992,
				48.730224
			],
			[
				-2.537617,
				49.509526
			],
			[
				-5.654525,
				50.043081
			],
			[
				-2.558046,
				49.423294
			]
		],
		"landingPointIds": [
			"5837",
			"10373",
			"3082",
			"10374"
		]
	},
	{
		"id": "1528",
		"name": "Hokkaido-Sakhalin Cable System (HSCS)",
		"rfs": "July 2008",
		"length": "570 km",
		"owners": "NTT,  TTK",
		"url": "n.a.",
		"points": [
			[
				141.315432,
				43.171207
			],
			[
				141.859227,
				46.684442
			]
		],
		"landingPointIds": [
			"7834",
			"8366"
		]
	},
	{
		"id": "1556",
		"name": "Honotua",
		"rfs": "September 2010",
		"length": "4,500 km",
		"owners": "OPT French Polynesia",
		"url": "http://www.opt.pf",
		"points": [
			[
				-155.831387,
				20.039893
			],
			[
				-149.441068,
				-17.512379
			]
		],
		"landingPointIds": [
			"8973",
			"8974"
		]
	},
	{
		"id": "1179",
		"name": "i2i Cable Network (i2icn)",
		"rfs": "April 2002",
		"length": "3,200 km",
		"owners": "airtel (Bharti),  Pacnet",
		"url": "http://www.airtel.in",
		"points": [
			[
				80.243049,
				13.063516
			],
			[
				103.647114,
				1.338244
			]
		],
		"landingPointIds": [
			"4191",
			"5938"
		]
	},
	{
		"id": "1536",
		"name": "IMEWE",
		"rfs": "December 2010",
		"length": "12,091 km",
		"owners": "Telecom Italia Sparkle,  Etisalat,  Tata Communications,  Pakistan Telecommunications Company Ltd.,  France Telecom,  airtel (Bharti),  Saudi Telecom,  Ogero,  Telecom Egypt",
		"url": "http://imewecable.com",
		"points": [
			[
				29.889861,
				31.191856
			],
			[
				15.067457,
				37.511603
			],
			[
				56.333737,
				25.121671
			],
			[
				39.182762,
				21.481246
			],
			[
				67.028539,
				24.889376
			],
			[
				5.372607,
				43.293177
			],
			[
				72.875866,
				19.075779
			],
			[
				32.530133,
				29.972258
			],
			[
				35.859158,
				34.439468
			]
		],
		"landingPointIds": [
			"6044",
			"3214",
			"5962",
			"4361",
			"3259",
			"3210",
			"3212",
			"5825",
			"8663"
		]
	},
	{
		"id": "1700",
		"name": "INGRID",
		"rfs": "October 2004",
		"length": "64 km",
		"owners": "n.a.",
		"url": "n.a.",
		"points": [
			[
				-2.021328,
				49.225231
			],
			[
				-2.201422,
				49.247918
			],
			[
				-2.529486,
				49.451
			],
			[
				-1.649997,
				49.283254
			]
		],
		"landingPointIds": [
			"10377",
			"10375",
			"10376",
			"10378"
		]
	},
	{
		"id": "1682",
		"name": "Interchange Cable Network (ICN)",
		"rfs": "Q4 2013",
		"length": "1,230 km",
		"owners": "Interchange",
		"url": "http://www.interchange.vu",
		"points": [
			[
				168.32288,
				-17.730419
			],
			[
				178.437446,
				-18.123834
			]
		],
		"landingPointIds": [
			"9086",
			"4268"
		]
	},
	{
		"id": "1296",
		"name": "Italy-Albania",
		"rfs": "1997",
		"length": "240 km",
		"owners": "Telecom Italia Sparkle,  Albania Telecom",
		"url": "n.a.",
		"points": [
			[
				16.866689,
				41.125526
			],
			[
				19.450041,
				41.316663
			]
		],
		"landingPointIds": [
			"3160",
			"6025"
		]
	},
	{
		"id": "1286",
		"name": "Italy-Croatia",
		"rfs": "1994",
		"length": "230 km",
		"owners": "Telecom Italia Sparkle,  T-Hrvatski Telekom",
		"url": "n.a.",
		"points": [
			[
				12.24408,
				45.495863
			],
			[
				13.520196,
				45.433121
			]
		],
		"landingPointIds": [
			"6016",
			"6017"
		]
	},
	{
		"id": "1299",
		"name": "Italy-Greece 1",
		"rfs": "1995",
		"length": "161 km",
		"owners": "Telecom Italia Sparkle",
		"url": "n.a.",
		"points": [
			[
				19.91955,
				39.619323
			],
			[
				18.485726,
				40.14806
			]
		],
		"landingPointIds": [
			"6024",
			"6027"
		]
	},
	{
		"id": "1287",
		"name": "Italy-Libya",
		"rfs": "1998",
		"length": "570 km",
		"owners": "Telecom Italia Sparkle,  Libya International Telecommunications Company",
		"url": "n.a.",
		"points": [
			[
				12.591318,
				37.650037
			],
			[
				13.187314,
				32.87735
			]
		],
		"landingPointIds": [
			"3215",
			"4271"
		]
	},
	{
		"id": "1301",
		"name": "Italy-Malta",
		"rfs": "1995",
		"length": "238 km",
		"owners": "Telecom Italia Sparkle,  GO plc",
		"url": "n.a.",
		"points": [
			[
				15.067457,
				37.511603
			],
			[
				14.488125,
				35.89869
			]
		],
		"landingPointIds": [
			"3214",
			"4058"
		]
	},
	{
		"id": "1302",
		"name": "Italy-Monaco",
		"rfs": "1995",
		"length": "162 km",
		"owners": "Telecom Italia Sparkle,  Monaco Telecom",
		"url": "n.a.",
		"points": [
			[
				7.427223,
				43.739697
			],
			[
				8.483793,
				44.305577
			]
		],
		"landingPointIds": [
			"6028",
			"5880"
		]
	},
	{
		"id": "1300",
		"name": "ITUR",
		"rfs": "1996",
		"length": "3,500 km",
		"owners": "Telecom Italia Sparkle,  Ukrtelecom,  Rostelecom,  Turk Telekom,  KPN,  Etisalat,  Vivacom,  TPSA,  BT,  Tata Communications",
		"url": "n.a.",
		"points": [
			[
				28.986079,
				41.040599
			],
			[
				37.772831,
				44.723588
			],
			[
				30.677495,
				46.488989
			],
			[
				13.358373,
				38.121453
			]
		],
		"landingPointIds": [
			"3221",
			"5117",
			"5355",
			"3177"
		]
	},
	{
		"id": "1597",
		"name": "JAKABARE",
		"rfs": "November 2009",
		"length": "1,330 km",
		"owners": "PT Indonesia Satellite Corp.",
		"url": "http://www.indosat.com",
		"points": [
			[
				103.987023,
				1.38904
			],
			[
				109.183242,
				-0.06707
			],
			[
				104.133186,
				1.173208
			],
			[
				107.120897,
				-5.981455
			]
		],
		"landingPointIds": [
			"5937",
			"9094",
			"9096",
			"9095"
		]
	},
	{
		"id": "1729",
		"name": "Janna",
		"rfs": "April 2005",
		"length": "634 km",
		"owners": "Regione Sardegne,  Interoute,  Wind,  Tiscali",
		"url": "n.a.",
		"points": [
			[
				9.109404,
				39.215367
			],
			[
				11.796857,
				42.091146
			],
			[
				12.591318,
				37.650037
			],
			[
				9.486858,
				40.922544
			]
		],
		"landingPointIds": [
			"3162",
			"7751",
			"3215",
			"8592"
		]
	},
	{
		"id": "1010",
		"name": "Japan-U.S. Cable Network (JUS)",
		"rfs": "September 2001",
		"length": "22,682 km",
		"owners": "Verizon Business,  REACH,  AT&T,  BT,  Sprint,  CenturyLink,  KDDI,  NTT,  Chunghwa,  Tata Communications,  SingTel,  Telekom Malaysia,  Softbank Telecom,  France Telecom,  Level 3,  AboveNet,  SK Broadband,  KT,  China Telecom,  China Unicom,  LG Uplus,  New World Telecom,  Starhub,  PCCW,  Telstra,  Vodafone",
		"url": "n.a.",
		"points": [
			[
				140.750958,
				36.801769
			],
			[
				-158.206036,
				21.460265
			],
			[
				-123.687,
				38.969219
			],
			[
				139.81696,
				35.037472
			],
			[
				-120.847209,
				35.36674
			],
			[
				136.874423,
				34.336772
			]
		],
		"landingPointIds": [
			"5703",
			"5760",
			"3687",
			"5887",
			"5751",
			"5883"
		]
	},
	{
		"id": "1677",
		"name": "Jonah",
		"rfs": "January 2012",
		"length": "2,297 km",
		"owners": "Bezeq International Ltd.",
		"url": "http://www.bezeqint.net",
		"points": [
			[
				16.866689,
				41.125526
			],
			[
				34.769661,
				32.044642
			]
		],
		"landingPointIds": [
			"3160",
			"3213"
		]
	},
	{
		"id": "1333",
		"name": "KAFOS",
		"rfs": "June 1997",
		"length": "538 km",
		"owners": "Turk Telekom,  Vivacom,  Romtelecom,  KPN,  Telecom Italia Sparkle,  Slovak Telekom,  Rostelecom,  BT",
		"url": "n.a.",
		"points": [
			[
				27.985324,
				41.884149
			],
			[
				28.986079,
				41.040599
			],
			[
				28.582725,
				43.817196
			],
			[
				27.912845,
				43.20835
			]
		],
		"landingPointIds": [
			"6058",
			"3221",
			"6059",
			"5356"
		]
	},
	{
		"id": "1218",
		"name": "Kattegat 1",
		"rfs": "August 1995",
		"length": "180 km",
		"owners": "TDC,  TeliaSonera,  Tata Communications,  BT,  Vodafone",
		"url": "n.a.",
		"points": [
			[
				12.076233,
				57.487461
			],
			[
				10.516625,
				57.330858
			]
		],
		"landingPointIds": [
			"10605",
			"10606"
		]
	},
	{
		"id": "1688",
		"name": "Kattegat 2",
		"rfs": "2001",
		"length": "75 km",
		"owners": "TDC",
		"url": "n.a.",
		"points": [
			[
				10.514617,
				57.244826
			],
			[
				10.60095,
				55.858285
			],
			[
				12.683272,
				56.683163
			],
			[
				10.96696,
				57.272232
			]
		],
		"landingPointIds": [
			"10320",
			"10322",
			"10323",
			"10321"
		]
	},
	{
		"id": "1530",
		"name": "Kodiak Kenai Fiber Link (KKFL)",
		"rfs": "January 2007",
		"length": "966 km",
		"owners": "Kodiak Kenai Cable Company",
		"url": "http://www.kkfl.info",
		"points": [
			[
				-149.858376,
				61.217431
			],
			[
				-151.544271,
				59.646378
			],
			[
				-151.259775,
				60.552871
			],
			[
				-152.395249,
				57.794143
			],
			[
				-152.329145,
				57.426828
			],
			[
				-149.443126,
				60.112173
			]
		],
		"landingPointIds": [
			"4067",
			"8392",
			"8393",
			"8394",
			"8395",
			"5755"
		]
	},
	{
		"id": "1231",
		"name": "Korea-Japan Cable Network (KJCN)",
		"rfs": "March 2002",
		"length": "500 km",
		"owners": "Kyushu Electric Power,  KT,  Softbank Telecom,  NTT",
		"url": "n.a.",
		"points": [
			[
				130.401687,
				33.590296
			],
			[
				131.032015,
				33.839256
			],
			[
				128.999384,
				35.170083
			]
		],
		"landingPointIds": [
			"4059",
			"5895",
			"4183"
		]
	},
	{
		"id": "1250",
		"name": "Kuwait-Iran",
		"rfs": "June 2005",
		"length": "380 km",
		"owners": "Telecommunication Infrastructure Company of Iran,  Kuwait Ministry of Communications",
		"url": "n.a.",
		"points": [
			[
				50.521144,
				29.570811
			],
			[
				50.312038,
				29.245759
			],
			[
				47.974734,
				29.374053
			],
			[
				49.478025,
				29.072491
			]
		],
		"landingPointIds": [
			"5990",
			"10603",
			"3871",
			"10604"
		]
	},
	{
		"id": "1270",
		"name": "Latvia-Sweden 1 (LV-SE 1)",
		"rfs": "1994",
		"length": "304 km",
		"owners": "TeliaSonera,  Tele2,  Lattelecom,  Vodafone",
		"url": "n.a.",
		"points": [
			[
				17.946549,
				58.902914
			],
			[
				21.570009,
				57.389484
			]
		],
		"landingPointIds": [
			"5951",
			"5897"
		]
	},
	{
		"id": "1065",
		"name": "Lev Submarine System",
		"rfs": "March 1999",
		"length": "2,600 km",
		"owners": "Telecom Italia Sparkle",
		"url": "http://www.mednautilus.com",
		"points": [
			[
				12.591318,
				37.650037
			],
			[
				34.769661,
				32.044642
			],
			[
				32.466588,
				34.766427
			]
		],
		"landingPointIds": [
			"3215",
			"3213",
			"5811"
		]
	},
	{
		"id": "1184",
		"name": "LFON (Libyan Fiber Optic Network)",
		"rfs": "1999",
		"length": "1,639 km",
		"owners": "Libyan PTT (GPTC)",
		"url": "n.a.",
		"points": [
			[
				21.74167,
				32.881767
			],
			[
				19.576529,
				30.378121
			],
			[
				14.264464,
				32.649673
			],
			[
				20.066717,
				32.116619
			],
			[
				22.639228,
				32.763612
			],
			[
				15.094762,
				32.374312
			],
			[
				18.411942,
				30.586725
			],
			[
				16.588316,
				31.205308
			],
			[
				23.960317,
				32.079576
			],
			[
				20.95002,
				32.716731
			],
			[
				13.187314,
				32.87735
			],
			[
				12.529781,
				32.774654
			],
			[
				12.083361,
				32.933366
			]
		],
		"landingPointIds": [
			"10838",
			"7870",
			"7866",
			"7871",
			"7873",
			"7867",
			"7869",
			"7868",
			"7874",
			"7872",
			"4271",
			"7865",
			"7864"
		]
	},
	{
		"id": "1714",
		"name": "Loukkos",
		"rfs": "April 2012",
		"length": "187 km",
		"owners": "Maroc Telecom",
		"url": "http://www.maroctelecom.ma",
		"points": [
			[
				-6.035744,
				35.470741
			],
			[
				-6.358186,
				36.616957
			]
		],
		"landingPointIds": [
			"5910",
			"10400"
		]
	},
	{
		"id": "1594",
		"name": "Lower Indian Ocean Network (LION)",
		"rfs": "November 2009",
		"length": "1,060 km",
		"owners": "France Telecom,  Mauritius Telecom,  Orange Madagascar",
		"url": "http://lion.orange.com",
		"points": [
			[
				55.549917,
				-20.897319
			],
			[
				57.510069,
				-20.077862
			],
			[
				49.400326,
				-18.146221
			]
		],
		"landingPointIds": [
			"9399",
			"9400",
			"9398"
		]
	},
	{
		"id": "1667",
		"name": "Lower Indian Ocean Network 2 (LION2)",
		"rfs": "April 2012",
		"length": "2,700 km",
		"owners": "France Telecom,  Mauritius Telecom,  Orange Madagascar,  Telkom Kenya,  Soci\u00e9t\u00e9 r\u00e9unionnaise du radiot\u00e9l\u00e9phone,  Emtel,  STOI",
		"url": "n.a.",
		"points": [
			[
				45.165913,
				-12.81709
			],
			[
				39.700055,
				-4.050416
			]
		],
		"landingPointIds": [
			"10123",
			"10122"
		]
	},
	{
		"id": "1565",
		"name": "Main One",
		"rfs": "July 2010",
		"length": "7,000 km",
		"owners": "Main One Cable Company",
		"url": "http://www.mainonecable.com",
		"points": [
			[
				-0.201065,
				5.558302
			],
			[
				3.423247,
				6.438895
			],
			[
				-9.107377,
				38.642259
			]
		],
		"landingPointIds": [
			"4181",
			"3280",
			"9058"
		]
	},
	{
		"id": "1535",
		"name": "Matrix Cable System",
		"rfs": "August 2008",
		"length": "1,055 km",
		"owners": "Matrix Networks Pte. Ltd.",
		"url": "http://www.matrixnetworks.sg",
		"points": [
			[
				103.962529,
				1.13466
			],
			[
				103.987023,
				1.38904
			],
			[
				106.827868,
				-6.171889
			]
		],
		"landingPointIds": [
			"5862",
			"5937",
			"3012"
		]
	},
	{
		"id": "1071",
		"name": "Maya-1",
		"rfs": "October 2000",
		"length": "4,400 km",
		"owners": "Cable & Wireless Communications,  Verizon Business,  Tata Communications,  AT&T,  Sprint,  Hondutel,  CANTV,  Entel Chile,  Telefonica,  BT,  Orbitel,  MarcaTel",
		"url": "http://www.maya-1.com",
		"points": [
			[
				-86.767566,
				21.09566
			],
			[
				-81.166789,
				19.282977
			],
			[
				-80.160211,
				26.010194
			],
			[
				-79.753544,
				9.437346
			],
			[
				-87.946056,
				15.844831
			],
			[
				-83.037697,
				9.98857
			],
			[
				-75.558583,
				9.496273
			]
		],
		"landingPointIds": [
			"3842",
			"5799",
			"3650",
			"5928",
			"5851",
			"5810",
			"5808"
		]
	},
	{
		"id": "1366",
		"name": "Med Cable Network",
		"rfs": "October 2005",
		"length": "1,300 km",
		"owners": "Orascom Telecom Media and Technology",
		"url": "n.a.",
		"points": [
			[
				3.031789,
				36.765328
			],
			[
				7.755488,
				36.902356
			],
			[
				5.372607,
				43.293177
			],
			[
				-0.641964,
				35.70163
			]
		],
		"landingPointIds": [
			"4176",
			"4196",
			"3210",
			"8359"
		]
	},
	{
		"id": "1185",
		"name": "MedNautilus Submarine System",
		"rfs": "November 2001 ",
		"length": "7,000 km",
		"owners": "Telecom Italia Sparkle",
		"url": "http://www.mednautilus.com",
		"points": [
			[
				23.736254,
				37.976093
			],
			[
				15.067457,
				37.511603
			],
			[
				24.012217,
				35.511799
			],
			[
				34.998743,
				32.811396
			],
			[
				28.986079,
				41.040599
			],
			[
				33.603568,
				34.828466
			],
			[
				34.769661,
				32.044642
			]
		],
		"landingPointIds": [
			"3211",
			"3214",
			"5723",
			"3905",
			"3221",
			"5812",
			"3213"
		]
	},
	{
		"id": "1602",
		"name": "Melita 1",
		"rfs": "June 2009",
		"length": "97 km",
		"owners": "Melita",
		"url": "http://www.melita.com",
		"points": [
			[
				14.458812,
				35.934126
			],
			[
				14.853834,
				36.733707
			]
		],
		"landingPointIds": [
			"9028",
			"8972"
		]
	},
	{
		"id": "1070",
		"name": "Mid-Atlantic Crossing (MAC)",
		"rfs": "June 2000",
		"length": "7,500 km",
		"owners": "Level 3",
		"url": "http://www.level3.com",
		"points": [
			[
				-72.912288,
				40.773169
			],
			[
				-80.160211,
				26.010194
			],
			[
				-64.81941,
				17.771855
			]
		],
		"landingPointIds": [
			"4512",
			"3650",
			"5750"
		]
	},
	{
		"id": "1558",
		"name": "Middle East North Africa (MENA) Cable System/Gulf Bridge International",
		"rfs": "Q4 2012",
		"length": "8,000 km",
		"owners": "MENA,  Gulf Bridge International",
		"url": "http://www.mena-scs.com",
		"points": [
			[
				29.702539,
				31.071894
			],
			[
				58.176135,
				23.684634
			],
			[
				39.182762,
				21.481246
			],
			[
				12.591318,
				37.650037
			],
			[
				32.649894,
				29.116662
			]
		],
		"landingPointIds": [
			"9485",
			"7646",
			"4361",
			"3215",
			"9486"
		]
	},
	{
		"id": "1561",
		"name": "Moratelindo International Cable System-1 (MIC-1)",
		"rfs": "January 2008",
		"length": "70 km",
		"owners": "Moratelindo",
		"url": "http://www.moratelindo.co.id",
		"points": [
			[
				103.962529,
				1.13466
			],
			[
				103.987023,
				1.38904
			]
		],
		"landingPointIds": [
			"5862",
			"5937"
		]
	},
	{
		"id": "1203",
		"name": "NorSea Com",
		"rfs": "July 1999",
		"length": "930 km",
		"owners": "TeliaSonera",
		"url": "n.a.",
		"points": [
			[
				2.685104,
				58.92249
			],
			[
				3.210026,
				56.549146
			],
			[
				5.524392,
				59.279264
			],
			[
				1.729221,
				52.471336
			],
			[
				2.333449,
				54.266352
			],
			[
				2.847228,
				57.111111
			],
			[
				3.39534,
				56.278102
			]
		],
		"landingPointIds": [
			"7648",
			"7649",
			"5923",
			"3084",
			"7651",
			"7647",
			"7650"
		]
	},
	{
		"id": "1166",
		"name": "NorthStar",
		"rfs": "October 1999",
		"length": "3,229 km",
		"owners": "Alaska Communications Systems Group",
		"url": "http://www.acsalaska.com",
		"points": [
			[
				-123.811178,
				45.82483
			],
			[
				-134.74731,
				58.550958
			],
			[
				-146.353323,
				61.130396
			],
			[
				-148.684704,
				60.772919
			]
		],
		"landingPointIds": [
			"3649",
			"5765",
			"5764",
			"6255"
		]
	},
	{
		"id": "1695",
		"name": "OMRAN/EPEG Cable System",
		"rfs": "Q1 2013",
		"length": "600 km",
		"owners": "Omantel,  Vodafone",
		"url": "http://www.omantel.om",
		"points": [
			[
				58.004373,
				23.679414
			],
			[
				56.258046,
				25.616979
			],
			[
				57.797376,
				25.681226
			],
			[
				56.246802,
				26.181353
			]
		],
		"landingPointIds": [
			"8947",
			"10579",
			"6031",
			"7645"
		]
	},
	{
		"id": "1694",
		"name": "OptiKor",
		"rfs": "Q4 2013",
		"length": "3,000 km",
		"owners": "Axin Ltd.",
		"url": "n.a.",
		"points": [
			[
				174.770419,
				-36.88441
			],
			[
				151.20704,
				-33.869897
			]
		],
		"landingPointIds": [
			"3319",
			"3030"
		]
	},
	{
		"id": "1727",
		"name": "Pacific Caribbean Cable System (PCCS)",
		"rfs": "Q3 2014",
		"length": "6,000 km",
		"owners": "Cable & Wireless Communications,  Telconet,  Telefonica,  Setar,  United Telecommunication Services (UTS)",
		"url": "n.a.",
		"points": [
			[
				-79.566674,
				8.949969
			],
			[
				-75.505679,
				10.386704
			],
			[
				-70.050011,
				12.616594
			],
			[
				-81.655723,
				30.331743
			],
			[
				-80.716203,
				-0.949971
			],
			[
				-79.753544,
				9.437346
			],
			[
				-66.106669,
				18.465829
			],
			[
				-64.597254,
				18.414732
			]
		],
		"landingPointIds": [
			"8722",
			"5693",
			"10790",
			"3655",
			"8918",
			"5928",
			"4262",
			"9589"
		]
	},
	{
		"id": "1007",
		"name": "Pacific Crossing-1 (PC-1)",
		"rfs": "December 1999",
		"length": "20,900 km",
		"owners": "NTT",
		"url": "http://www.pc1.com",
		"points": [
			[
				140.612324,
				36.383558
			],
			[
				-120.62144,
				35.120592
			],
			[
				-122.302165,
				47.886272
			],
			[
				136.874423,
				34.336772
			]
		],
		"landingPointIds": [
			"5884",
			"5748",
			"3641",
			"5883"
		]
	},
	{
		"id": "1073",
		"name": "Pan American (PAN-AM)",
		"rfs": "February 1999",
		"length": "7,050 km",
		"owners": "AT&T,  Telefonica del Peru,  Softbank Telecom,  REACH,  Entel Chile,  Telecom Italia Sparkle,  Sprint,  CANTV,  Tata Communications,  Telef\u00f3nica de Argentina,  Telstra,  Verizon Business,  PCCW,  Telecom Argentina,  Telconet",
		"url": "n.a.",
		"points": [
			[
				-70.30675,
				-18.473782
			],
			[
				-69.96403,
				12.518115
			],
			[
				-74.779783,
				10.940437
			],
			[
				-79.900009,
				9.353724
			],
			[
				-76.874302,
				-12.278515
			],
			[
				-79.536709,
				8.964424
			],
			[
				-80.914417,
				-2.272968
			],
			[
				-70.204356,
				11.708596
			],
			[
				-64.81941,
				17.771855
			],
			[
				-64.904438,
				18.324484
			]
		],
		"landingPointIds": [
			"5800",
			"5776",
			"4315",
			"6093",
			"5930",
			"3334",
			"5824",
			"5965",
			"5750",
			"4359"
		]
	},
	{
		"id": "1539",
		"name": "Pan European Crossing (UK-Belgium)",
		"rfs": "1999",
		"length": "117 km",
		"owners": "Level 3",
		"url": "n.a.",
		"points": [
			[
				2.96192,
				51.246417
			],
			[
				1.439354,
				51.358549
			]
		],
		"landingPointIds": [
			"8396",
			"8397"
		]
	},
	{
		"id": "1547",
		"name": "Pan European Crossing (UK-Ireland)",
		"rfs": "September 2000",
		"length": "495 km",
		"owners": "Level 3",
		"url": "n.a.",
		"points": [
			[
				-6.364862,
				52.401467
			],
			[
				-6.558809,
				52.184029
			],
			[
				-4.544398,
				50.828106
			],
			[
				-5.698444,
				50.078518
			]
		],
		"landingPointIds": [
			"8407",
			"8406",
			"4554",
			"3081"
		]
	},
	{
		"id": "1072",
		"name": "Pan-American Crossing (PAC)",
		"rfs": "March 2000",
		"length": "10,000 km",
		"owners": "Level 3",
		"url": "http://www.level3.com",
		"points": [
			[
				-79.546748,
				8.934107
			],
			[
				-120.62144,
				35.120592
			],
			[
				-106.421885,
				23.199465
			],
			[
				-117.038185,
				32.530815
			],
			[
				-84.454254,
				9.525887
			]
		],
		"landingPointIds": [
			"5925",
			"5748",
			"3470",
			"3484",
			"7981"
		]
	},
	{
		"id": "1624",
		"name": "Pangea Baltic Ring",
		"rfs": "2000",
		"length": "550 km",
		"owners": "LinxTelecom",
		"url": "n.a.",
		"points": [
			[
				24.932463,
				60.1711
			],
			[
				18.062897,
				59.332168
			],
			[
				24.752369,
				59.436169
			]
		],
		"landingPointIds": [
			"3064",
			"3063",
			"3089"
		]
	},
	{
		"id": "1099",
		"name": "Pangea North",
		"rfs": "2000",
		"length": "n.a.",
		"owners": "n.a.",
		"url": "n.a.",
		"points": [
			[
				8.505678,
				55.458645
			],
			[
				-1.068206,
				54.613891
			]
		],
		"landingPointIds": [
			"3083",
			"3085"
		]
	},
	{
		"id": "1622",
		"name": "Pangea South",
		"rfs": "2000",
		"length": "225 km",
		"owners": "n.a.",
		"url": "n.a.",
		"points": [
			[
				4.746194,
				52.634666
			],
			[
				1.729221,
				52.471336
			]
		],
		"landingPointIds": [
			"3086",
			"3084"
		]
	},
	{
		"id": "1448",
		"name": "Pencan-6",
		"rfs": "2000",
		"length": "1,854 km",
		"owners": "Telefonica",
		"url": "n.a.",
		"points": [
			[
				-6.087192,
				36.276545
			],
			[
				-16.538606,
				28.046639
			]
		],
		"landingPointIds": [
			"5944",
			"5722"
		]
	},
	{
		"id": "1701",
		"name": "Pencan-8",
		"rfs": "2011",
		"length": "1,400 km",
		"owners": "Telefonica",
		"url": "n.a.",
		"points": [
			[
				-6.292734,
				36.52952
			],
			[
				-16.522745,
				28.292788
			]
		],
		"landingPointIds": [
			"4374",
			"7713"
		]
	},
	{
		"id": "1577",
		"name": "Persona",
		"rfs": "2008",
		"length": "800 km",
		"owners": "n.a.",
		"url": "n.a.",
		"points": [
			[
				-60.129592,
				46.252879
			],
			[
				-58.686583,
				47.617637
			]
		],
		"landingPointIds": [
			"9374",
			"9375"
		]
	},
	{
		"id": "1680",
		"name": "PGASCOM",
		"rfs": "2010",
		"length": "264 km",
		"owners": "PGASCOM",
		"url": "http://www.pgascom.co.id",
		"points": [
			[
				103.962529,
				1.13466
			],
			[
				103.466719,
				-0.816457
			],
			[
				103.704234,
				1.258838
			]
		],
		"landingPointIds": [
			"5862",
			"10283",
			"10307"
		]
	},
	{
		"id": "1520",
		"name": "Pipe Pacific Cable-1 (PPC-1)",
		"rfs": "October 2009",
		"length": "6,900 km",
		"owners": "Pipe Networks",
		"url": "http://www.pipeinternational.com",
		"points": [
			[
				145.784851,
				-5.233674
			],
			[
				144.694751,
				13.464662
			],
			[
				151.20704,
				-33.869897
			]
		],
		"landingPointIds": [
			"8558",
			"5973",
			"3030"
		]
	},
	{
		"id": "1689",
		"name": "Pishgaman Oman Iran (POI) Network",
		"rfs": "June 2012",
		"length": "400 km",
		"owners": "Pishgaman Kavir",
		"url": "http://www.pishgaman.com",
		"points": [
			[
				58.004373,
				23.679414
			],
			[
				60.629687,
				25.298251
			],
			[
				57.797376,
				25.681226
			]
		],
		"landingPointIds": [
			"8947",
			"8849",
			"6031"
		]
	},
	{
		"id": "1254",
		"name": "Qatar-UAE Submarine Cable System",
		"rfs": "December 2004",
		"length": "100 km",
		"owners": "Etisalat,  QTel",
		"url": "n.a.",
		"points": [
			[
				54.41896,
				24.443759
			],
			[
				52.865977,
				25.15259
			],
			[
				51.51939,
				25.294336
			],
			[
				52.42026,
				25.668578
			]
		],
		"landingPointIds": [
			"3858",
			"6020",
			"3867",
			"6019"
		]
	},
	{
		"id": "1518",
		"name": "Russia-Japan Cable Network (RJCN)",
		"rfs": "September 2008",
		"length": "1,800 km",
		"owners": "Rostelecom,  KDDI",
		"url": "n.a.",
		"points": [
			[
				132.874012,
				42.812325
			],
			[
				138.242092,
				37.169686
			]
		],
		"landingPointIds": [
			"5362",
			"5529"
		]
	},
	{
		"id": "1220",
		"name": "SAFE",
		"rfs": "April 2002",
		"length": "13,500 km",
		"owners": "France Telecom,  Telekom Malaysia,  Telkom South Africa,  Tata Communications,  AT&T,  BT,  Camtel,  Angola Telecom,  Ghana Telecommunications Company,  Mauritius Telecom,  Verizon Business,  Nitel,  OPT,  Telefonica,  Belgacom,  China Telecom,  Chunghwa,  Cote d\u2019Ivoire Telecom,  Maroc Telecom,  KT,  KPN,  REACH,  SingTel,  Sprint,  Telecom Italia Sparkle,  Telecom Namibia,  Telstra,  PCCW,  Sonatel,  Neotel,  Vodafone",
		"url": "http://www.safe-sat3.co.za",
		"points": [
			[
				57.485374,
				-20.473988
			],
			[
				76.269541,
				9.938075
			],
			[
				18.445772,
				-33.727247
			],
			[
				31.757858,
				-28.950645
			],
			[
				100.362961,
				5.353613
			],
			[
				55.279174,
				-21.000216
			]
		],
		"landingPointIds": [
			"5906",
			"4322",
			"5941",
			"5942",
			"3307",
			"5978"
		]
	},
	{
		"id": "1245",
		"name": "Saint Maarten Puerto Rico Network One (SMPR-1)",
		"rfs": "December 2004",
		"length": "374 km",
		"owners": "TelEm Group",
		"url": "http://www.telemgroup.an",
		"points": [
			[
				-66.016873,
				18.441736
			],
			[
				-63.073735,
				18.031054
			]
		],
		"landingPointIds": [
			"5773",
			"3188"
		]
	},
	{
		"id": "1620",
		"name": "Samoa-American Samoa (SAS)",
		"rfs": "May 2009",
		"length": "250 km",
		"owners": "American Samoa Government,  Elandia",
		"url": "n.a.",
		"points": [
			[
				-171.766679,
				-13.833706
			],
			[
				-170.695703,
				-14.276512
			]
		],
		"landingPointIds": [
			"5705",
			"9070"
		]
	},
	{
		"id": "1219",
		"name": "SAT-3/WASC",
		"rfs": "April 2002",
		"length": "14,350 km",
		"owners": "Telkom South Africa,  Tata Communications,  AT&T,  BT,  Camtel,  Angola Telecom,  Ghana Telecommunications Company,  Mauritius Telecom,  Verizon Business,  Nitel,  OPT,  Belgacom,  Sprint,  SingTel,  KPN,  REACH,  France Telecom,  Telecom Italia Sparkle,  Telecom Namibia,  Telekom Malaysia,  Telefonica,  China Telecom,  Chunghwa,  Cote d\u2019Ivoire Telecom,  Deutsche Telekom,  Maroc Telecom,  KT,  Portugal Telecom,  PCCW,  Telstra,  Cytaglobal,  Neotel,  Vodafone",
		"url": "http://www.safe-sat3.co.za",
		"points": [
			[
				-4.026252,
				5.323497
			],
			[
				-0.201065,
				5.558302
			],
			[
				-15.699976,
				27.999558
			],
			[
				13.372327,
				-8.776624
			],
			[
				2.439909,
				6.356577
			],
			[
				-17.451925,
				14.686669
			],
			[
				9.706303,
				4.04718
			],
			[
				3.423247,
				6.438895
			],
			[
				9.454332,
				0.394308
			],
			[
				18.445772,
				-33.727247
			],
			[
				-9.10276,
				38.44269
			]
		],
		"landingPointIds": [
			"3316",
			"4181",
			"10726",
			"5775",
			"3315",
			"4180",
			"4210",
			"3280",
			"4221",
			"5941",
			"5934"
		]
	},
	{
		"id": "1247",
		"name": "Saudi Arabia-Sudan-1 (SAS-1)",
		"rfs": "April 2003",
		"length": "333 km",
		"owners": "Sudan Telecom Company,  Saudi Telecom,  The Arab Investment Company",
		"url": "n.a.",
		"points": [
			[
				39.182762,
				21.481246
			],
			[
				37.2197,
				19.615558
			]
		],
		"landingPointIds": [
			"4361",
			"5950"
		]
	},
	{
		"id": "1675",
		"name": "Saudi Arabia-Sudan-2 (SAS-2)",
		"rfs": "July 2011",
		"length": "330 km",
		"owners": "Sudan Telecom Company,  Saudi Telecom",
		"url": "n.a.",
		"points": [
			[
				39.182762,
				21.481246
			],
			[
				37.2197,
				19.615558
			]
		],
		"landingPointIds": [
			"4361",
			"5950"
		]
	},
	{
		"id": "1544",
		"name": "Scandinavian Ring North",
		"rfs": "2000",
		"length": "5 km",
		"owners": "TeliaSonera",
		"url": "n.a.",
		"points": [
			[
				12.69582,
				56.043799
			],
			[
				12.592121,
				56.030448
			]
		],
		"landingPointIds": [
			"3268",
			"6065"
		]
	},
	{
		"id": "1545",
		"name": "Scandinavian Ring South",
		"rfs": "2000",
		"length": "21 km",
		"owners": "TeliaSonera",
		"url": "n.a.",
		"points": [
			[
				12.918779,
				55.556823
			],
			[
				12.670222,
				55.593565
			]
		],
		"landingPointIds": [
			"8401",
			"8400"
		]
	},
	{
		"id": "1728",
		"name": "Seabras-1",
		"rfs": "Q1 2015",
		"length": "10,500 km",
		"owners": "n.a.",
		"url": "http://www.seabornnetworks.com",
		"points": [
			[
				-38.542979,
				-3.718838
			],
			[
				-74.005952,
				40.714342
			],
			[
				-46.328071,
				-23.961926
			]
		],
		"landingPointIds": [
			"3347",
			"3715",
			"3411"
		]
	},
	{
		"id": "1552",
		"name": "SEACOM/Tata TGN-Eurasia",
		"rfs": "July 2009",
		"length": "15,000 km",
		"owners": "Industrial Promotion Services,  Remgro Limited,  Herakles Telecom LLC,  Convergence Partners,  Shanduka,  Tata Communications",
		"url": "http://www.seacom.mu",
		"points": [
			[
				39.269697,
				-6.823198
			],
			[
				43.148039,
				11.594657
			],
			[
				32.580627,
				-25.968556
			],
			[
				39.67285,
				-4.053227
			],
			[
				31.757858,
				-28.950645
			],
			[
				72.875866,
				19.075779
			],
			[
				32.649894,
				29.116662
			]
		],
		"landingPointIds": [
			"4182",
			"4177",
			"4252",
			"5896",
			"5942",
			"3212",
			"9486"
		]
	},
	{
		"id": "1031",
		"name": "SeaMeWe-3",
		"rfs": "September 1999",
		"length": "39,000 km",
		"owners": "REACH,  France Telecom,  BT,  KDDI,  SingTel,  Telecom Italia Sparkle,  Telekom Malaysia,  OTE,  AT&T,  Belgacom,  Communications Authority of Thailand,  China Telecom,  Deutsche Telekom,  Etisalat,  Telecom Egypt,  CTM,  PT Indonesia Satellite Corp.,  Jabatan Telecom Brunei,  KT,  Portugal Telecom,  Maroc Telecom,  PLDT,  OPT,  Saudi Telecom,  Sri Lanka Telecom,  Turk Telekom,  Tata Communications,  Chunghwa,  Verizon Business,  KPN,  Telekom Austria,  SingTel Optus,  Telstra,  Vietnam Telecom International,  Omantel,  PCCW,  Pakistan Telecommunications Company Ltd.,  Cytaglobal,  eircom,  LG Uplus,  Softbank Telecom,  Telkom South Africa,  Rostelecom,  TPSA,  SingTel Optus,  Telecom Argentina,  Telecom New Zealand",
		"url": "http://www.seamewe3.com",
		"points": [
			[
				29.889861,
				31.191856
			],
			[
				106.833389,
				-6.129325
			],
			[
				121.065017,
				13.765521
			],
			[
				24.012217,
				35.511799
			],
			[
				76.269541,
				9.938075
			],
			[
				108.214811,
				16.051528
			],
			[
				114.184008,
				22.249405
			],
			[
				43.148039,
				11.594657
			],
			[
				120.662165,
				22.249204
			],
			[
				56.333737,
				25.121671
			],
			[
				-5.174526,
				50.024811
			],
			[
				39.182762,
				21.481246
			],
			[
				67.028539,
				24.889376
			],
			[
				128.620826,
				34.880668
			],
			[
				28.253658,
				36.855275
			],
			[
				12.591318,
				37.650037
			],
			[
				98.676063,
				3.751742
			],
			[
				103.849895,
				2.295532
			],
			[
				79.866799,
				6.832712
			],
			[
				72.875866,
				19.075779
			],
			[
				58.591033,
				23.615167
			],
			[
				7.201855,
				53.595467
			],
			[
				127.680604,
				26.212373
			],
			[
				2.91263,
				51.231159
			],
			[
				100.362961,
				5.353613
			],
			[
				-4.338706,
				47.811283
			],
			[
				115.857254,
				-31.953413
			],
			[
				95.682028,
				16.282216
			],
			[
				100.066118,
				6.613166
			],
			[
				-9.10276,
				38.44269
			],
			[
				121.472487,
				31.247571
			],
			[
				116.675506,
				23.354563
			],
			[
				32.530133,
				29.972258
			],
			[
				113.561007,
				22.156146
			],
			[
				121.801454,
				24.863576
			],
			[
				103.647114,
				1.338244
			],
			[
				114.885811,
				4.926367
			],
			[
				-5.391813,
				35.565908
			],
			[
				32.466588,
				34.766427
			]
		],
		"landingPointIds": [
			"6044",
			"5860",
			"3218",
			"5723",
			"4322",
			"5986",
			"5853",
			"4177",
			"5980",
			"5962",
			"3292",
			"4361",
			"3259",
			"5975",
			"5959",
			"3215",
			"5861",
			"5902",
			"5949",
			"3212",
			"4225",
			"5840",
			"5886",
			"5789",
			"3307",
			"3119",
			"3239",
			"5911",
			"5956",
			"5934",
			"3246",
			"5803",
			"5825",
			"5900",
			"5981",
			"5938",
			"5970",
			"5909",
			"5811"
		]
	},
	{
		"id": "1035",
		"name": "SeaMeWe-4",
		"rfs": "December 2005",
		"length": "20,000 km",
		"owners": "Bangladesh Telegraph & Telephone Board,  France Telecom,  SingTel,  Telecom Italia Sparkle,  Tata Communications,  PT Indonesia Satellite Corp.,  Telekom Malaysia,  airtel (Bharti),  Sri Lanka Telecom,  Etisalat,  Saudi Telecom,  Communications Authority of Thailand,  Tunisia Telecom,  Verizon Business,  PCCW,  Pakistan Telecommunications Company Ltd.,  Telecom Egypt",
		"url": "http://www.seamewe4.com",
		"points": [
			[
				29.889861,
				31.191856
			],
			[
				7.755488,
				36.902356
			],
			[
				9.867323,
				37.276397
			],
			[
				80.243049,
				13.063516
			],
			[
				79.872019,
				6.926774
			],
			[
				91.994923,
				21.429245
			],
			[
				56.333737,
				25.121671
			],
			[
				39.182762,
				21.481246
			],
			[
				67.028539,
				24.889376
			],
			[
				5.372607,
				43.293177
			],
			[
				102.220919,
				2.273146
			],
			[
				72.875866,
				19.075779
			],
			[
				13.358373,
				38.121453
			],
			[
				100.066118,
				6.613166
			],
			[
				32.530133,
				29.972258
			],
			[
				103.647114,
				1.338244
			]
		],
		"landingPointIds": [
			"6044",
			"4196",
			"5958",
			"4191",
			"3887",
			"6299",
			"5962",
			"4361",
			"3259",
			"3210",
			"6300",
			"3212",
			"3177",
			"5956",
			"5825",
			"5938"
		]
	},
	{
		"id": "1672",
		"name": "Seychelles to East Africa System (SEAS)",
		"rfs": "August 2012",
		"length": "1,930 km",
		"owners": "Seychelles Cable System Ltd.",
		"url": "n.a.",
		"points": [
			[
				39.269697,
				-6.823198
			],
			[
				55.445013,
				-4.617601
			]
		],
		"landingPointIds": [
			"4182",
			"4362"
		]
	},
	{
		"id": "1576",
		"name": "SHEFA-2",
		"rfs": "March 2008",
		"length": "1,000 km",
		"owners": "Faroese Telecom",
		"url": "http://www.shefa.fo",
		"points": [
			[
				-2.900114,
				58.833246
			],
			[
				-2.523663,
				57.666852
			],
			[
				-2.399937,
				60.74993
			],
			[
				-1.323791,
				60.003956
			],
			[
				-1.238663,
				59.996026
			],
			[
				-4.333436,
				60.333124
			],
			[
				-6.77183,
				62.017513
			]
		],
		"landingPointIds": [
			"8682",
			"8680",
			"10354",
			"8684",
			"8683",
			"10353",
			"8681"
		]
	},
	{
		"id": "1665",
		"name": "Silphium",
		"rfs": "January 2013",
		"length": "425 km",
		"owners": "Libya International Telecommunications Company",
		"url": "http://www.litc.ly",
		"points": [
			[
				24.012217,
				35.511799
			],
			[
				22.639228,
				32.763612
			]
		],
		"landingPointIds": [
			"5723",
			"7873"
		]
	},
	{
		"id": "1092",
		"name": "Sirius",
		"rfs": "1998",
		"length": "353 km",
		"owners": "Virgin Media Business",
		"url": "n.a.",
		"points": [
			[
				-3.050744,
				53.808689
			],
			[
				-6.248262,
				53.348014
			]
		],
		"landingPointIds": [
			"8408",
			"3077"
		]
	},
	{
		"id": "1205",
		"name": "Solas",
		"rfs": "April 1999",
		"length": "200 km",
		"owners": "eircom,  Vodafone",
		"url": "n.a.",
		"points": [
			[
				-6.584106,
				52.174593
			],
			[
				-4.169604,
				51.557817
			]
		],
		"landingPointIds": [
			"5863",
			"3145"
		]
	},
	{
		"id": "1736",
		"name": "Solomons Oceanic Cable Network",
		"rfs": "2014",
		"length": "900 km",
		"owners": "Solomon Islands National Provident Fund,  Solomon Telekom Company Limited",
		"url": "n.a.",
		"points": [
			[
				160.700012,
				-8.766686
			],
			[
				159.948316,
				-9.430342
			],
			[
				157.199928,
				-8.241061
			]
		],
		"landingPointIds": [
			"10893",
			"10892",
			"10984"
		]
	},
	{
		"id": "1083",
		"name": "South America-1 (SAm-1)",
		"rfs": "March 2001",
		"length": "25,000 km",
		"owners": "Telefonica",
		"url": "http://www.globalsolutions.telefonica.com",
		"points": [
			[
				-70.30675,
				-18.473782
			],
			[
				-74.779783,
				10.940437
			],
			[
				-80.088937,
				26.350304
			],
			[
				-38.542979,
				-3.718838
			],
			[
				-56.695512,
				-36.472523
			],
			[
				-76.874302,
				-12.278515
			],
			[
				-81.053804,
				-4.154015
			],
			[
				-88.597215,
				15.727178
			],
			[
				-90.822237,
				13.934572
			],
			[
				-80.914417,
				-2.272968
			],
			[
				-43.209557,
				-22.903448
			],
			[
				-38.504631,
				-12.969979
			],
			[
				-66.106669,
				18.465829
			],
			[
				-46.328071,
				-23.961926
			],
			[
				-71.620512,
				-33.045822
			]
		],
		"landingPointIds": [
			"5800",
			"4315",
			"3563",
			"3347",
			"3330",
			"5930",
			"8484",
			"5848",
			"5849",
			"5824",
			"3242",
			"3342",
			"4262",
			"3411",
			"3331"
		]
	},
	{
		"id": "1084",
		"name": "South American Crossing (SAC)/Latin American Nautilus (LAN)",
		"rfs": "September 2000",
		"length": "20,000 km",
		"owners": "Level 3",
		"url": "http://www.level3.com",
		"points": [
			[
				-79.900009,
				9.353724
			],
			[
				-79.546748,
				8.934107
			],
			[
				-38.542979,
				-3.718838
			],
			[
				-56.695512,
				-36.472523
			],
			[
				-76.874302,
				-12.278515
			],
			[
				-62.473924,
				10.722397
			],
			[
				-43.209557,
				-22.903448
			],
			[
				-46.328071,
				-23.961926
			],
			[
				-64.81941,
				17.771855
			],
			[
				-71.620512,
				-33.045822
			]
		],
		"landingPointIds": [
			"6093",
			"5925",
			"3347",
			"3330",
			"5930",
			"5967",
			"3242",
			"3411",
			"5750",
			"3331"
		]
	},
	{
		"id": "1709",
		"name": "South Atlantic Cable System (SACS)-Africa",
		"rfs": "Q4 2014",
		"length": "6,500 km",
		"owners": "Telebras,  Angola Cables",
		"url": "http://www.angolacables.co.ao",
		"points": [
			[
				-38.542979,
				-3.718838
			],
			[
				13.234998,
				-8.812863
			]
		],
		"landingPointIds": [
			"3347",
			"4190"
		]
	},
	{
		"id": "1732",
		"name": "South Atlantic Cable System (SACS)-Brazil",
		"rfs": "n.a.",
		"length": "n.a.",
		"owners": "Telebras",
		"url": "http://www.telebras.com.br",
		"points": [
			[
				-38.542979,
				-3.718838
			],
			[
				-46.328071,
				-23.961926
			]
		],
		"landingPointIds": [
			"3347",
			"3411"
		]
	},
	{
		"id": "1725",
		"name": "South Atlantic Cable System (SACS)-Europe",
		"rfs": "n.a.",
		"length": "n.a.",
		"owners": "Telebras,  IslaLink",
		"url": "http://www.telebras.com.br",
		"points": [
			[
				-38.542979,
				-3.718838
			],
			[
				-16.522745,
				28.292788
			]
		],
		"landingPointIds": [
			"3347",
			"7713"
		]
	},
	{
		"id": "1724",
		"name": "South Atlantic Cable System (SACS)-South America",
		"rfs": "n.a.",
		"length": "n.a.",
		"owners": "Telebras",
		"url": "http://www.telebras.com.br",
		"points": [
			[
				-56.695512,
				-36.472523
			],
			[
				-54.950189,
				-34.900367
			],
			[
				-46.328071,
				-23.961926
			]
		],
		"landingPointIds": [
			"3330",
			"5963",
			"3411"
		]
	},
	{
		"id": "1726",
		"name": "South Atlantic Cable System (SACS)-United States",
		"rfs": "n.a.",
		"length": "n.a.",
		"owners": "Telebras,  Angola Cables",
		"url": "http://www.telebras.com.br",
		"points": [
			[
				-80.088937,
				26.350304
			],
			[
				-38.542979,
				-3.718838
			]
		],
		"landingPointIds": [
			"3563",
			"3347"
		]
	},
	{
		"id": "1669",
		"name": "South Atlantic Express (SAEx)",
		"rfs": "Q1 2015",
		"length": "10,350 km",
		"owners": "eFive Telecoms",
		"url": "http://efive.co.za",
		"points": [
			[
				27.866667,
				-32.983281
			],
			[
				-38.542979,
				-3.718838
			],
			[
				-5.704668,
				-15.922152
			],
			[
				31.757858,
				-28.950645
			],
			[
				25.569918,
				-33.932638
			],
			[
				18.155554,
				-33.348187
			]
		],
		"landingPointIds": [
			"9248",
			"3347",
			"10722",
			"5942",
			"8847",
			"9844"
		]
	},
	{
		"id": "1604",
		"name": "Southeast Asia Japan Cable (SJC)",
		"rfs": "Q3 2013",
		"length": "8,900 km",
		"owners": "Globe Telecom,  Google,  KDDI,  Telkom Indonesia,  SingTel,  China Telecom,  TOT,  China Mobile,  Chunghwa,  Brunei International Gateway",
		"url": "n.a.",
		"points": [
			[
				139.95469,
				34.976637
			],
			[
				114.205691,
				22.225011
			],
			[
				120.695794,
				14.317347
			],
			[
				116.675506,
				23.354563
			],
			[
				100.596963,
				7.078459
			],
			[
				114.570597,
				4.70371
			],
			[
				103.647114,
				1.338244
			]
		],
		"landingPointIds": [
			"5885",
			"5856",
			"9603",
			"5803",
			"4265",
			"10309",
			"5938"
		]
	},
	{
		"id": "1009",
		"name": "Southern Cross Cable Network",
		"rfs": "November 2000",
		"length": "30,500 km",
		"owners": "Telecom New Zealand,  SingTel Optus,  Verizon Business",
		"url": "http://www.southerncrosscables.com",
		"points": [
			[
				151.196198,
				-33.913966
			],
			[
				151.273898,
				-33.761178
			],
			[
				-123.811178,
				45.82483
			],
			[
				-158.130545,
				21.354056
			],
			[
				-120.847209,
				35.36674
			],
			[
				-155.822051,
				20.023128
			],
			[
				178.437446,
				-18.123834
			],
			[
				174.767909,
				-36.787938
			],
			[
				174.623453,
				-36.788842
			]
		],
		"landingPointIds": [
			"6097",
			"5781",
			"3649",
			"5753",
			"5751",
			"5752",
			"4268",
			"5918",
			"5919"
		]
	},
	{
		"id": "1612",
		"name": "Suriname-Guyana Submarine Cable System (SG-SCS)",
		"rfs": "July 2010",
		"length": "1,241 km",
		"owners": "Guyana Telephone and Telegraph (GT&T),  Telesur",
		"url": "n.a.",
		"points": [
			[
				-61.650803,
				10.686157
			],
			[
				-58.154935,
				6.804102
			],
			[
				-56.375379,
				5.886567
			]
		],
		"landingPointIds": [
			"8838",
			"3904",
			"9669"
		]
	},
	{
		"id": "1651",
		"name": "Svalbard Undersea Cable System",
		"rfs": "January 2004",
		"length": "2,714 km",
		"owners": "Telenor",
		"url": "n.a.",
		"points": [
			[
				16.553181,
				68.734993
			],
			[
				15.648797,
				78.218528
			]
		],
		"landingPointIds": [
			"9671",
			"9672"
		]
	},
	{
		"id": "1221",
		"name": "Sweden-Estonia (EE-S 1)",
		"rfs": "June 1995",
		"length": "240 km",
		"owners": "TeliaSonera,  Elion,  GN Great Nordic",
		"url": "n.a.",
		"points": [
			[
				22.738008,
				59.000892
			],
			[
				18.764601,
				59.822758
			],
			[
				24.752369,
				59.436169
			]
		],
		"landingPointIds": [
			"5828",
			"5952",
			"3089"
		]
	},
	{
		"id": "1207",
		"name": "Sweden-Finland 4 (SFS-4)",
		"rfs": "December 1993",
		"length": "254 km",
		"owners": "TeliaSonera,  Elisa",
		"url": "http://www.telia.se",
		"points": [
			[
				18.701357,
				59.759615
			],
			[
				22.259264,
				60.449272
			]
		],
		"landingPointIds": [
			"6171",
			"3126"
		]
	},
	{
		"id": "1340",
		"name": "Sweden-Finland 6",
		"rfs": "January 1998",
		"length": "175 km",
		"owners": "TeliaSonera",
		"url": "n.a.",
		"points": [
			[
				22.301025,
				60.306622
			],
			[
				18.062897,
				59.332168
			]
		],
		"landingPointIds": [
			"6083",
			"3063"
		]
	},
	{
		"id": "1208",
		"name": "Sweden-Finland Link (SFL)",
		"rfs": "1994",
		"length": "142 km",
		"owners": "TeliaSonera,  Elisa,  Vodafone",
		"url": "n.a.",
		"points": [
			[
				19.93782,
				60.11388
			],
			[
				18.816601,
				59.983377
			]
		],
		"landingPointIds": [
			"5830",
			"6000"
		]
	},
	{
		"id": "1128",
		"name": "TAGIDE 2",
		"rfs": "1996",
		"length": "1,586 km",
		"owners": "AT&T",
		"url": "n.a.",
		"points": [
			[
				-4.338706,
				47.811283
			],
			[
				-9.10276,
				38.44269
			]
		],
		"landingPointIds": [
			"3119",
			"5934"
		]
	},
	{
		"id": "1229",
		"name": "Taino-Carib",
		"rfs": "December 1992",
		"length": "186 km",
		"owners": "AT&T,  Cable & Wireless Communications,  Telecom Argentina",
		"url": "n.a.",
		"points": [
			[
				-66.077959,
				18.459906
			],
			[
				-66.016873,
				18.441736
			],
			[
				-64.937114,
				18.372971
			]
		],
		"landingPointIds": [
			"6084",
			"5773",
			"5758"
		]
	},
	{
		"id": "1636",
		"name": "Taiwan Strait Express-1 (TSE)-1",
		"rfs": "January 2013",
		"length": "260 km",
		"owners": "China Unicom,  Far Eastone Telecommunications,  Taiwan Mobile,  China Telecom,  Chunghwa,  China Mobile",
		"url": "n.a.",
		"points": [
			[
				119.30323,
				26.071129
			],
			[
				121.462649,
				25.1813
			]
		],
		"landingPointIds": [
			"8620",
			"5982"
		]
	},
	{
		"id": "1713",
		"name": "Tamares North",
		"rfs": "January 2012",
		"length": "345 km",
		"owners": "Tamares UK Group",
		"url": "http://www.tamarestelecom.com",
		"points": [
			[
				34.998743,
				32.811396
			],
			[
				32.491986,
				34.916405
			]
		],
		"landingPointIds": [
			"3905",
			"9246"
		]
	},
	{
		"id": "1324",
		"name": "Tangerine",
		"rfs": "September 2000",
		"length": "112 km",
		"owners": "Level 3",
		"url": "n.a.",
		"points": [
			[
				1.439455,
				51.35885
			],
			[
				2.91263,
				51.231159
			]
		],
		"landingPointIds": [
			"6033",
			"5789"
		]
	},
	{
		"id": "1750",
		"name": "Tasman Global Access (TGA) Cable",
		"rfs": "Q4 2014",
		"length": "n.a.",
		"owners": "n.a.",
		"url": "n.a.",
		"points": [
			[
				174.770419,
				-36.88441
			],
			[
				151.20704,
				-33.869897
			]
		],
		"landingPointIds": [
			"3319",
			"3030"
		]
	},
	{
		"id": "1135",
		"name": "Tasman-2",
		"rfs": "1992",
		"length": "2,400 km",
		"owners": "REACH,  Telecom New Zealand,  Telstra,  PCCW",
		"url": "n.a.",
		"points": [
			[
				174.770419,
				-36.88441
			],
			[
				151.228623,
				-33.882144
			]
		],
		"landingPointIds": [
			"3319",
			"5779"
		]
	},
	{
		"id": "1043",
		"name": "TAT-14",
		"rfs": "April 2001",
		"length": "15,295 km",
		"owners": "BT,  Verizon Business,  Deutsche Telekom,  France Telecom,  Sprint,  TeliaSonera,  Level 3,  KPN,  Telenor,  Etisalat,  OTE,  SingTel,  KDDI,  Starhub,  Softbank Telecom,  AboveNet,  Portugal Telecom,  Slovak Telekom,  TDC,  Telus,  Tata Communications,  Telefonica,  AT&T,  Belgacom,  Elisa,  Cytaglobal,  Rostelecom,  Vodafone",
		"url": "https://www.tat-14.com",
		"points": [
			[
				8.328997,
				55.751574
			],
			[
				-4.544398,
				50.828106
			],
			[
				4.396447,
				52.205211
			],
			[
				-74.04706,
				40.123365
			],
			[
				7.201855,
				53.595467
			],
			[
				0.708439,
				49.860478
			],
			[
				-74.337931,
				39.603864
			]
		],
		"landingPointIds": [
			"5818",
			"4554",
			"3283",
			"3686",
			"5840",
			"5331",
			"3808"
		]
	},
	{
		"id": "1149",
		"name": "Tata TGN-Atlantic",
		"rfs": "June 2001",
		"length": "13,000 km",
		"owners": "Tata Communications",
		"url": "http://www.tatacommunications.com",
		"points": [
			[
				-2.975002,
				51.222224
			],
			[
				-4.227829,
				51.11983
			],
			[
				-74.062871,
				40.152879
			]
		],
		"landingPointIds": [
			"5745",
			"5744",
			"3822"
		]
	},
	{
		"id": "1631",
		"name": "Tata TGN-Gulf",
		"rfs": "February 2012",
		"length": "4,031 km",
		"owners": "Tata Communications",
		"url": "http://www.tatacommunications.com",
		"points": [
			[
				50.214262,
				26.286157
			],
			[
				51.51939,
				25.294336
			],
			[
				50.575855,
				26.229037
			],
			[
				55.308487,
				25.26934
			],
			[
				56.333737,
				25.121671
			],
			[
				58.591033,
				23.615167
			]
		],
		"landingPointIds": [
			"7729",
			"10682",
			"10683",
			"3270",
			"5962",
			"10684"
		]
	},
	{
		"id": "1534",
		"name": "Tata TGN-Intra Asia (TGN-IA)",
		"rfs": "March 2009",
		"length": "6,700 km",
		"owners": "Tata Communications",
		"url": "http://www.tatacommunications.com",
		"points": [
			[
				121.514047,
				18.409411
			],
			[
				103.987023,
				1.38904
			],
			[
				114.184008,
				22.249405
			],
			[
				107.079236,
				10.341931
			]
		],
		"landingPointIds": [
			"8541",
			"5937",
			"5853",
			"6013"
		]
	},
	{
		"id": "1155",
		"name": "Tata TGN-Pacific",
		"rfs": "December 2002",
		"length": "22,300 km",
		"owners": "Tata Communications",
		"url": "http://www.tatacommunications.com",
		"points": [
			[
				140.0611,
				35.062368
			],
			[
				-123.811178,
				45.82483
			],
			[
				-118.245336,
				34.05338
			],
			[
				144.694751,
				13.464662
			],
			[
				137.391515,
				34.769038
			]
		],
		"landingPointIds": [
			"5894",
			"3649",
			"3678",
			"5973",
			"5893"
		]
	},
	{
		"id": "1252",
		"name": "Tata TGN-Tata Indicom",
		"rfs": "November 2004",
		"length": "3,175 km",
		"owners": "Tata Communications",
		"url": "http://www.tatacommunications.com",
		"points": [
			[
				103.987023,
				1.38904
			],
			[
				80.243049,
				13.063516
			]
		],
		"landingPointIds": [
			"5937",
			"4191"
		]
	},
	{
		"id": "1173",
		"name": "Tata TGN-Western Europe",
		"rfs": "June 2002",
		"length": "3,578 km",
		"owners": "Tata Communications",
		"url": "http://www.tatacommunications.com",
		"points": [
			[
				-2.946141,
				43.268382
			],
			[
				-2.975002,
				51.222224
			],
			[
				-9.150142,
				38.725681
			],
			[
				-4.227829,
				51.11983
			]
		],
		"landingPointIds": [
			"3067",
			"5745",
			"3146",
			"5744"
		]
	},
	{
		"id": "1573",
		"name": "TE North/TGN-Eurasia/SEACOM/Alexandros",
		"rfs": "July 2011",
		"length": "3,634 km",
		"owners": "Telecom Egypt,  Cytaglobal,  SEACOM,  Tata Communications",
		"url": "http://www.telecomegypt.com.eg",
		"points": [
			[
				29.702539,
				31.071894
			],
			[
				5.372607,
				43.293177
			],
			[
				33.603568,
				34.828466
			]
		],
		"landingPointIds": [
			"9485",
			"3210",
			"5812"
		]
	},
	{
		"id": "1526",
		"name": "Telstra Endeavour",
		"rfs": "September 2008",
		"length": "9,125 km",
		"owners": "Telstra",
		"url": "http://www.telstrawholesale.com",
		"points": [
			[
				-158.151726,
				21.425732
			],
			[
				151.228623,
				-33.882144
			]
		],
		"landingPointIds": [
			"5754",
			"5779"
		]
	},
	{
		"id": "1238",
		"name": "Thailand-Indonesia-Singapore (TIS)",
		"rfs": "November 2003",
		"length": "968 km",
		"owners": "SingTel,  Communications Authority of Thailand,  Telkom Indonesia",
		"url": "n.a.",
		"points": [
			[
				103.962529,
				1.13466
			],
			[
				103.987023,
				1.38904
			],
			[
				100.596963,
				7.078459
			]
		],
		"landingPointIds": [
			"5862",
			"5937",
			"4265"
		]
	},
	{
		"id": "1516",
		"name": "The East African Marine System (TEAMS)",
		"rfs": "October 2009",
		"length": "4,900 km",
		"owners": "Etisalat,  TEAMS Ltd.",
		"url": "n.a.",
		"points": [
			[
				56.333737,
				25.121671
			],
			[
				39.67285,
				-4.053227
			]
		],
		"landingPointIds": [
			"5962",
			"5896"
		]
	},
	{
		"id": "1687",
		"name": "Tonga Cable",
		"rfs": "July 2013",
		"length": "827 km",
		"owners": "Tonga Communications Corporation,  Government of Tonga",
		"url": "http://www.tongacable.net",
		"points": [
			[
				-175.200006,
				-21.133329
			],
			[
				178.437446,
				-18.123834
			]
		],
		"landingPointIds": [
			"10315",
			"4268"
		]
	},
	{
		"id": "1513",
		"name": "Trans-Pacific Express (TPE) Cable System",
		"rfs": "August 2008",
		"length": "17,000 km",
		"owners": "China Telecom,  China Unicom,  Chunghwa,  KT,  Verizon Business,  NTT,  AT&T",
		"url": "http://tpecable.org",
		"points": [
			[
				121.395289,
				31.619905
			],
			[
				128.620826,
				34.880668
			],
			[
				139.81696,
				35.037472
			],
			[
				-123.940125,
				45.643733
			],
			[
				120.342634,
				36.087115
			],
			[
				121.462649,
				25.1813
			]
		],
		"landingPointIds": [
			"5802",
			"5975",
			"5887",
			"3711",
			"6012",
			"5982"
		]
	},
	{
		"id": "1351",
		"name": "Transworld (TW1)",
		"rfs": "June 2006",
		"length": "1,300 km",
		"owners": "Orascom Telecom Media and Technology,  Orastar Limited,  Omzest Group",
		"url": "http://www.tw1.com",
		"points": [
			[
				58.176135,
				23.684634
			],
			[
				56.333737,
				25.121671
			],
			[
				67.028539,
				24.889376
			]
		],
		"landingPointIds": [
			"7646",
			"5962",
			"3259"
		]
	},
	{
		"id": "1555",
		"name": "Trapani-Kelibia",
		"rfs": "November 1995",
		"length": "209 km",
		"owners": "Tunisia Telecom,  Telecom Italia Sparkle",
		"url": "n.a.",
		"points": [
			[
				11.089934,
				36.849352
			],
			[
				12.513618,
				38.017954
			]
		],
		"landingPointIds": [
			"6015",
			"5876"
		]
	},
	{
		"id": "1341",
		"name": "Turcyos-1",
		"rfs": "1993",
		"length": "110 km",
		"owners": "Turk Telekom",
		"url": "n.a.",
		"points": [
			[
				33.236354,
				35.29908
			],
			[
				34.633336,
				36.799962
			]
		],
		"landingPointIds": [
			"9661",
			"9080"
		]
	},
	{
		"id": "1705",
		"name": "Turcyos-2",
		"rfs": "March 2011",
		"length": "213 km",
		"owners": "Turk Telekom",
		"url": "http://www.turktelekom.com.tr",
		"points": [
			[
				35.999298,
				36.082297
			],
			[
				33.896898,
				35.297273
			]
		],
		"landingPointIds": [
			"10382",
			"10388"
		]
	},
	{
		"id": "1308",
		"name": "UAE-Iran",
		"rfs": "1992",
		"length": "170 km",
		"owners": "Etisalat,  Telecommunication Infrastructure Company of Iran",
		"url": "n.a.",
		"points": [
			[
				56.333737,
				25.121671
			],
			[
				57.797376,
				25.681226
			]
		],
		"landingPointIds": [
			"5962",
			"6031"
		]
	},
	{
		"id": "1306",
		"name": "UGARIT",
		"rfs": "February 1995",
		"length": "239 km",
		"owners": "Cytaglobal,  Tata Communications,  Telecom Italia Sparkle,  BT,  Telekom Austria,  OTE,  AT&T,  Deutsche Telekom,  France Telecom,  Orange Jordan,  Lebanese Ministry of Telecommunications,  SingTel,  Telefonica,  Syrian Telecommunications Establishment,  Vivacom",
		"url": "n.a.",
		"points": [
			[
				33.603568,
				34.828466
			],
			[
				35.897807,
				34.89171
			]
		],
		"landingPointIds": [
			"5812",
			"6030"
		]
	},
	{
		"id": "1703",
		"name": "UK-Channel Islands-7",
		"rfs": "January 1994",
		"length": "124 km",
		"owners": "n.a.",
		"url": "n.a.",
		"points": [
			[
				-3.578377,
				50.351771
			],
			[
				-2.533451,
				49.503402
			]
		],
		"landingPointIds": [
			"10381",
			"10380"
		]
	},
	{
		"id": "1704",
		"name": "UK-Channel Islands-8",
		"rfs": "January 1994",
		"length": "237 km",
		"owners": "n.a.",
		"url": "n.a.",
		"points": [
			[
				-5.174526,
				50.024811
			],
			[
				-2.225916,
				49.215694
			]
		],
		"landingPointIds": [
			"3292",
			"10379"
		]
	},
	{
		"id": "1314",
		"name": "UK-France 3",
		"rfs": "1989",
		"length": "155 km",
		"owners": "BT,  France Telecom,  Vodafone",
		"url": "n.a.",
		"points": [
			[
				-0.137169,
				50.822584
			],
			[
				1.07751,
				49.923019
			]
		],
		"landingPointIds": [
			"3170",
			"5831"
		]
	},
	{
		"id": "1365",
		"name": "UK-Netherlands 14",
		"rfs": "1997",
		"length": "206 km",
		"owners": "BT,  KPN,  Vodafone",
		"url": "n.a.",
		"points": [
			[
				4.616394,
				52.616395
			],
			[
				-0.601608,
				53.656201
			]
		],
		"landingPointIds": [
			"8409",
			"3269"
		]
	},
	{
		"id": "1343",
		"name": "Ulysses",
		"rfs": "1998",
		"length": "250 km",
		"owners": "Verizon Business",
		"url": "n.a.",
		"points": [
			[
				1.852847,
				50.952886
			],
			[
				1.317585,
				51.125552
			],
			[
				4.61278,
				52.460896
			],
			[
				1.729221,
				52.471336
			]
		],
		"landingPointIds": [
			"4490",
			"6086",
			"10414",
			"3084"
		]
	},
	{
		"id": "1132",
		"name": "Unisur",
		"rfs": "March 1995",
		"length": "1,716 km",
		"owners": "Embratel,  Telef\u00f3nica de Argentina,  Antel Uruguay,  Entel Chile,  BT,  Telecom Argentina",
		"url": "n.a.",
		"points": [
			[
				-48.54953,
				-27.59703
			],
			[
				-56.695512,
				-36.472523
			],
			[
				-54.950189,
				-34.900367
			]
		],
		"landingPointIds": [
			"3359",
			"3330",
			"5963"
		]
	},
	{
		"id": "1525",
		"name": "Unity/EAC-Pacific",
		"rfs": "March 2010",
		"length": "9,620 km",
		"owners": "Pacnet,  Google,  Global Transit,  SingTel,  KDDI,  airtel (Bharti)",
		"url": "http://unity-cable-system.com",
		"points": [
			[
				139.95469,
				34.976637
			],
			[
				-118.387985,
				33.844375
			]
		],
		"landingPointIds": [
			"5885",
			"4992"
		]
	},
	{
		"id": "1249",
		"name": "Vodafone Malta-Sicily Cable System (VMSCS)",
		"rfs": "July 2004",
		"length": "260 km",
		"owners": "Vodafone Malta",
		"url": "http://www.vodafone.com.mt",
		"points": [
			[
				14.380009,
				35.934126
			],
			[
				15.067457,
				37.511603
			]
		],
		"landingPointIds": [
			"6170",
			"3214"
		]
	},
	{
		"id": "1517",
		"name": "WARF Submarine Cable",
		"rfs": "March 2007",
		"length": "680 km",
		"owners": "Wataniya Telecom Maldives,  Focus Infocom,  Reliance Globalcom",
		"url": "n.a.",
		"points": [
			[
				79.872019,
				6.926774
			],
			[
				73.499971,
				4.16644
			],
			[
				76.97024,
				8.798184
			]
		],
		"landingPointIds": [
			"3887",
			"4251",
			"7706"
		]
	},
	{
		"id": "1721",
		"name": "WASACE Africa",
		"rfs": "March 2015",
		"length": "9,934 km",
		"owners": "WASACE Cable Company",
		"url": "http://www.wasace.com",
		"points": [
			[
				7.166619,
				4.433368
			],
			[
				18.421981,
				-33.919086
			],
			[
				3.423247,
				6.438895
			],
			[
				-35.210942,
				-5.794435
			]
		],
		"landingPointIds": [
			"5922",
			"3921",
			"3280",
			"3354"
		]
	},
	{
		"id": "1720",
		"name": "WASACE Americas",
		"rfs": "December 2014",
		"length": "10,100 km",
		"owners": "WASACE Cable Company",
		"url": "http://www.wasace.com",
		"points": [
			[
				-38.542979,
				-3.718838
			],
			[
				-80.226416,
				25.78864
			],
			[
				-35.210942,
				-5.794435
			],
			[
				-43.209557,
				-22.903448
			],
			[
				-46.328071,
				-23.961926
			]
		],
		"landingPointIds": [
			"3347",
			"3696",
			"3354",
			"3242",
			"3411"
		]
	},
	{
		"id": "1707",
		"name": "WASACE Europe",
		"rfs": "December 2015",
		"length": "6,583 km",
		"owners": "WASACE Cable Company",
		"url": "http://www.wasace.com",
		"points": [
			[
				-80.088937,
				26.350304
			],
			[
				-1.984436,
				43.320783
			],
			[
				-75.977999,
				36.852966
			]
		],
		"landingPointIds": [
			"3563",
			"4496",
			"4862"
		]
	},
	{
		"id": "1560",
		"name": "West African Cable System (WACS)",
		"rfs": "May 2012",
		"length": "14,916 km",
		"owners": "Broadband Infraco,  Telkom South Africa,  Vodacom,  MTN Group,  Tata Communications,  Togo Telecom,  Telecom Namibia,  Office Congolais de Poste et T\u00e9l\u00e9communication,  Congo Telecom,  Portugal Telecom,  Angola Cables,  Cape Verde Telecom,  Vodafone Espana,  Vodafone",
		"url": "http://wacscable.com",
		"points": [
			[
				-4.026252,
				5.323497
			],
			[
				-0.201065,
				5.558302
			],
			[
				-15.699976,
				27.999558
			],
			[
				-2.975002,
				51.222224
			],
			[
				3.423247,
				6.438895
			],
			[
				9.208485,
				4.014555
			],
			[
				1.22784,
				6.125989
			],
			[
				12.349888,
				-5.93337
			],
			[
				-23.521257,
				14.92308
			],
			[
				11.863614,
				-4.779123
			],
			[
				13.234998,
				-8.812863
			],
			[
				-9.107377,
				38.642259
			],
			[
				14.528079,
				-22.67828
			],
			[
				18.155554,
				-33.348187
			]
		],
		"landingPointIds": [
			"3316",
			"4181",
			"5720",
			"5745",
			"3280",
			"9846",
			"3317",
			"9426",
			"10725",
			"5971",
			"10727",
			"9058",
			"9845",
			"9844"
		]
	},
	{
		"id": "1632",
		"name": "Xiamen-Kinmen Undersea Cable",
		"rfs": "August 2012",
		"length": "21 km",
		"owners": "Chunghwa,  China Telecom,  China Unicom,  China Mobile",
		"url": "n.a.",
		"points": [
			[
				118.300968,
				24.556694
			],
			[
				118.189037,
				24.493952
			],
			[
				118.307092,
				24.476184
			],
			[
				118.289825,
				24.455605
			]
		],
		"landingPointIds": [
			"10368",
			"10369",
			"10366",
			"10367"
		]
	},
	{
		"id": "1081",
		"name": "Yellow",
		"rfs": "September 2000",
		"length": "7,001 km",
		"owners": "Level 3",
		"url": "http://www.level3.com",
		"points": [
			[
				-72.937837,
				40.755601
			],
			[
				-4.544398,
				50.828106
			]
		],
		"landingPointIds": [
			"5767",
			"4554"
		]
	}
];

export const SUBMARINE_CABLE_LANDINGS: SubmarineLandingPoint[] = [
	{
		"id": "3316",
		"name": "Abidjan, C\u00f4te d'Ivoire",
		"lat": 5.323497,
		"lon": -4.026252,
		"desc": "3 cable systems: Africa Coast to Europe (ACE), SAT-3/WASC, West African Cable System (WACS)",
		"cableCount": 3
	},
	{
		"id": "3858",
		"name": "Abu Dhabi, United Arab Emirates",
		"lat": 24.443759,
		"lon": 54.41896,
		"desc": "1 cable system: Qatar-UAE Submarine Cable System",
		"cableCount": 1
	},
	{
		"id": "9485",
		"name": "Abu Talat, Egypt",
		"lat": 31.071894,
		"lon": 29.702539,
		"desc": "3 cable systems: Europe India Gateway (EIG), Middle East North Africa (MENA) Cable System/Gulf Bridge International, TE North/TGN-Eurasia/SEACOM/Alexandros",
		"cableCount": 3
	},
	{
		"id": "4181",
		"name": "Accra, Ghana",
		"lat": 5.558302,
		"lon": -0.201065,
		"desc": "5 cable systems: Africa Coast to Europe (ACE), GLO-1, Main One, +2 more",
		"cableCount": 5
	},
	{
		"id": "5969",
		"name": "Aden, Yemen",
		"lat": 12.800704,
		"lon": 45.033503,
		"desc": "1 cable system: Aden-Djibouti",
		"cableCount": 1
	},
	{
		"id": "6053",
		"name": "Ajaccio, France",
		"lat": 41.919284,
		"lon": 8.738675,
		"desc": "1 cable system: Corse-Continent 5 (CC5)",
		"cableCount": 1
	},
	{
		"id": "5884",
		"name": "Ajigaura, Japan",
		"lat": 36.383558,
		"lon": 140.612324,
		"desc": "2 cable systems: EAC-C2C, Pacific Crossing-1 (PC-1)",
		"cableCount": 2
	},
	{
		"id": "10838",
		"name": "Al Baida, Libya",
		"lat": 32.881767,
		"lon": 21.74167,
		"desc": "1 cable system: LFON (Libyan Fiber Optic Network)",
		"cableCount": 1
	},
	{
		"id": "7870",
		"name": "Al Brega, Libya",
		"lat": 30.378121,
		"lon": 19.576529,
		"desc": "1 cable system: LFON (Libyan Fiber Optic Network)",
		"cableCount": 1
	},
	{
		"id": "10232",
		"name": "Al Daayen, Qatar",
		"lat": 25.538577,
		"lon": 51.45193,
		"desc": "1 cable system: Gulf Bridge International Cable System (GBICS)/Middle East North Africa (MENA) Cable System",
		"cableCount": 1
	},
	{
		"id": "7679",
		"name": "Al Ghaydah, Yemen",
		"lat": 16.210339,
		"lon": 52.182344,
		"desc": "1 cable system: FLAG FALCON",
		"cableCount": 1
	},
	{
		"id": "10233",
		"name": "Al Hidd, Bahrain",
		"lat": 26.241585,
		"lon": 50.656264,
		"desc": "1 cable system: Gulf Bridge International Cable System (GBICS)/Middle East North Africa (MENA) Cable System",
		"cableCount": 1
	},
	{
		"id": "7681",
		"name": "Al Hudaydah, Yemen",
		"lat": 14.685565,
		"lon": 43.008501,
		"desc": "1 cable system: FLAG FALCON",
		"cableCount": 1
	},
	{
		"id": "7729",
		"name": "Al Khobar, Saudi Arabia",
		"lat": 26.286157,
		"lon": 50.214262,
		"desc": "3 cable systems: FLAG FALCON, Gulf Bridge International Cable System (GBICS)/Middle East North Africa (MENA) Cable System, Tata TGN-Gulf",
		"cableCount": 3
	},
	{
		"id": "7866",
		"name": "Al Khoms, Libya",
		"lat": 32.649673,
		"lon": 14.264464,
		"desc": "1 cable system: LFON (Libyan Fiber Optic Network)",
		"cableCount": 1
	},
	{
		"id": "4294",
		"name": "Al Safat, Kuwait",
		"lat": 29.369937,
		"lon": 47.976541,
		"desc": "1 cable system: FLAG FALCON",
		"cableCount": 1
	},
	{
		"id": "7646",
		"name": "Al Seeb, Oman",
		"lat": 23.684634,
		"lon": 58.176135,
		"desc": "4 cable systems: FLAG FALCON, Gulf Bridge International Cable System (GBICS)/Middle East North Africa (MENA) Cable System, Middle East North Africa (MENA) Cable System/Gulf Bridge International, +1 more",
		"cableCount": 4
	},
	{
		"id": "9596",
		"name": "Al-Faw, Iraq",
		"lat": 29.923369,
		"lon": 48.53178,
		"desc": "2 cable systems: FLAG FALCON, Gulf Bridge International Cable System (GBICS)/Middle East North Africa (MENA) Cable System",
		"cableCount": 2
	},
	{
		"id": "10682",
		"name": "Al-Kheesa, Qatar",
		"lat": 25.294336,
		"lon": 51.51939,
		"desc": "1 cable system: Tata TGN-Gulf",
		"cableCount": 1
	},
	{
		"id": "6097",
		"name": "Alexandria, Australia",
		"lat": -33.913966,
		"lon": 151.196198,
		"desc": "1 cable system: Southern Cross Cable Network",
		"cableCount": 1
	},
	{
		"id": "6044",
		"name": "Alexandria, Egypt",
		"lat": 31.191856,
		"lon": 29.889861,
		"desc": "6 cable systems: Aletar, FLAG Europe-Asia (FEA), Hawk, +3 more",
		"cableCount": 6
	},
	{
		"id": "4176",
		"name": "Algiers, Algeria",
		"lat": 36.765328,
		"lon": 3.031789,
		"desc": "1 cable system: Med Cable Network",
		"cableCount": 1
	},
	{
		"id": "3086",
		"name": "Alkmaar, Netherlands",
		"lat": 52.634666,
		"lon": 4.746194,
		"desc": "2 cable systems: Germany-Netherlands, Pangea South",
		"cableCount": 2
	},
	{
		"id": "10737",
		"name": "Alsgarde, Denmark",
		"lat": 56.074919,
		"lon": 12.536908,
		"desc": "1 cable system: Denmark-Sweden 17",
		"cableCount": 1
	},
	{
		"id": "10726",
		"name": "Alta Vista,Canary Islands, Spain",
		"lat": 27.999558,
		"lon": -15.699976,
		"desc": "1 cable system: SAT-3/WASC",
		"cableCount": 1
	},
	{
		"id": "10683",
		"name": "Amway Island, Bahrain",
		"lat": 26.229037,
		"lon": 50.575855,
		"desc": "1 cable system: Tata TGN-Gulf",
		"cableCount": 1
	},
	{
		"id": "10384",
		"name": "Anatoliko, Cyprus",
		"lat": 34.692643,
		"lon": 32.575608,
		"desc": "1 cable system: Hawk",
		"cableCount": 1
	},
	{
		"id": "4067",
		"name": "Anchorage, Alaska, United States",
		"lat": 61.217431,
		"lon": -149.858376,
		"desc": "2 cable systems: ACS Alaska-Oregon Network (AKORN), Kodiak Kenai Fiber Link (KKFL)",
		"cableCount": 2
	},
	{
		"id": "5860",
		"name": "Ancol, Indonesia",
		"lat": -6.129325,
		"lon": 106.833389,
		"desc": "1 cable system: SeaMeWe-3",
		"cableCount": 1
	},
	{
		"id": "8553",
		"name": "Angoon, Alaska, United States",
		"lat": 57.501816,
		"lon": -134.582274,
		"desc": "1 cable system: Alaska United South East",
		"cableCount": 1
	},
	{
		"id": "4196",
		"name": "Annaba, Algeria",
		"lat": 36.902356,
		"lon": 7.755488,
		"desc": "2 cable systems: Med Cable Network, SeaMeWe-4",
		"cableCount": 2
	},
	{
		"id": "5705",
		"name": "Apia, Samoa",
		"lat": -13.833706,
		"lon": -171.766679,
		"desc": "1 cable system: Samoa-American Samoa (SAS)",
		"cableCount": 1
	},
	{
		"id": "4363",
		"name": "Aqaba, Jordan",
		"lat": 29.531761,
		"lon": 35.006975,
		"desc": "1 cable system: FLAG Europe-Asia (FEA)",
		"cableCount": 1
	},
	{
		"id": "10377",
		"name": "Archirondel, Jersey",
		"lat": 49.225231,
		"lon": -2.021328,
		"desc": "1 cable system: INGRID",
		"cableCount": 1
	},
	{
		"id": "6056",
		"name": "Arendal, Norway",
		"lat": 58.461715,
		"lon": 8.772405,
		"desc": "1 cable system: Denmark-Norway 5",
		"cableCount": 1
	},
	{
		"id": "5800",
		"name": "Arica, Chile",
		"lat": -18.473782,
		"lon": -70.30675,
		"desc": "2 cable systems: Pan American (PAN-AM), South America-1 (SAm-1)",
		"cableCount": 2
	},
	{
		"id": "5910",
		"name": "Asilah, Morocco",
		"lat": 35.470741,
		"lon": -6.035744,
		"desc": "2 cable systems: Atlas Offshore, Loukkos",
		"cableCount": 2
	},
	{
		"id": "3211",
		"name": "Athens, Greece",
		"lat": 37.976093,
		"lon": 23.736254,
		"desc": "1 cable system: MedNautilus Submarine System",
		"cableCount": 1
	},
	{
		"id": "3319",
		"name": "Auckland, New Zealand",
		"lat": -36.88441,
		"lon": 174.770419,
		"desc": "4 cable systems: APX-East, OptiKor, Tasman Global Access (TGA) Cable, +1 more",
		"cableCount": 4
	},
	{
		"id": "10893",
		"name": "Auki, Solomon Islands",
		"lat": -8.766686,
		"lon": 160.700012,
		"desc": "1 cable system: Solomons Oceanic Cable Network",
		"cableCount": 1
	},
	{
		"id": "6029",
		"name": "Ayia Napa, Cyprus",
		"lat": 34.983263,
		"lon": 33.999996,
		"desc": "1 cable system: CIOS",
		"cableCount": 1
	},
	{
		"id": "8682",
		"name": "Ayre of Caira, United Kingdom",
		"lat": 58.833246,
		"lon": -2.900114,
		"desc": "1 cable system: SHEFA-2",
		"cableCount": 1
	},
	{
		"id": "5776",
		"name": "Baby Beach, Aruba",
		"lat": 12.518115,
		"lon": -69.96403,
		"desc": "1 cable system: Pan American (PAN-AM)",
		"cableCount": 1
	},
	{
		"id": "9028",
		"name": "Bahar ic-Caghaq, Malta",
		"lat": 35.934126,
		"lon": 14.458812,
		"desc": "1 cable system: Melita 1",
		"cableCount": 1
	},
	{
		"id": "5906",
		"name": "Baie Jacotet, Mauritius",
		"lat": -20.473988,
		"lon": 57.485374,
		"desc": "1 cable system: SAFE",
		"cableCount": 1
	},
	{
		"id": "8834",
		"name": "Baillif, Guadeloupe",
		"lat": 16.028941,
		"lon": -61.713946,
		"desc": "1 cable system: Global Caribbean Network (GCN)",
		"cableCount": 1
	},
	{
		"id": "8722",
		"name": "Balboa, Panama",
		"lat": 8.949969,
		"lon": -79.566674,
		"desc": "1 cable system: Pacific Caribbean Cable System (PCCS)",
		"cableCount": 1
	},
	{
		"id": "9594",
		"name": "Balchik, Bulgaria",
		"lat": 43.414344,
		"lon": 28.167425,
		"desc": "1 cable system: Caucasus Cable System",
		"cableCount": 1
	},
	{
		"id": "8541",
		"name": "Ballesteros, Philippines",
		"lat": 18.409411,
		"lon": 121.514047,
		"desc": "1 cable system: Tata TGN-Intra Asia (TGN-IA)",
		"cableCount": 1
	},
	{
		"id": "8407",
		"name": "Ballinesker, Ireland",
		"lat": 52.401467,
		"lon": -6.364862,
		"desc": "1 cable system: Pan European Crossing (UK-Ireland)",
		"cableCount": 1
	},
	{
		"id": "6170",
		"name": "Balluta Bay, Malta",
		"lat": 35.934126,
		"lon": 14.380009,
		"desc": "1 cable system: Vodafone Malta-Sicily Cable System (VMSCS)",
		"cableCount": 1
	},
	{
		"id": "8406",
		"name": "Ballygrangans, Ireland",
		"lat": 52.184029,
		"lon": -6.558809,
		"desc": "1 cable system: Pan European Crossing (UK-Ireland)",
		"cableCount": 1
	},
	{
		"id": "8848",
		"name": "Bandar Abbas, Iran",
		"lat": 27.187329,
		"lon": 56.274409,
		"desc": "1 cable system: FLAG FALCON",
		"cableCount": 1
	},
	{
		"id": "3554",
		"name": "Bandon, Oregon, United States",
		"lat": 43.118504,
		"lon": -124.408279,
		"desc": "1 cable system: China-U.S. Cable Network (CHUS)",
		"cableCount": 1
	},
	{
		"id": "8680",
		"name": "Banff, United Kingdom",
		"lat": 57.666852,
		"lon": -2.523663,
		"desc": "1 cable system: SHEFA-2",
		"cableCount": 1
	},
	{
		"id": "4348",
		"name": "Banjul, Gambia",
		"lat": 13.455928,
		"lon": -16.581371,
		"desc": "1 cable system: Africa Coast to Europe (ACE)",
		"cableCount": 1
	},
	{
		"id": "9342",
		"name": "Bar, Montenegro",
		"lat": 42.093054,
		"lon": 19.100294,
		"desc": "1 cable system: Corfu-Bar",
		"cableCount": 1
	},
	{
		"id": "3036",
		"name": "Barcelona, Spain",
		"lat": 41.385327,
		"lon": 2.168564,
		"desc": "1 cable system: BARSAV",
		"cableCount": 1
	},
	{
		"id": "3160",
		"name": "Bari, Italy",
		"lat": 41.125526,
		"lon": 16.866689,
		"desc": "4 cable systems: Balkans-Italy Network (BIN), Greece-Western Europe Network (GWEN), Italy-Albania, +1 more",
		"cableCount": 4
	},
	{
		"id": "8947",
		"name": "Barka, Oman",
		"lat": 23.679414,
		"lon": 58.004373,
		"desc": "3 cable systems: Europe India Gateway (EIG), OMRAN/EPEG Cable System, Pishgaman Oman Iran (POI) Network",
		"cableCount": 3
	},
	{
		"id": "4315",
		"name": "Barranquilla, Colombia",
		"lat": 10.940437,
		"lon": -74.779783,
		"desc": "4 cable systems: America Movil Submarine Cable System-1 (AMX-1), GlobeNet, Pan American (PAN-AM), +1 more",
		"cableCount": 4
	},
	{
		"id": "8403",
		"name": "Barseb\u00e4ck, Sweden",
		"lat": 55.770346,
		"lon": 12.95542,
		"desc": "1 cable system: Danica North",
		"cableCount": 1
	},
	{
		"id": "4356",
		"name": "Basseterre, Saint Kitts and Nevis",
		"lat": 17.298431,
		"lon": -62.731215,
		"desc": "2 cable systems: Eastern Caribbean Fiber System (ECFS), Global Caribbean Network (GCN)",
		"cableCount": 2
	},
	{
		"id": "9434",
		"name": "Bata, Equatorial Guinea",
		"lat": 1.860054,
		"lon": 9.768242,
		"desc": "2 cable systems: Africa Coast to Europe (ACE), Ceiba-1",
		"cableCount": 2
	},
	{
		"id": "5862",
		"name": "Batam, Indonesia",
		"lat": 1.13466,
		"lon": 103.962529,
		"desc": "6 cable systems: Batam Dumai Melaka Cable System (BDMCS), Batam-Rengit Cable System (BRCS), Matrix Cable System, +3 more",
		"cableCount": 6
	},
	{
		"id": "3218",
		"name": "Batangas, Philippines",
		"lat": 13.765521,
		"lon": 121.065017,
		"desc": "3 cable systems: APCN-2, EAC-C2C, SeaMeWe-3",
		"cableCount": 3
	},
	{
		"id": "3862",
		"name": "Beirut, Lebanon",
		"lat": 33.89246,
		"lon": 35.485217,
		"desc": "3 cable systems: Berytar, CADMOS, EUROPA",
		"cableCount": 3
	},
	{
		"id": "5791",
		"name": "Belize City, Belize",
		"lat": 17.495491,
		"lon": -88.181614,
		"desc": "1 cable system: ARCOS",
		"cableCount": 1
	},
	{
		"id": "5767",
		"name": "Bellport, New York, United States",
		"lat": 40.755601,
		"lon": -72.937837,
		"desc": "1 cable system: Yellow",
		"cableCount": 1
	},
	{
		"id": "10395",
		"name": "Belmullet, Ireland",
		"lat": 54.224691,
		"lon": -9.991182,
		"desc": "1 cable system: Emerald Express",
		"cableCount": 1
	},
	{
		"id": "7871",
		"name": "Benghazi, Libya",
		"lat": 32.116619,
		"lon": 20.066717,
		"desc": "1 cable system: LFON (Libyan Fiber Optic Network)",
		"cableCount": 1
	},
	{
		"id": "3080",
		"name": "Beverwijk, Netherlands",
		"lat": 52.486294,
		"lon": 4.65695,
		"desc": "1 cable system: Atlantic Crossing-1 (AC-1)",
		"cableCount": 1
	},
	{
		"id": "3067",
		"name": "Bilbao, Spain",
		"lat": 43.268382,
		"lon": -2.946141,
		"desc": "1 cable system: Tata TGN-Western Europe",
		"cableCount": 1
	},
	{
		"id": "5958",
		"name": "Bizerte, Tunisia",
		"lat": 37.276397,
		"lon": 9.867323,
		"desc": "1 cable system: SeaMeWe-4",
		"cableCount": 1
	},
	{
		"id": "5818",
		"name": "Blaabjerg, Denmark",
		"lat": 55.751574,
		"lon": 8.328997,
		"desc": "3 cable systems: CANTAT-3, DANICE, TAT-14",
		"cableCount": 3
	},
	{
		"id": "8408",
		"name": "Blackpool, United Kingdom",
		"lat": 53.808689,
		"lon": -3.050744,
		"desc": "1 cable system: Sirius",
		"cableCount": 1
	},
	{
		"id": "5920",
		"name": "Bluefields, Nicaragua",
		"lat": 11.991787,
		"lon": -83.771474,
		"desc": "1 cable system: ARCOS",
		"cableCount": 1
	},
	{
		"id": "7813",
		"name": "Boat Harbour, Tasmania, Australia",
		"lat": -40.950776,
		"lon": 145.62373,
		"desc": "1 cable system: Bass Strait-1",
		"cableCount": 1
	},
	{
		"id": "3563",
		"name": "Boca Raton, Florida, United States",
		"lat": 26.350304,
		"lon": -80.088937,
		"desc": "6 cable systems: Bahamas Internet Cable System (BICS), Colombia-Florida Subsea Fiber (CFX-1), GlobeNet, +3 more",
		"cableCount": 6
	},
	{
		"id": "5922",
		"name": "Bonny, Nigeria",
		"lat": 4.433368,
		"lon": 7.166619,
		"desc": "1 cable system: WASACE Africa",
		"cableCount": 1
	},
	{
		"id": "5736",
		"name": "Brean, United Kingdom",
		"lat": 51.293699,
		"lon": -3.01089,
		"desc": "1 cable system: Hibernia Express",
		"cableCount": 1
	},
	{
		"id": "8396",
		"name": "Bredene, Belgium",
		"lat": 51.246417,
		"lon": 2.96192,
		"desc": "1 cable system: Pan European Crossing (UK-Belgium)",
		"cableCount": 1
	},
	{
		"id": "9671",
		"name": "Breivika, Norway",
		"lat": 68.734993,
		"lon": 16.553181,
		"desc": "1 cable system: Svalbard Undersea Cable System",
		"cableCount": 1
	},
	{
		"id": "4202",
		"name": "Bridgetown, Barbados",
		"lat": 13.098953,
		"lon": -59.613354,
		"desc": "1 cable system: Eastern Caribbean Fiber System (ECFS)",
		"cableCount": 1
	},
	{
		"id": "3170",
		"name": "Brighton, United Kingdom",
		"lat": 50.822584,
		"lon": -0.137169,
		"desc": "1 cable system: UK-France 3",
		"cableCount": 1
	},
	{
		"id": "6033",
		"name": "Broadstairs, United Kingdom",
		"lat": 51.35885,
		"lon": 1.439455,
		"desc": "1 cable system: Tangerine",
		"cableCount": 1
	},
	{
		"id": "4512",
		"name": "Brookhaven, New York, United States",
		"lat": 40.773169,
		"lon": -72.912288,
		"desc": "2 cable systems: Atlantic Crossing-1 (AC-1), Mid-Atlantic Crossing (MAC)",
		"cableCount": 2
	},
	{
		"id": "5781",
		"name": "Brookvale, Australia",
		"lat": -33.761178,
		"lon": 151.273898,
		"desc": "1 cable system: Southern Cross Cable Network",
		"cableCount": 1
	},
	{
		"id": "4554",
		"name": "Bude, United Kingdom",
		"lat": 50.828106,
		"lon": -4.544398,
		"desc": "6 cable systems: Apollo, Europe India Gateway (EIG), GLO-1, +3 more",
		"cableCount": 6
	},
	{
		"id": "7689",
		"name": "Bull Bay, Jamaica",
		"lat": 17.949741,
		"lon": -76.666652,
		"desc": "1 cable system: Fibralink",
		"cableCount": 1
	},
	{
		"id": "8401",
		"name": "Bunkeflostand, Sweden",
		"lat": 55.556823,
		"lon": 12.918779,
		"desc": "1 cable system: Scandinavian Ring South",
		"cableCount": 1
	},
	{
		"id": "9683",
		"name": "Bushehr, Iran",
		"lat": 28.969997,
		"lon": 50.842783,
		"desc": "1 cable system: Gulf Bridge International Cable System (GBICS)/Middle East North Africa (MENA) Cable System",
		"cableCount": 1
	},
	{
		"id": "5775",
		"name": "Cacuaco, Angola",
		"lat": -8.776624,
		"lon": 13.372327,
		"desc": "1 cable system: SAT-3/WASC",
		"cableCount": 1
	},
	{
		"id": "4374",
		"name": "C\u00e1diz, Spain",
		"lat": 36.52952,
		"lon": -6.292734,
		"desc": "2 cable systems: CanaLink, Pencan-8",
		"cableCount": 2
	},
	{
		"id": "3162",
		"name": "Cagliari, Italy",
		"lat": 39.215367,
		"lon": 9.109404,
		"desc": "1 cable system: Janna",
		"cableCount": 1
	},
	{
		"id": "4490",
		"name": "Calais, France",
		"lat": 50.952886,
		"lon": 1.852847,
		"desc": "1 cable system: Ulysses",
		"cableCount": 1
	},
	{
		"id": "5966",
		"name": "Camuri, Venezuela",
		"lat": 10.606149,
		"lon": -66.878292,
		"desc": "1 cable system: Americas-II",
		"cableCount": 1
	},
	{
		"id": "3842",
		"name": "Canc\u00fan, Mexico",
		"lat": 21.09566,
		"lon": -86.767566,
		"desc": "3 cable systems: America Movil Submarine Cable System-1 (AMX-1), ARCOS, Maya-1",
		"cableCount": 3
	},
	{
		"id": "8835",
		"name": "Canefield, Dominica",
		"lat": 15.303345,
		"lon": -61.384828,
		"desc": "1 cable system: Global Caribbean Network (GCN)",
		"cableCount": 1
	},
	{
		"id": "6279",
		"name": "Cannes, France",
		"lat": 43.552878,
		"lon": 7.017344,
		"desc": "1 cable system: Corse-Continent 4 (CC4)",
		"cableCount": 1
	},
	{
		"id": "3921",
		"name": "Cape Town, South Africa",
		"lat": -33.919086,
		"lon": 18.421981,
		"desc": "2 cable systems: Africa Coast to Europe (ACE), WASACE Africa",
		"cableCount": 2
	},
	{
		"id": "5693",
		"name": "Cartagena, Colombia",
		"lat": 10.386704,
		"lon": -75.505679,
		"desc": "4 cable systems: America Movil Submarine Cable System-1 (AMX-1), ARCOS, Colombia-Florida Subsea Fiber (CFX-1), +1 more",
		"cableCount": 4
	},
	{
		"id": "3256",
		"name": "Casablanca, Morocco",
		"lat": 33.586984,
		"lon": -7.611113,
		"desc": "1 cable system: Eurafrica",
		"cableCount": 1
	},
	{
		"id": "4207",
		"name": "Castries, Saint Lucia",
		"lat": 13.994202,
		"lon": -61.006822,
		"desc": "1 cable system: Eastern Caribbean Fiber System (ECFS)",
		"cableCount": 1
	},
	{
		"id": "5784",
		"name": "Cat Island, Bahamas",
		"lat": 24.403303,
		"lon": -75.525907,
		"desc": "2 cable systems: ARCOS, Bahamas Domestic Submarine Network (BDSNi)",
		"cableCount": 2
	},
	{
		"id": "3214",
		"name": "Catania, Italy",
		"lat": 37.511603,
		"lon": 15.067457,
		"desc": "4 cable systems: IMEWE, Italy-Malta, MedNautilus Submarine System, +1 more",
		"cableCount": 4
	},
	{
		"id": "5786",
		"name": "Caves Point, Bahamas",
		"lat": 24.424987,
		"lon": -76.574447,
		"desc": "1 cable system: Bahamas Internet Cable System (BICS)",
		"cableCount": 1
	},
	{
		"id": "5931",
		"name": "Cavite, Philippines",
		"lat": 14.286227,
		"lon": 120.820174,
		"desc": "1 cable system: EAC-C2C",
		"cableCount": 1
	},
	{
		"id": "5575",
		"name": "Cayenne, French Guiana",
		"lat": 4.941325,
		"lon": -52.32106,
		"desc": "1 cable system: Americas-II",
		"cableCount": 1
	},
	{
		"id": "6051",
		"name": "Cayeux-sur-Mer, France",
		"lat": 50.178804,
		"lon": 1.493463,
		"desc": "1 cable system: Circe South",
		"cableCount": 1
	},
	{
		"id": "6048",
		"name": "Cayman Brac, Cayman Islands",
		"lat": 19.690346,
		"lon": -79.877673,
		"desc": "1 cable system: Cayman-Jamaica Fiber System",
		"cableCount": 1
	},
	{
		"id": "8849",
		"name": "Chabahar, Iran",
		"lat": 25.298251,
		"lon": 60.629687,
		"desc": "2 cable systems: FLAG FALCON, Pishgaman Oman Iran (POI) Network",
		"cableCount": 2
	},
	{
		"id": "8838",
		"name": "Chaguaramas, Trinidad and Tobago",
		"lat": 10.686157,
		"lon": -61.650803,
		"desc": "4 cable systems: Eastern Caribbean Fiber System (ECFS), ECLink, Global Caribbean Network (GCN), +1 more",
		"cableCount": 4
	},
	{
		"id": "5937",
		"name": "Changi, Singapore",
		"lat": 1.38904,
		"lon": 103.987023,
		"desc": "9 cable systems: Asia Submarine-cable Express (ASE)/Cahaya Malaysia, Asia-America Gateway (AAG) Cable System, EAC-C2C, +6 more",
		"cableCount": 9
	},
	{
		"id": "5723",
		"name": "Chania, Greece",
		"lat": 35.511799,
		"lon": 24.012217,
		"desc": "4 cable systems: Aphrodite 2, MedNautilus Submarine System, SeaMeWe-3, +1 more",
		"cableCount": 4
	},
	{
		"id": "3580",
		"name": "Charlestown, Rhode Island, United States",
		"lat": 41.41193,
		"lon": -71.645859,
		"desc": "1 cable system: Challenger Bermuda-1 (CB-1)",
		"cableCount": 1
	},
	{
		"id": "4191",
		"name": "Chennai, India",
		"lat": 13.063516,
		"lon": 80.243049,
		"desc": "3 cable systems: i2i Cable Network (i2icn), SeaMeWe-4, Tata TGN-Tata Indicom",
		"cableCount": 3
	},
	{
		"id": "5885",
		"name": "Chikura, Japan",
		"lat": 34.976637,
		"lon": 139.95469,
		"desc": "5 cable systems: APCN-2, China-U.S. Cable Network (CHUS), EAC-C2C, +2 more",
		"cableCount": 5
	},
	{
		"id": "5802",
		"name": "Chongming, China",
		"lat": 31.619905,
		"lon": 121.395289,
		"desc": "4 cable systems: APCN-2, Asia Pacific Gateway (APG), China-U.S. Cable Network (CHUS), +1 more",
		"cableCount": 4
	},
	{
		"id": "5856",
		"name": "Chung Hom Kok, Hong Kong",
		"lat": 22.2221,
		"lon": 114.203081,
		"desc": "2 cable systems: EAC-C2C, Southeast Asia Japan Cable (SJC)",
		"cableCount": 2
	},
	{
		"id": "7751",
		"name": "Civitavecchia, Italy",
		"lat": 42.091146,
		"lon": 11.796857,
		"desc": "1 cable system: Janna",
		"cableCount": 1
	},
	{
		"id": "10354",
		"name": "Clair, United Kingdom",
		"lat": 60.74993,
		"lon": -2.399937,
		"desc": "1 cable system: SHEFA-2",
		"cableCount": 1
	},
	{
		"id": "10360",
		"name": "Clarence Town, Bahamas",
		"lat": 23.098376,
		"lon": -74.966201,
		"desc": "1 cable system: Bahamas Domestic Submarine Network (BDSNi)",
		"cableCount": 1
	},
	{
		"id": "10313",
		"name": "Clonshaugh,Ireland",
		"lat": 53.410053,
		"lon": -6.197919,
		"desc": "1 cable system: Emerald Bridge Fibres",
		"cableCount": 1
	},
	{
		"id": "4322",
		"name": "Cochin, India",
		"lat": 9.938075,
		"lon": 76.269541,
		"desc": "2 cable systems: SAFE, SeaMeWe-3",
		"cableCount": 2
	},
	{
		"id": "10364",
		"name": "Cockburn Town, Bahamas",
		"lat": 24.052552,
		"lon": -74.530272,
		"desc": "1 cable system: Bahamas Domestic Submarine Network (BDSNi)",
		"cableCount": 1
	},
	{
		"id": "9038",
		"name": "Coleraine, United Kingdom",
		"lat": 55.130782,
		"lon": -6.676211,
		"desc": "1 cable system: Hibernia Atlantic",
		"cableCount": 1
	},
	{
		"id": "3887",
		"name": "Colombo, Sri Lanka",
		"lat": 6.926774,
		"lon": 79.872019,
		"desc": "3 cable systems: Dhiraagu-SLT Submarine Cable Network, SeaMeWe-4, WARF Submarine Cable",
		"cableCount": 3
	},
	{
		"id": "6093",
		"name": "Col\u00f3n, Panama",
		"lat": 9.353724,
		"lon": -79.900009,
		"desc": "3 cable systems: ARCOS, Pan American (PAN-AM), South American Crossing (SAC)/Latin American Nautilus (LAN)",
		"cableCount": 3
	},
	{
		"id": "4208",
		"name": "Conakry, Guinea",
		"lat": 9.51354,
		"lon": -13.703835,
		"desc": "1 cable system: Africa Coast to Europe (ACE)",
		"cableCount": 1
	},
	{
		"id": "6084",
		"name": "Condado Beach, PR, United States",
		"lat": 18.459906,
		"lon": -66.077959,
		"desc": "1 cable system: Taino-Carib",
		"cableCount": 1
	},
	{
		"id": "5944",
		"name": "Conil, Spain",
		"lat": 36.276545,
		"lon": -6.087192,
		"desc": "2 cable systems: Columbus-III, Pencan-6",
		"cableCount": 2
	},
	{
		"id": "6024",
		"name": "Corfu, Greece",
		"lat": 39.619323,
		"lon": 19.91955,
		"desc": "3 cable systems: Adria-1, Corfu-Bar, Italy-Greece 1",
		"cableCount": 3
	},
	{
		"id": "3315",
		"name": "Cotonou, Benin",
		"lat": 6.356577,
		"lon": 2.439909,
		"desc": "2 cable systems: Africa Coast to Europe (ACE), SAT-3/WASC",
		"cableCount": 2
	},
	{
		"id": "6299",
		"name": "Cox\u2019s Bazar, Bangladesh",
		"lat": 21.429245,
		"lon": 91.994923,
		"desc": "1 cable system: SeaMeWe-4",
		"cableCount": 1
	},
	{
		"id": "5782",
		"name": "Crooked Island, Bahamas",
		"lat": 22.62967,
		"lon": -74.19498,
		"desc": "2 cable systems: ARCOS, Bahamas Domestic Submarine Network (BDSNi)",
		"cableCount": 2
	},
	{
		"id": "8355",
		"name": "Crown Haven, Bahamas",
		"lat": 24.424987,
		"lon": -76.574447,
		"desc": "1 cable system: Bahamas Internet Cable System (BICS)",
		"cableCount": 1
	},
	{
		"id": "5787",
		"name": "Current, Bahamas",
		"lat": 25.407773,
		"lon": -76.787668,
		"desc": "1 cable system: Bahamas Internet Cable System (BICS)",
		"cableCount": 1
	},
	{
		"id": "8536",
		"name": "Currimao, Philippines",
		"lat": 16.582774,
		"lon": 120.389715,
		"desc": "1 cable system: Asia-America Gateway (AAG) Cable System",
		"cableCount": 1
	},
	{
		"id": "10368",
		"name": "Dadeng Island, China",
		"lat": 24.556694,
		"lon": 118.300968,
		"desc": "1 cable system: Xiamen-Kinmen Undersea Cable",
		"cableCount": 1
	},
	{
		"id": "10355",
		"name": "Daet, Philippines",
		"lat": 14.116573,
		"lon": 122.949979,
		"desc": "1 cable system: Asia Submarine-cable Express (ASE)/Cahaya Malaysia",
		"cableCount": 1
	},
	{
		"id": "4180",
		"name": "Dakar, Senegal",
		"lat": 14.686669,
		"lon": -17.451925,
		"desc": "3 cable systems: Africa Coast to Europe (ACE), Atlantis-2, SAT-3/WASC",
		"cableCount": 3
	},
	{
		"id": "5986",
		"name": "Danang, Vietnam",
		"lat": 16.051528,
		"lon": 108.214811,
		"desc": "2 cable systems: Asia Pacific Gateway (APG), SeaMeWe-3",
		"cableCount": 2
	},
	{
		"id": "4182",
		"name": "Dar Es Salaam, Tanzania",
		"lat": -6.823198,
		"lon": 39.269697,
		"desc": "3 cable systems: Eastern Africa Submarine System (EASSy), SEACOM/Tata TGN-Eurasia, Seychelles to East Africa System (SEAS)",
		"cableCount": 3
	},
	{
		"id": "7873",
		"name": "Darnah, Libya",
		"lat": 32.763612,
		"lon": 22.639228,
		"desc": "2 cable systems: LFON (Libyan Fiber Optic Network), Silphium",
		"cableCount": 2
	},
	{
		"id": "10381",
		"name": "Dartmouth, United Kingdom",
		"lat": 50.351771,
		"lon": -3.578377,
		"desc": "1 cable system: UK-Channel Islands-7",
		"cableCount": 1
	},
	{
		"id": "6020",
		"name": "Das Island, United Arab Emirates",
		"lat": 25.15259,
		"lon": 52.865977,
		"desc": "1 cable system: Qatar-UAE Submarine Cable System",
		"cableCount": 1
	},
	{
		"id": "5853",
		"name": "Deep Water Bay, Hong Kong",
		"lat": 22.249405,
		"lon": 114.184008,
		"desc": "2 cable systems: SeaMeWe-3, Tata TGN-Intra Asia (TGN-IA)",
		"cableCount": 2
	},
	{
		"id": "10338",
		"name": "Deeside Clwyd,United Kingdom",
		"lat": 53.20175,
		"lon": -3.027555,
		"desc": "1 cable system: Geo-Eirgrid",
		"cableCount": 1
	},
	{
		"id": "10813",
		"name": "Dhangethi, Maldives",
		"lat": 3.608089,
		"lon": 72.955573,
		"desc": "1 cable system: Dhiraagu Cable Network",
		"cableCount": 1
	},
	{
		"id": "10579",
		"name": "Diba, Oman",
		"lat": 25.616979,
		"lon": 56.258046,
		"desc": "1 cable system: OMRAN/EPEG Cable System",
		"cableCount": 1
	},
	{
		"id": "5831",
		"name": "Dieppe, France",
		"lat": 49.923019,
		"lon": 1.07751,
		"desc": "1 cable system: UK-France 3",
		"cableCount": 1
	},
	{
		"id": "4177",
		"name": "Djibouti City, Djibouti",
		"lat": 11.594657,
		"lon": 43.148039,
		"desc": "5 cable systems: Aden-Djibouti, Eastern Africa Submarine System (EASSy), Europe India Gateway (EIG), +2 more",
		"cableCount": 5
	},
	{
		"id": "3867",
		"name": "Doha, Qatar",
		"lat": 25.294336,
		"lon": 51.51939,
		"desc": "3 cable systems: Fiber Optic Gulf (FOG), FLAG FALCON, Qatar-UAE Submarine Cable System",
		"cableCount": 3
	},
	{
		"id": "4210",
		"name": "Douala, Cameroon",
		"lat": 4.04718,
		"lon": 9.706303,
		"desc": "1 cable system: SAT-3/WASC",
		"cableCount": 1
	},
	{
		"id": "6086",
		"name": "Dover, United Kingdom",
		"lat": 51.125552,
		"lon": 1.317585,
		"desc": "1 cable system: Ulysses",
		"cableCount": 1
	},
	{
		"id": "8400",
		"name": "Dragor, Denmark",
		"lat": 55.593565,
		"lon": 12.670222,
		"desc": "1 cable system: Scandinavian Ring South",
		"cableCount": 1
	},
	{
		"id": "7648",
		"name": "Draupner, Norway",
		"lat": 58.92249,
		"lon": 2.685104,
		"desc": "1 cable system: NorSea Com",
		"cableCount": 1
	},
	{
		"id": "3270",
		"name": "Dubai, United Arab Emirates",
		"lat": 25.26934,
		"lon": 55.308487,
		"desc": "3 cable systems: Fiber Optic Gulf (FOG), FLAG FALCON, Tata TGN-Gulf",
		"cableCount": 3
	},
	{
		"id": "3077",
		"name": "Dublin, Ireland",
		"lat": 53.348014,
		"lon": -6.248262,
		"desc": "3 cable systems: CeltixConnect, Hibernia Atlantic, Sirius",
		"cableCount": 3
	},
	{
		"id": "6043",
		"name": "Dubrovnik, Croatia",
		"lat": 42.641868,
		"lon": 18.106465,
		"desc": "1 cable system: Adria-1",
		"cableCount": 1
	},
	{
		"id": "7311",
		"name": "Dumai, Indonesia",
		"lat": 1.665304,
		"lon": 101.44764,
		"desc": "2 cable systems: Batam Dumai Melaka Cable System (BDMCS), Dumai-Melaka Cable System",
		"cableCount": 2
	},
	{
		"id": "8397",
		"name": "Dumpton Gap, United Kingdom",
		"lat": 51.358549,
		"lon": 1.439354,
		"desc": "1 cable system: Pan European Crossing (UK-Belgium)",
		"cableCount": 1
	},
	{
		"id": "10361",
		"name": "Duncan Town, Bahamas",
		"lat": 22.18325,
		"lon": -75.733457,
		"desc": "1 cable system: Bahamas Domestic Submarine Network (BDSNi)",
		"cableCount": 1
	},
	{
		"id": "5746",
		"name": "Dunnet Bay, United Kingdom",
		"lat": 58.615306,
		"lon": -3.346182,
		"desc": "1 cable system: FARICE-1",
		"cableCount": 1
	},
	{
		"id": "6025",
		"name": "Durres, Albania",
		"lat": 41.316663,
		"lon": 19.450041,
		"desc": "2 cable systems: Adria-1, Italy-Albania",
		"cableCount": 2
	},
	{
		"id": "9248",
		"name": "East London, South Africa",
		"lat": -32.983281,
		"lon": 27.866667,
		"desc": "1 cable system: South Atlantic Express (SAEx)",
		"cableCount": 1
	},
	{
		"id": "8409",
		"name": "Egmond, Netherlands",
		"lat": 52.616395,
		"lon": 4.616394,
		"desc": "1 cable system: UK-Netherlands 14",
		"cableCount": 1
	},
	{
		"id": "5783",
		"name": "Eight-Mile Rock, Bahamas",
		"lat": 26.539633,
		"lon": -78.802882,
		"desc": "1 cable system: Bahamas 2",
		"cableCount": 1
	},
	{
		"id": "7649",
		"name": "Ekofisk, Norway",
		"lat": 56.549146,
		"lon": 3.210026,
		"desc": "1 cable system: NorSea Com",
		"cableCount": 1
	},
	{
		"id": "5774",
		"name": "El Djemila, Algeria",
		"lat": 36.313387,
		"lon": 5.7342,
		"desc": "1 cable system: ALPAL-2",
		"cableCount": 1
	},
	{
		"id": "5720",
		"name": "El Goro,Canary Islands, Spain",
		"lat": 27.999558,
		"lon": -15.699976,
		"desc": "1 cable system: West African Cable System (WACS)",
		"cableCount": 1
	},
	{
		"id": "5722",
		"name": "El M\u00e9dano,Canary Islands, Spain",
		"lat": 28.046639,
		"lon": -16.538606,
		"desc": "2 cable systems: Atlantis-2, Pencan-6",
		"cableCount": 2
	},
	{
		"id": "8350",
		"name": "Ela Beach, Papua New Guinea",
		"lat": -9.480235,
		"lon": 147.156335,
		"desc": "1 cable system: Australia-Papua New Guinea-2 (APNG-2)",
		"cableCount": 1
	},
	{
		"id": "5894",
		"name": "Emi, Japan",
		"lat": 35.062368,
		"lon": 140.0611,
		"desc": "1 cable system: Tata TGN-Pacific",
		"cableCount": 1
	},
	{
		"id": "5943",
		"name": "Estepona, Spain",
		"lat": 36.427125,
		"lon": -5.145865,
		"desc": "2 cable systems: Estepona-Tetouan, FLAG Europe-Asia (FEA)",
		"cableCount": 2
	},
	{
		"id": "10812",
		"name": "Eydhafushi, Maldives",
		"lat": 5.103249,
		"lon": 73.070817,
		"desc": "1 cable system: Dhiraagu Cable Network",
		"cableCount": 1
	},
	{
		"id": "5980",
		"name": "Fangshan, Taiwan",
		"lat": 22.249204,
		"lon": 120.662165,
		"desc": "3 cable systems: China-U.S. Cable Network (CHUS), EAC-C2C, SeaMeWe-3",
		"cableCount": 3
	},
	{
		"id": "7412",
		"name": "Farosund, Sweden",
		"lat": 57.863008,
		"lon": 19.055321,
		"desc": "1 cable system: BCF-1",
		"cableCount": 1
	},
	{
		"id": "8539",
		"name": "Florence, Oregon, United States",
		"lat": 43.982131,
		"lon": -124.09984,
		"desc": "1 cable system: ACS Alaska-Oregon Network (AKORN)",
		"cableCount": 1
	},
	{
		"id": "3359",
		"name": "Florian\u00f3polis, Brazil",
		"lat": -27.59703,
		"lon": -48.54953,
		"desc": "1 cable system: Unisur",
		"cableCount": 1
	},
	{
		"id": "5925",
		"name": "Fort Amador, Panama",
		"lat": 8.934107,
		"lon": -79.546748,
		"desc": "2 cable systems: Pan-American Crossing (PAC), South American Crossing (SAC)/Latin American Nautilus (LAN)",
		"cableCount": 2
	},
	{
		"id": "3347",
		"name": "Fortaleza, Brazil",
		"lat": -3.718838,
		"lon": -38.542979,
		"desc": "13 cable systems: America Movil Submarine Cable System-1 (AMX-1), Americas-II, Atlantis-2, +10 more",
		"cableCount": 13
	},
	{
		"id": "10796",
		"name": "Four Mile Bluff, Australia",
		"lat": -41.033294,
		"lon": 146.850055,
		"desc": "1 cable system: Basslink",
		"cableCount": 1
	},
	{
		"id": "4212",
		"name": "Freetown, Sierra Leone",
		"lat": 8.485379,
		"lon": -13.238091,
		"desc": "1 cable system: Africa Coast to Europe (ACE)",
		"cableCount": 1
	},
	{
		"id": "10358",
		"name": "Fresh Creek, Bahamas",
		"lat": 24.689807,
		"lon": -77.84459,
		"desc": "1 cable system: Bahamas Domestic Submarine Network (BDSNi)",
		"cableCount": 1
	},
	{
		"id": "5962",
		"name": "Fujairah, United Arab Emirates",
		"lat": 25.121671,
		"lon": 56.333737,
		"desc": "10 cable systems: Europe India Gateway (EIG), FLAG Europe-Asia (FEA), Gulf Bridge International Cable System (GBICS)/Middle East North Africa (MENA) Cable System, +7 more",
		"cableCount": 10
	},
	{
		"id": "4059",
		"name": "Fukuoka, Japan",
		"lat": 33.590296,
		"lon": 130.401687,
		"desc": "1 cable system: Korea-Japan Cable Network (KJCN)",
		"cableCount": 1
	},
	{
		"id": "5935",
		"name": "Funchal, Portugal",
		"lat": 32.647263,
		"lon": -16.905068,
		"desc": "1 cable system: Eurafrica",
		"cableCount": 1
	},
	{
		"id": "5725",
		"name": "Funningsfjordur, Faeroe Islands",
		"lat": 62.244086,
		"lon": -6.928132,
		"desc": "1 cable system: FARICE-1",
		"cableCount": 1
	},
	{
		"id": "10817",
		"name": "Fuvahmulah, Maldives",
		"lat": -0.298361,
		"lon": 73.426889,
		"desc": "1 cable system: Dhiraagu Cable Network",
		"cableCount": 1
	},
	{
		"id": "8620",
		"name": "Fuzhou, China",
		"lat": 26.071129,
		"lon": 119.30323,
		"desc": "1 cable system: Taiwan Strait Express-1 (TSE)-1",
		"cableCount": 1
	},
	{
		"id": "10815",
		"name": "Gahdhoo, Maldives",
		"lat": 0.288801,
		"lon": 73.455499,
		"desc": "1 cable system: Dhiraagu Cable Network",
		"cableCount": 1
	},
	{
		"id": "10814",
		"name": "Gan, Maldives",
		"lat": 1.91858,
		"lon": 73.544643,
		"desc": "1 cable system: Dhiraagu Cable Network",
		"cableCount": 1
	},
	{
		"id": "5990",
		"name": "Ganaveh, Iran",
		"lat": 29.570811,
		"lon": 50.521144,
		"desc": "1 cable system: Kuwait-Iran",
		"cableCount": 1
	},
	{
		"id": "5994",
		"name": "Gedebak Odde, Denmark",
		"lat": 55.012627,
		"lon": 14.966669,
		"desc": "1 cable system: Denmark-Poland 2",
		"cableCount": 1
	},
	{
		"id": "5820",
		"name": "Gedser, Denmark",
		"lat": 54.576346,
		"lon": 11.928966,
		"desc": "2 cable systems: Baltica, Germany-Denmark 2",
		"cableCount": 2
	},
	{
		"id": "10359",
		"name": "George Town, Bahamas",
		"lat": 23.516487,
		"lon": -75.788017,
		"desc": "1 cable system: Bahamas Domestic Submarine Network (BDSNi)",
		"cableCount": 1
	},
	{
		"id": "3904",
		"name": "Georgetown, Guyana",
		"lat": 6.804102,
		"lon": -58.154935,
		"desc": "1 cable system: Suriname-Guyana Submarine Cable System (SG-SCS)",
		"cableCount": 1
	},
	{
		"id": "8948",
		"name": "Gibraltar, Gibraltar",
		"lat": 36.155981,
		"lon": -5.347693,
		"desc": "1 cable system: Europe India Gateway (EIG)",
		"cableCount": 1
	},
	{
		"id": "9661",
		"name": "Girne, Cyprus",
		"lat": 35.29908,
		"lon": 33.236354,
		"desc": "1 cable system: Turcyos-1",
		"cableCount": 1
	},
	{
		"id": "10178",
		"name": "Gjirin e Lalezit, Albania",
		"lat": 41.210654,
		"lon": 19.499231,
		"desc": "1 cable system: Balkans-Italy Network (BIN)",
		"cableCount": 1
	},
	{
		"id": "3292",
		"name": "Goonhilly Downs, United Kingdom",
		"lat": 50.024811,
		"lon": -5.174526,
		"desc": "2 cable systems: SeaMeWe-3, UK-Channel Islands-8",
		"cableCount": 2
	},
	{
		"id": "10357",
		"name": "Governors Harbor, Bahamas",
		"lat": 25.196057,
		"lon": -76.240661,
		"desc": "1 cable system: Bahamas Domestic Submarine Network (BDSNi)",
		"cableCount": 1
	},
	{
		"id": "5721",
		"name": "Gran Canaria,Canary Islands, Spain",
		"lat": 27.964623,
		"lon": -15.396255,
		"desc": "1 cable system: CanaLink",
		"cableCount": 1
	},
	{
		"id": "10375",
		"name": "Greve de Lecq, Jersey",
		"lat": 49.247918,
		"lon": -2.201422,
		"desc": "2 cable systems: Guernsey-Jersey-4, INGRID",
		"cableCount": 2
	},
	{
		"id": "10385",
		"name": "Grindavik, Iceland",
		"lat": 63.846158,
		"lon": -22.44486,
		"desc": "1 cable system: Emerald Express",
		"cableCount": 1
	},
	{
		"id": "5748",
		"name": "Grover Beach, California, United States",
		"lat": 35.120592,
		"lon": -120.62144,
		"desc": "2 cable systems: Pacific Crossing-1 (PC-1), Pan-American Crossing (PAC)",
		"cableCount": 2
	},
	{
		"id": "10369",
		"name": "Guanyin Mountain, China",
		"lat": 24.493952,
		"lon": 118.189037,
		"desc": "1 cable system: Xiamen-Kinmen Undersea Cable",
		"cableCount": 1
	},
	{
		"id": "10366",
		"name": "Guningtou, Taiwan",
		"lat": 24.476184,
		"lon": 118.307092,
		"desc": "1 cable system: Xiamen-Kinmen Undersea Cable",
		"cableCount": 1
	},
	{
		"id": "3905",
		"name": "Haifa, Israel",
		"lat": 32.811396,
		"lon": 34.998743,
		"desc": "2 cable systems: MedNautilus Submarine System, Tamares North",
		"cableCount": 2
	},
	{
		"id": "10120",
		"name": "Haina, Dominican Republic",
		"lat": 18.699027,
		"lon": -70.161842,
		"desc": "1 cable system: East-West",
		"cableCount": 1
	},
	{
		"id": "5799",
		"name": "Half Moon Bay, Cayman Islands",
		"lat": 19.282977,
		"lon": -81.166789,
		"desc": "2 cable systems: Cayman-Jamaica Fiber System, Maya-1",
		"cableCount": 2
	},
	{
		"id": "3640",
		"name": "Halifax, Nova Scotia, Canada",
		"lat": 44.645788,
		"lon": -63.573962,
		"desc": "2 cable systems: Hibernia Atlantic, Hibernia Express",
		"cableCount": 2
	},
	{
		"id": "6019",
		"name": "Halul Island, Qatar",
		"lat": 25.668578,
		"lon": 52.42026,
		"desc": "1 cable system: Qatar-UAE Submarine Cable System",
		"cableCount": 1
	},
	{
		"id": "7694",
		"name": "Hang\u00f6, Finland",
		"lat": 59.82326,
		"lon": 22.968195,
		"desc": "1 cable system: BCS North - Phase 1",
		"cableCount": 1
	},
	{
		"id": "9104",
		"name": "Haradsholm, Finland",
		"lat": 60.301,
		"lon": 22.302129,
		"desc": "1 cable system: BCS North - Phase 1",
		"cableCount": 1
	},
	{
		"id": "3641",
		"name": "Harbour Pointe, Washington, United States",
		"lat": 47.886272,
		"lon": -122.302165,
		"desc": "1 cable system: Pacific Crossing-1 (PC-1)",
		"cableCount": 1
	},
	{
		"id": "9600",
		"name": "Harbour View, Jamaica",
		"lat": 17.949741,
		"lon": -76.716896,
		"desc": "1 cable system: East-West",
		"cableCount": 1
	},
	{
		"id": "10376",
		"name": "Havelet Bay, Guernsey",
		"lat": 49.451,
		"lon": -2.529486,
		"desc": "1 cable system: INGRID",
		"cableCount": 1
	},
	{
		"id": "8552",
		"name": "Hawk Inlet, Alaska, United States",
		"lat": 58.128129,
		"lon": -134.741789,
		"desc": "1 cable system: Alaska United South East",
		"cableCount": 1
	},
	{
		"id": "5785",
		"name": "Hawksbill, Bahamas",
		"lat": 26.516846,
		"lon": -78.736827,
		"desc": "2 cable systems: Bahamas Domestic Submarine Network (BDSNi), Bahamas Internet Cable System (BICS)",
		"cableCount": 2
	},
	{
		"id": "3268",
		"name": "Helsingborg, Sweden",
		"lat": 56.043799,
		"lon": 12.69582,
		"desc": "4 cable systems: Denmark-Sweden 15, Denmark-Sweden 16, Denmark-Sweden 18, +1 more",
		"cableCount": 4
	},
	{
		"id": "9103",
		"name": "Helsingfors, Finland",
		"lat": 60.1711,
		"lon": 24.932463,
		"desc": "2 cable systems: BCS North - Phase 1, BCS North - Phase 2",
		"cableCount": 2
	},
	{
		"id": "6065",
		"name": "Helsing\u00f8r, Denmark",
		"lat": 56.030448,
		"lon": 12.592121,
		"desc": "2 cable systems: Denmark-Sweden 18, Scandinavian Ring North",
		"cableCount": 2
	},
	{
		"id": "3064",
		"name": "Helsinki, Finland",
		"lat": 60.1711,
		"lon": 24.932463,
		"desc": "4 cable systems: Finland Estonia Connection (FEC), Finland-Estonia 2 (EESF-2), Finland-Estonia 3 (EESF-3), +1 more",
		"cableCount": 4
	},
	{
		"id": "4966",
		"name": "Hermosa Beach, California, United States",
		"lat": 33.862244,
		"lon": -118.39953,
		"desc": "1 cable system: APX-East",
		"cableCount": 1
	},
	{
		"id": "5745",
		"name": "Highbridge, United Kingdom",
		"lat": 51.222224,
		"lon": -2.975002,
		"desc": "3 cable systems: Tata TGN-Atlantic, Tata TGN-Western Europe, West African Cable System (WACS)",
		"cableCount": 3
	},
	{
		"id": "5992",
		"name": "Hiller\u00f8d, Denmark",
		"lat": 55.927853,
		"lon": 12.300799,
		"desc": "2 cable systems: Denmark-Sweden 15, Denmark-Sweden 16",
		"cableCount": 2
	},
	{
		"id": "3649",
		"name": "Hillsboro, Oregon, United States",
		"lat": 45.82483,
		"lon": -123.811178,
		"desc": "3 cable systems: NorthStar, Southern Cross Cable Network, Tata TGN-Pacific",
		"cableCount": 3
	},
	{
		"id": "10816",
		"name": "Hithadhoo, Maldives",
		"lat": -0.606046,
		"lon": 73.089188,
		"desc": "1 cable system: Dhiraagu Cable Network",
		"cableCount": 1
	},
	{
		"id": "5821",
		"name": "Hj\u00f8rring, Denmark",
		"lat": 57.45614,
		"lon": 9.995618,
		"desc": "1 cable system: Denmark-Norway 5",
		"cableCount": 1
	},
	{
		"id": "3650",
		"name": "Hollywood, Florida, United States",
		"lat": 26.010194,
		"lon": -80.160211,
		"desc": "4 cable systems: Americas-II, Columbus-III, Maya-1, +1 more",
		"cableCount": 4
	},
	{
		"id": "6035",
		"name": "Holyhead, United Kingdom",
		"lat": 53.306052,
		"lon": -4.630379,
		"desc": "2 cable systems: CeltixConnect, Emerald Bridge Fibres",
		"cableCount": 2
	},
	{
		"id": "8392",
		"name": "Homer, Alaska, United States",
		"lat": 59.646378,
		"lon": -151.544271,
		"desc": "2 cable systems: ACS Alaska-Oregon Network (AKORN), Kodiak Kenai Fiber Link (KKFL)",
		"cableCount": 2
	},
	{
		"id": "10892",
		"name": "Honiara, Solomon Islands",
		"lat": -9.430342,
		"lon": 159.948316,
		"desc": "1 cable system: Solomons Oceanic Cable Network",
		"cableCount": 1
	},
	{
		"id": "10790",
		"name": "Hudishibana, Aruba",
		"lat": 12.616594,
		"lon": -70.050011,
		"desc": "1 cable system: Pacific Caribbean Cable System (PCCS)",
		"cableCount": 1
	},
	{
		"id": "9215",
		"name": "Hulhumale, Maldives",
		"lat": 4.211915,
		"lon": 73.540226,
		"desc": "1 cable system: Dhiraagu Cable Network",
		"cableCount": 1
	},
	{
		"id": "6058",
		"name": "Igneada, Turkey",
		"lat": 41.884149,
		"lon": 27.985324,
		"desc": "1 cable system: KAFOS",
		"cableCount": 1
	},
	{
		"id": "10414",
		"name": "Ijmuiden, Netherlands",
		"lat": 52.460896,
		"lon": 4.61278,
		"desc": "1 cable system: Ulysses",
		"cableCount": 1
	},
	{
		"id": "7860",
		"name": "Inverloch, Australia",
		"lat": -38.633448,
		"lon": 145.729538,
		"desc": "1 cable system: Bass Strait-2",
		"cableCount": 1
	},
	{
		"id": "7834",
		"name": "Ishikari, Japan",
		"lat": 43.171207,
		"lon": 141.315432,
		"desc": "1 cable system: Hokkaido-Sakhalin Cable System (HSCS)",
		"cableCount": 1
	},
	{
		"id": "5773",
		"name": "Isla Verde, Puerto Rico, United States",
		"lat": 18.441736,
		"lon": -66.016873,
		"desc": "4 cable systems: Antillas 1, ARCOS, Saint Maarten Puerto Rico Network One (SMPR-1), +1 more",
		"cableCount": 4
	},
	{
		"id": "9763",
		"name": "Island Park, New York, United States",
		"lat": 40.600303,
		"lon": -73.655953,
		"desc": "1 cable system: FLAG Atlantic-1 (FA-1)",
		"cableCount": 1
	},
	{
		"id": "3221",
		"name": "Istanbul, Turkey",
		"lat": 41.040599,
		"lon": 28.986079,
		"desc": "3 cable systems: ITUR, KAFOS, MedNautilus Submarine System",
		"cableCount": 3
	},
	{
		"id": "3655",
		"name": "Jacksonville, Florida, United States",
		"lat": 30.331743,
		"lon": -81.655723,
		"desc": "2 cable systems: America Movil Submarine Cable System-1 (AMX-1), Pacific Caribbean Cable System (PCCS)",
		"cableCount": 2
	},
	{
		"id": "3012",
		"name": "Jakarta, Indonesia",
		"lat": -6.171889,
		"lon": 106.827868,
		"desc": "3 cable systems: APX-West, Australia-Singapore Submarine Cable-1 (ASSC-1), Matrix Cable System",
		"cableCount": 3
	},
	{
		"id": "10722",
		"name": "Jamestown, Saint Helena",
		"lat": -15.922152,
		"lon": -5.704668,
		"desc": "1 cable system: South Atlantic Express (SAEx)",
		"cableCount": 1
	},
	{
		"id": "8836",
		"name": "Jarry, Guadeloupe",
		"lat": 16.242965,
		"lon": -61.554883,
		"desc": "1 cable system: Global Caribbean Network (GCN)",
		"cableCount": 1
	},
	{
		"id": "6031",
		"name": "Jask, Iran",
		"lat": 25.681226,
		"lon": 57.797376,
		"desc": "3 cable systems: OMRAN/EPEG Cable System, Pishgaman Oman Iran (POI) Network, UAE-Iran",
		"cableCount": 3
	},
	{
		"id": "4361",
		"name": "Jeddah, Saudi Arabia",
		"lat": 21.481246,
		"lon": 39.182762,
		"desc": "9 cable systems: Europe India Gateway (EIG), FLAG Europe-Asia (FEA), FLAG FALCON, +6 more",
		"cableCount": 9
	},
	{
		"id": "4816",
		"name": "Juneau, Alaska, United States",
		"lat": 58.29949,
		"lon": -134.406848,
		"desc": "2 cable systems: Alaska United East, Alaska United South East",
		"cableCount": 2
	},
	{
		"id": "5753",
		"name": "Kahe Point, Hawaii, United States",
		"lat": 21.354056,
		"lon": -158.130545,
		"desc": "1 cable system: Southern Cross Cable Network",
		"cableCount": 1
	},
	{
		"id": "3259",
		"name": "Karachi, Pakistan",
		"lat": 24.889376,
		"lon": 67.028539,
		"desc": "4 cable systems: IMEWE, SeaMeWe-3, SeaMeWe-4, +1 more",
		"cableCount": 4
	},
	{
		"id": "5828",
		"name": "K\u00e4rdla, Estonia",
		"lat": 59.000892,
		"lon": 22.738008,
		"desc": "1 cable system: Sweden-Estonia (EE-S 1)",
		"cableCount": 1
	},
	{
		"id": "5923",
		"name": "K\u00e5rst\u00f8, Norway",
		"lat": 59.279264,
		"lon": 5.524392,
		"desc": "1 cable system: NorSea Com",
		"cableCount": 1
	},
	{
		"id": "5939",
		"name": "Katong, Singapore",
		"lat": 1.309333,
		"lon": 103.904706,
		"desc": "1 cable system: APCN-2",
		"cableCount": 1
	},
	{
		"id": "10365",
		"name": "Katthammarsvik, Sweden",
		"lat": 57.431044,
		"lon": 18.845312,
		"desc": "1 cable system: BCS East-West Interlink",
		"cableCount": 1
	},
	{
		"id": "3283",
		"name": "Katwijk, Netherlands",
		"lat": 52.205211,
		"lon": 4.396447,
		"desc": "1 cable system: TAT-14",
		"cableCount": 1
	},
	{
		"id": "8973",
		"name": "Kawaihae, Hawaii, United States",
		"lat": 20.039893,
		"lon": -155.831387,
		"desc": "1 cable system: Honotua",
		"cableCount": 1
	},
	{
		"id": "10123",
		"name": "Kaweni, Mayotte",
		"lat": -12.81709,
		"lon": 45.165913,
		"desc": "1 cable system: Lower Indian Ocean Network 2 (LION2)",
		"cableCount": 1
	},
	{
		"id": "5754",
		"name": "Keawaula, Hawaii, United States",
		"lat": 21.425732,
		"lon": -158.151726,
		"desc": "3 cable systems: American Samoa-Hawaii (ASH), Asia-America Gateway (AAG) Cable System, Telstra Endeavour",
		"cableCount": 3
	},
	{
		"id": "6015",
		"name": "Kelibia, Tunisia",
		"lat": 36.849352,
		"lon": 11.089934,
		"desc": "2 cable systems: HANNIBAL System, Trapani-Kelibia",
		"cableCount": 2
	},
	{
		"id": "8393",
		"name": "Kenai, Alaska, United States",
		"lat": 60.552871,
		"lon": -151.259775,
		"desc": "1 cable system: Kodiak Kenai Fiber Link (KKFL)",
		"cableCount": 1
	},
	{
		"id": "5975",
		"name": "Keoje, Korea,Rep.",
		"lat": 34.880668,
		"lon": 128.620826,
		"desc": "3 cable systems: FLAG Europe-Asia (FEA), SeaMeWe-3, Trans-Pacific Express (TPE) Cable System",
		"cableCount": 3
	},
	{
		"id": "8551",
		"name": "Ketchikan, Alaska, United States",
		"lat": 55.341895,
		"lon": -131.647819,
		"desc": "1 cable system: Alaska United South East",
		"cableCount": 1
	},
	{
		"id": "10603",
		"name": "Khark Island, Iran",
		"lat": 29.245759,
		"lon": 50.312038,
		"desc": "1 cable system: Kuwait-Iran",
		"cableCount": 1
	},
	{
		"id": "7645",
		"name": "Khasab, Oman",
		"lat": 26.181353,
		"lon": 56.246802,
		"desc": "2 cable systems: FLAG FALCON, OMRAN/EPEG Cable System",
		"cableCount": 2
	},
	{
		"id": "5863",
		"name": "Kilmore Quay, Ireland",
		"lat": 52.174593,
		"lon": -6.584106,
		"desc": "3 cable systems: Celtic, ESAT-1, Solas",
		"cableCount": 3
	},
	{
		"id": "6077",
		"name": "Kingston, Grenada",
		"lat": 12.185233,
		"lon": -61.715352,
		"desc": "1 cable system: Eastern Caribbean Fiber System (ECFS)",
		"cableCount": 1
	},
	{
		"id": "3272",
		"name": "Kingston, Jamaica",
		"lat": 17.992204,
		"lon": -76.792186,
		"desc": "1 cable system: Cayman-Jamaica Fiber System",
		"cableCount": 1
	},
	{
		"id": "4219",
		"name": "Kingstown, Saint Vincent and the Grenadines",
		"lat": 13.187895,
		"lon": -61.254677,
		"desc": "2 cable systems: Eastern Caribbean Fiber System (ECFS), Global Caribbean Network (GCN)",
		"cableCount": 2
	},
	{
		"id": "5895",
		"name": "Kita-kyushu, Japan",
		"lat": 33.839256,
		"lon": 131.032015,
		"desc": "2 cable systems: Guam Okinama Kyushu Incheon (GOKI), Korea-Japan Cable Network (KJCN)",
		"cableCount": 2
	},
	{
		"id": "5703",
		"name": "Kitaibaraki, Japan",
		"lat": 36.801769,
		"lon": 140.750958,
		"desc": "2 cable systems: APCN-2, Japan-U.S. Cable Network (JUS)",
		"cableCount": 2
	},
	{
		"id": "8394",
		"name": "Kodiak, Alaska, United States",
		"lat": 57.794143,
		"lon": -152.395249,
		"desc": "1 cable system: Kodiak Kenai Fiber Link (KKFL)",
		"cableCount": 1
	},
	{
		"id": "7730",
		"name": "Kokkini, Greece",
		"lat": 39.753842,
		"lon": 19.923967,
		"desc": "1 cable system: Greece-Western Europe Network (GWEN)",
		"cableCount": 1
	},
	{
		"id": "5933",
		"name": "Kolobrzeg, Poland",
		"lat": 54.17239,
		"lon": 15.574912,
		"desc": "1 cable system: Baltica",
		"cableCount": 1
	},
	{
		"id": "4552",
		"name": "Kotka, Finland",
		"lat": 60.501071,
		"lon": 26.883579,
		"desc": "1 cable system: BCS North - Phase 2",
		"cableCount": 1
	},
	{
		"id": "10095",
		"name": "Kribi, Cameroon",
		"lat": 2.932888,
		"lon": 9.910389,
		"desc": "1 cable system: Africa Coast to Europe (ACE)",
		"cableCount": 1
	},
	{
		"id": "3131",
		"name": "Kristiansand, Norway",
		"lat": 58.150917,
		"lon": 7.996215,
		"desc": "1 cable system: Denmark-Norway 6",
		"cableCount": 1
	},
	{
		"id": "10739",
		"name": "Kristinelund, Sweden",
		"lat": 56.516721,
		"lon": 13.016757,
		"desc": "1 cable system: Denmark-Sweden 17",
		"cableCount": 1
	},
	{
		"id": "10283",
		"name": "Kuala Tungkal, Indonesia",
		"lat": -0.816457,
		"lon": 103.466719,
		"desc": "1 cable system: PGASCOM",
		"cableCount": 1
	},
	{
		"id": "5903",
		"name": "Kuantan, Malaysia",
		"lat": 3.815086,
		"lon": 103.322563,
		"desc": "2 cable systems: APCN-2, Asia Pacific Gateway (APG)",
		"cableCount": 2
	},
	{
		"id": "10811",
		"name": "Kulhudhufushi, Maldives",
		"lat": 6.622502,
		"lon": 73.07142,
		"desc": "1 cable system: Dhiraagu Cable Network",
		"cableCount": 1
	},
	{
		"id": "10605",
		"name": "Kungsbacka, Sweden",
		"lat": 57.487461,
		"lon": 12.076233,
		"desc": "1 cable system: Kattegat 1",
		"cableCount": 1
	},
	{
		"id": "3871",
		"name": "Kuwait City, Kuwait",
		"lat": 29.374053,
		"lon": 47.974734,
		"desc": "3 cable systems: Fiber Optic Gulf (FOG), Gulf Bridge International Cable System (GBICS)/Middle East North Africa (MENA) Cable System, Kuwait-Iran",
		"cableCount": 3
	},
	{
		"id": "7879",
		"name": "Kwajalein, Republic of Marshall Islands",
		"lat": 9.189793,
		"lon": 167.424318,
		"desc": "1 cable system: HANTRU1 Cable System",
		"cableCount": 1
	},
	{
		"id": "7765",
		"name": "L\u2019\u00cele-Rousse, France",
		"lat": 42.636547,
		"lon": 8.93714,
		"desc": "1 cable system: Corse-Continent 4 (CC4)",
		"cableCount": 1
	},
	{
		"id": "8352",
		"name": "La Guaira, Venezuela",
		"lat": 10.603137,
		"lon": -66.889636,
		"desc": "1 cable system: ALBA-1",
		"cableCount": 1
	},
	{
		"id": "7776",
		"name": "La Palma,Canary Islands, Spain",
		"lat": 28.663215,
		"lon": -17.765232,
		"desc": "1 cable system: CanaLink",
		"cableCount": 1
	},
	{
		"id": "7766",
		"name": "La Seyne, France",
		"lat": 43.102944,
		"lon": 5.878155,
		"desc": "1 cable system: Corse-Continent 5 (CC5)",
		"cableCount": 1
	},
	{
		"id": "3280",
		"name": "Lagos, Nigeria",
		"lat": 6.438895,
		"lon": 3.423247,
		"desc": "6 cable systems: Africa Coast to Europe (ACE), GLO-1, Main One, +3 more",
		"cableCount": 6
	},
	{
		"id": "10367",
		"name": "Lake Ci, Taiwan",
		"lat": 24.455605,
		"lon": 118.289825,
		"desc": "1 cable system: Xiamen-Kinmen Undersea Cable",
		"cableCount": 1
	},
	{
		"id": "10380",
		"name": "Lancresse Bay,Guernsey",
		"lat": 49.503402,
		"lon": -2.533451,
		"desc": "1 cable system: UK-Channel Islands-7",
		"cableCount": 1
	},
	{
		"id": "8994",
		"name": "Landeyjar, Iceland",
		"lat": 63.642172,
		"lon": -20.14229,
		"desc": "1 cable system: Greenland Connect",
		"cableCount": 1
	},
	{
		"id": "8544",
		"name": "Landeyjasandur, Iceland",
		"lat": 63.733123,
		"lon": -20.66676,
		"desc": "1 cable system: DANICE",
		"cableCount": 1
	},
	{
		"id": "5837",
		"name": "Lannion, France",
		"lat": 48.730224,
		"lon": -3.45992,
		"desc": "2 cable systems: Apollo, High-capacity Undersea Guernsey Optical-fibre (HUGO)",
		"cableCount": 2
	},
	{
		"id": "5852",
		"name": "Lantau Island, Hong Kong",
		"lat": 22.27149,
		"lon": 113.9484,
		"desc": "3 cable systems: APCN-2, Asia-America Gateway (AAG) Cable System, FLAG Europe-Asia (FEA)",
		"cableCount": 3
	},
	{
		"id": "3330",
		"name": "Las Toninas, Argentina",
		"lat": -36.472523,
		"lon": -56.695512,
		"desc": "6 cable systems: Atlantis-2, Bicentenario, South America-1 (SAm-1), +3 more",
		"cableCount": 6
	},
	{
		"id": "5905",
		"name": "Le Lamentin, Martinique",
		"lat": 14.615495,
		"lon": -61.094259,
		"desc": "3 cable systems: Americas-II, Eastern Caribbean Fiber System (ECFS), Global Caribbean Network (GCN)",
		"cableCount": 3
	},
	{
		"id": "5765",
		"name": "Lena Point, Alaska, United States",
		"lat": 58.550958,
		"lon": -134.74731,
		"desc": "1 cable system: NorthStar",
		"cableCount": 1
	},
	{
		"id": "4221",
		"name": "Libreville, Gabon",
		"lat": 0.394308,
		"lon": 9.454332,
		"desc": "2 cable systems: Africa Coast to Europe (ACE), SAT-3/WASC",
		"cableCount": 2
	},
	{
		"id": "5310",
		"name": "Liepaja, Latvia",
		"lat": 56.508188,
		"lon": 21.011256,
		"desc": "1 cable system: BCS East",
		"cableCount": 1
	},
	{
		"id": "9846",
		"name": "Limbe, Cameroon",
		"lat": 4.014555,
		"lon": 9.208485,
		"desc": "1 cable system: West African Cable System (WACS)",
		"cableCount": 1
	},
	{
		"id": "3146",
		"name": "Lisbon, Portugal",
		"lat": 38.725681,
		"lon": -9.150142,
		"desc": "4 cable systems: Africa Coast to Europe (ACE), Atlantis-2, Columbus-III, +1 more",
		"cableCount": 4
	},
	{
		"id": "9102",
		"name": "Logi, Russia",
		"lat": 59.79987,
		"lon": 28.499906,
		"desc": "1 cable system: BCS North - Phase 2",
		"cableCount": 1
	},
	{
		"id": "3317",
		"name": "Lome, Togo",
		"lat": 6.125989,
		"lon": 1.22784,
		"desc": "1 cable system: West African Cable System (WACS)",
		"cableCount": 1
	},
	{
		"id": "9672",
		"name": "Longyearbyen,Svalbard, Norway",
		"lat": 78.218528,
		"lon": 15.648797,
		"desc": "1 cable system: Svalbard Undersea Cable System",
		"cableCount": 1
	},
	{
		"id": "3678",
		"name": "Los Angeles, California, United States",
		"lat": 34.05338,
		"lon": -118.245336,
		"desc": "1 cable system: Tata TGN-Pacific",
		"cableCount": 1
	},
	{
		"id": "3084",
		"name": "Lowestoft, United Kingdom",
		"lat": 52.471336,
		"lon": 1.729221,
		"desc": "4 cable systems: Circe North, NorSea Com, Pangea South, +1 more",
		"cableCount": 4
	},
	{
		"id": "4190",
		"name": "Luanda, Angola",
		"lat": -8.812863,
		"lon": 13.234998,
		"desc": "2 cable systems: Africa Coast to Europe (ACE), South Atlantic Cable System (SACS)-Africa",
		"cableCount": 2
	},
	{
		"id": "5930",
		"name": "Lurin, Peru",
		"lat": -12.278515,
		"lon": -76.874302,
		"desc": "3 cable systems: Pan American (PAN-AM), South America-1 (SAm-1), South American Crossing (SAC)/Latin American Nautilus (LAN)",
		"cableCount": 3
	},
	{
		"id": "10907",
		"name": "Lusk, Ireland",
		"lat": 53.526301,
		"lon": -6.165895,
		"desc": "1 cable system: Geo-Eirgrid",
		"cableCount": 1
	},
	{
		"id": "10320",
		"name": "Lyngsa, Denmark",
		"lat": 57.244826,
		"lon": 10.514617,
		"desc": "1 cable system: Kattegat 2",
		"cableCount": 1
	},
	{
		"id": "3683",
		"name": "Lynn, Massachusetts, United States",
		"lat": 42.463681,
		"lon": -70.95028,
		"desc": "1 cable system: Hibernia Atlantic",
		"cableCount": 1
	},
	{
		"id": "5770",
		"name": "Lynnwood, Washington, United States",
		"lat": 47.824032,
		"lon": -122.315817,
		"desc": "1 cable system: Alaska United East",
		"cableCount": 1
	},
	{
		"id": "3083",
		"name": "Maade, Denmark",
		"lat": 55.458645,
		"lon": 8.505678,
		"desc": "1 cable system: Pangea North",
		"cableCount": 1
	},
	{
		"id": "8558",
		"name": "Madang, Papua New Guinea",
		"lat": -5.233674,
		"lon": 145.784851,
		"desc": "1 cable system: Pipe Pacific Cable-1 (PPC-1)",
		"cableCount": 1
	},
	{
		"id": "5758",
		"name": "Magen's Bay, VI, United States",
		"lat": 18.372971,
		"lon": -64.937114,
		"desc": "3 cable systems: Americas-I North, Columbus-II b, Taino-Carib",
		"cableCount": 3
	},
	{
		"id": "5968",
		"name": "Maiquetia, Venezuela",
		"lat": 10.599423,
		"lon": -66.960358,
		"desc": "1 cable system: GlobeNet",
		"cableCount": 1
	},
	{
		"id": "9060",
		"name": "Majuro, Republic of Marshall Islands",
		"lat": 7.116204,
		"lon": 171.185608,
		"desc": "1 cable system: HANTRU1 Cable System",
		"cableCount": 1
	},
	{
		"id": "5760",
		"name": "Makaha, Hawaii, United States",
		"lat": 21.460265,
		"lon": -158.206036,
		"desc": "1 cable system: Japan-U.S. Cable Network (JUS)",
		"cableCount": 1
	},
	{
		"id": "4224",
		"name": "Malabo, Equatorial Guinea",
		"lat": 3.749835,
		"lon": 8.783347,
		"desc": "1 cable system: Ceiba-1",
		"cableCount": 1
	},
	{
		"id": "5963",
		"name": "Maldonado, Uruguay",
		"lat": -34.900367,
		"lon": -54.950189,
		"desc": "3 cable systems: Bicentenario, South Atlantic Cable System (SACS)-South America, Unisur",
		"cableCount": 3
	},
	{
		"id": "4251",
		"name": "Male, Maldives",
		"lat": 4.16644,
		"lon": 73.499971,
		"desc": "2 cable systems: Dhiraagu-SLT Submarine Cable Network, WARF Submarine Cable",
		"cableCount": 2
	},
	{
		"id": "4188",
		"name": "Manama, Bahrain",
		"lat": 26.229037,
		"lon": 50.575855,
		"desc": "2 cable systems: Fiber Optic Gulf (FOG), FLAG FALCON",
		"cableCount": 2
	},
	{
		"id": "3686",
		"name": "Manasquan, New Jersey, United States",
		"lat": 40.123365,
		"lon": -74.04706,
		"desc": "4 cable systems: Apollo, Canada-United States 1 (CANUS 1), Gemini Bermuda, +1 more",
		"cableCount": 4
	},
	{
		"id": "3687",
		"name": "Manchester, California, United States",
		"lat": 38.969219,
		"lon": -123.687,
		"desc": "1 cable system: Japan-U.S. Cable Network (JUS)",
		"cableCount": 1
	},
	{
		"id": "8484",
		"name": "Mancora, Peru",
		"lat": -4.154015,
		"lon": -81.053804,
		"desc": "1 cable system: South America-1 (SAm-1)",
		"cableCount": 1
	},
	{
		"id": "6059",
		"name": "Mangalia, Romania",
		"lat": 43.817196,
		"lon": 28.582725,
		"desc": "1 cable system: KAFOS",
		"cableCount": 1
	},
	{
		"id": "8918",
		"name": "Manta, Ecuador",
		"lat": -0.949971,
		"lon": -80.716203,
		"desc": "1 cable system: Pacific Caribbean Cable System (PCCS)",
		"cableCount": 1
	},
	{
		"id": "4252",
		"name": "Maputo, Mozambique",
		"lat": -25.968556,
		"lon": 32.580627,
		"desc": "2 cable systems: Eastern Africa Submarine System (EASSy), SEACOM/Tata TGN-Eurasia",
		"cableCount": 2
	},
	{
		"id": "5928",
		"name": "Maria Chiquita, Panama",
		"lat": 9.437346,
		"lon": -79.753544,
		"desc": "3 cable systems: ARCOS, Maya-1, Pacific Caribbean Cable System (PCCS)",
		"cableCount": 3
	},
	{
		"id": "5830",
		"name": "Mariehamn, Finland",
		"lat": 60.11388,
		"lon": 19.93782,
		"desc": "2 cable systems: BCS North - Phase 1, Sweden-Finland Link (SFL)",
		"cableCount": 2
	},
	{
		"id": "5959",
		"name": "Marmaris, Turkey",
		"lat": 36.855275,
		"lon": 28.253658,
		"desc": "1 cable system: SeaMeWe-3",
		"cableCount": 1
	},
	{
		"id": "3210",
		"name": "Marseille, France",
		"lat": 43.293177,
		"lon": 5.372607,
		"desc": "6 cable systems: Atlas Offshore, Hawk, IMEWE, +3 more",
		"cableCount": 6
	},
	{
		"id": "5887",
		"name": "Maruyama, Japan",
		"lat": 35.037472,
		"lon": 139.81696,
		"desc": "5 cable systems: Asia Pacific Gateway (APG), Asia Submarine-cable Express (ASE)/Cahaya Malaysia, Australia-Japan Cable (AJC), +2 more",
		"cableCount": 5
	},
	{
		"id": "9581",
		"name": "Matthew Town, Bahamas",
		"lat": 20.950501,
		"lon": -73.683058,
		"desc": "1 cable system: Bahamas Domestic Submarine Network (BDSNi)",
		"cableCount": 1
	},
	{
		"id": "10362",
		"name": "Mayaguana, Bahamas",
		"lat": 22.401591,
		"lon": -73.064123,
		"desc": "1 cable system: Bahamas Domestic Submarine Network (BDSNi)",
		"cableCount": 1
	},
	{
		"id": "8684",
		"name": "Maywick, United Kingdom",
		"lat": 60.003956,
		"lon": -1.323791,
		"desc": "1 cable system: SHEFA-2",
		"cableCount": 1
	},
	{
		"id": "3215",
		"name": "Mazara del Vallo, Italy",
		"lat": 37.650037,
		"lon": 12.591318,
		"desc": "8 cable systems: Columbus-III, GO-1 Mediterranean Cable System, HANNIBAL System, +5 more",
		"cableCount": 8
	},
	{
		"id": "3470",
		"name": "Mazatl\u00e1n, Mexico",
		"lat": 23.199465,
		"lon": -106.421885,
		"desc": "1 cable system: Pan-American Crossing (PAC)",
		"cableCount": 1
	},
	{
		"id": "10797",
		"name": "McGaurans Beach, Australia",
		"lat": -38.443617,
		"lon": 147.071207,
		"desc": "1 cable system: Basslink",
		"cableCount": 1
	},
	{
		"id": "5861",
		"name": "Medan, Indonesia",
		"lat": 3.751742,
		"lon": 98.676063,
		"desc": "1 cable system: SeaMeWe-3",
		"cableCount": 1
	},
	{
		"id": "6300",
		"name": "Melaka, Malaysia",
		"lat": 2.273146,
		"lon": 102.220919,
		"desc": "3 cable systems: Batam Dumai Melaka Cable System (BDMCS), Dumai-Melaka Cable System, SeaMeWe-4",
		"cableCount": 3
	},
	{
		"id": "5941",
		"name": "Melkbosstrand, South Africa",
		"lat": -33.727247,
		"lon": 18.445772,
		"desc": "2 cable systems: SAFE, SAT-3/WASC",
		"cableCount": 2
	},
	{
		"id": "5999",
		"name": "Merem\u00f6isa, Estonia",
		"lat": 59.400832,
		"lon": 24.276636,
		"desc": "1 cable system: Finland-Estonia 3 (EESF-3)",
		"cableCount": 1
	},
	{
		"id": "9080",
		"name": "Mersin, Turkey",
		"lat": 36.799962,
		"lon": 34.633336,
		"desc": "1 cable system: Turcyos-1",
		"cableCount": 1
	},
	{
		"id": "5902",
		"name": "Mersing, Malaysia",
		"lat": 2.295532,
		"lon": 103.849895,
		"desc": "3 cable systems: Asia Submarine-cable Express (ASE)/Cahaya Malaysia, Asia-America Gateway (AAG) Cable System, SeaMeWe-3",
		"cableCount": 3
	},
	{
		"id": "6016",
		"name": "Mestre, Italy",
		"lat": 45.495863,
		"lon": 12.24408,
		"desc": "1 cable system: Italy-Croatia",
		"cableCount": 1
	},
	{
		"id": "3696",
		"name": "Miami, Florida, United States",
		"lat": 25.78864,
		"lon": -80.226416,
		"desc": "2 cable systems: America Movil Submarine Cable System-1 (AMX-1), WASACE Americas",
		"cableCount": 2
	},
	{
		"id": "5993",
		"name": "Mielno,Poland",
		"lat": 54.259927,
		"lon": 16.06229,
		"desc": "1 cable system: Denmark-Poland 2",
		"cableCount": 1
	},
	{
		"id": "8542",
		"name": "Milton, Newfoundland and Labrador, Canada",
		"lat": 48.86434,
		"lon": -53.965144,
		"desc": "1 cable system: Greenland Connect",
		"cableCount": 1
	},
	{
		"id": "5762",
		"name": "Miramar, Puerto Rico, United States",
		"lat": 18.453381,
		"lon": -66.082878,
		"desc": "2 cable systems: Americas-II, Antillas 1",
		"cableCount": 2
	},
	{
		"id": "7867",
		"name": "Misurata, Libya",
		"lat": 32.374312,
		"lon": 15.094762,
		"desc": "1 cable system: LFON (Libyan Fiber Optic Network)",
		"cableCount": 1
	},
	{
		"id": "5889",
		"name": "Miura, Japan",
		"lat": 35.144082,
		"lon": 139.620703,
		"desc": "1 cable system: FLAG Europe-Asia (FEA)",
		"cableCount": 1
	},
	{
		"id": "5896",
		"name": "Mombasa, Kenya",
		"lat": -4.053227,
		"lon": 39.67285,
		"desc": "3 cable systems: Eastern Africa Submarine System (EASSy), SEACOM/Tata TGN-Eurasia, The East African Marine System (TEAMS)",
		"cableCount": 3
	},
	{
		"id": "3255",
		"name": "Monaco, Monaco",
		"lat": 43.73257,
		"lon": 7.417686,
		"desc": "1 cable system: Europe India Gateway (EIG)",
		"cableCount": 1
	},
	{
		"id": "4178",
		"name": "Monrovia, Liberia",
		"lat": 6.30016,
		"lon": -10.797187,
		"desc": "1 cable system: Africa Coast to Europe (ACE)",
		"cableCount": 1
	},
	{
		"id": "6028",
		"name": "Monte Carlo, Monaco",
		"lat": 43.739697,
		"lon": 7.427223,
		"desc": "1 cable system: Italy-Monaco",
		"cableCount": 1
	},
	{
		"id": "8685",
		"name": "Morant Point, Jamaica",
		"lat": 18.349481,
		"lon": -77.816733,
		"desc": "1 cable system: Colombia-Florida Subsea Fiber (CFX-1)",
		"cableCount": 1
	},
	{
		"id": "4227",
		"name": "Moroni, Comoros",
		"lat": -11.700689,
		"lon": 43.243406,
		"desc": "1 cable system: Eastern Africa Submarine System (EASSy)",
		"cableCount": 1
	},
	{
		"id": "5751",
		"name": "Morro Bay, California, United States",
		"lat": 35.36674,
		"lon": -120.847209,
		"desc": "2 cable systems: Japan-U.S. Cable Network (JUS), Southern Cross Cable Network",
		"cableCount": 2
	},
	{
		"id": "4058",
		"name": "Msida, Malta",
		"lat": 35.89869,
		"lon": 14.488125,
		"desc": "1 cable system: Italy-Malta",
		"cableCount": 1
	},
	{
		"id": "5949",
		"name": "Mt. Lavinia, Sri Lanka",
		"lat": 6.832712,
		"lon": 79.866799,
		"desc": "2 cable systems: Bharat Lanka Cable System, SeaMeWe-3",
		"cableCount": 2
	},
	{
		"id": "5942",
		"name": "Mtunzini, South Africa",
		"lat": -28.950645,
		"lon": 31.757858,
		"desc": "4 cable systems: Eastern Africa Submarine System (EASSy), SAFE, SEACOM/Tata TGN-Eurasia, +1 more",
		"cableCount": 4
	},
	{
		"id": "9426",
		"name": "Muanda, Congo,Dem. Rep.",
		"lat": -5.93337,
		"lon": 12.349888,
		"desc": "2 cable systems: Africa Coast to Europe (ACE), West African Cable System (WACS)",
		"cableCount": 2
	},
	{
		"id": "3212",
		"name": "Mumbai, India",
		"lat": 19.075779,
		"lon": 72.875866,
		"desc": "8 cable systems: Europe India Gateway (EIG), FLAG Europe-Asia (FEA), FLAG FALCON, +5 more",
		"cableCount": 8
	},
	{
		"id": "7651",
		"name": "Murdoch, Norway",
		"lat": 54.266352,
		"lon": 2.333449,
		"desc": "1 cable system: NorSea Com",
		"cableCount": 1
	},
	{
		"id": "4225",
		"name": "Muscat, Oman",
		"lat": 23.615167,
		"lon": 58.591033,
		"desc": "1 cable system: SeaMeWe-3",
		"cableCount": 1
	},
	{
		"id": "5866",
		"name": "Nahariyya, Israel",
		"lat": 33.011266,
		"lon": 35.094713,
		"desc": "1 cable system: CIOS",
		"cableCount": 1
	},
	{
		"id": "5362",
		"name": "Nakhodka, Russia",
		"lat": 42.812325,
		"lon": 132.874012,
		"desc": "1 cable system: Russia-Japan Cable Network (RJCN)",
		"cableCount": 1
	},
	{
		"id": "5804",
		"name": "Nanhui, China",
		"lat": 30.306345,
		"lon": 121.191404,
		"desc": "1 cable system: Asia Pacific Gateway (APG)",
		"cableCount": 1
	},
	{
		"id": "10121",
		"name": "Nanny Cay, Virgin Islands (U.K.)",
		"lat": 18.414732,
		"lon": -64.597254,
		"desc": "1 cable system: East-West",
		"cableCount": 1
	},
	{
		"id": "5529",
		"name": "Naoetsu, Japan",
		"lat": 37.169686,
		"lon": 138.242092,
		"desc": "1 cable system: Russia-Japan Cable Network (RJCN)",
		"cableCount": 1
	},
	{
		"id": "8395",
		"name": "Narrow Cape, Alaska, United States",
		"lat": 57.426828,
		"lon": -152.329145,
		"desc": "1 cable system: Kodiak Kenai Fiber Link (KKFL)",
		"cableCount": 1
	},
	{
		"id": "4230",
		"name": "Nassau, Bahamas",
		"lat": 25.06706,
		"lon": -77.340247,
		"desc": "3 cable systems: ARCOS, Bahamas 2, Bahamas Domestic Submarine Network (BDSNi)",
		"cableCount": 3
	},
	{
		"id": "9603",
		"name": "Nasugbu, Philippines",
		"lat": 14.317347,
		"lon": 120.695794,
		"desc": "1 cable system: Southeast Asia Japan Cable (SJC)",
		"cableCount": 1
	},
	{
		"id": "3354",
		"name": "Natal, Brazil",
		"lat": -5.794435,
		"lon": -35.210942,
		"desc": "2 cable systems: WASACE Africa, WASACE Americas",
		"cableCount": 2
	},
	{
		"id": "3711",
		"name": "Nedonna Beach, Oregon, United States",
		"lat": 45.643733,
		"lon": -123.940125,
		"desc": "1 cable system: Trans-Pacific Express (TPE) Cable System",
		"cableCount": 1
	},
	{
		"id": "6183",
		"name": "Needham\u2019s Point, Barbados",
		"lat": 13.078775,
		"lon": -59.612751,
		"desc": "1 cable system: Global Caribbean Network (GCN)",
		"cableCount": 1
	},
	{
		"id": "8366",
		"name": "Nevelsk, Russia",
		"lat": 46.684442,
		"lon": 141.859227,
		"desc": "1 cable system: Hokkaido-Sakhalin Cable System (HSCS)",
		"cableCount": 1
	},
	{
		"id": "9374",
		"name": "New Victoria, NS, Canada",
		"lat": 46.252879,
		"lon": -60.129592,
		"desc": "1 cable system: Persona",
		"cableCount": 1
	},
	{
		"id": "3715",
		"name": "New York, New York, United States",
		"lat": 40.714342,
		"lon": -74.005952,
		"desc": "1 cable system: Seabras-1",
		"cableCount": 1
	},
	{
		"id": "8540",
		"name": "Nikiski, Alaska, United States",
		"lat": 60.689798,
		"lon": -151.291698,
		"desc": "1 cable system: ACS Alaska-Oregon Network (AKORN)",
		"cableCount": 1
	},
	{
		"id": "5890",
		"name": "Ninomiya, Japan",
		"lat": 35.299381,
		"lon": 139.255396,
		"desc": "1 cable system: FLAG Europe-Asia (FEA)",
		"cableCount": 1
	},
	{
		"id": "5840",
		"name": "Norden, Germany",
		"lat": 53.595467,
		"lon": 7.201855,
		"desc": "3 cable systems: Germany-Netherlands, SeaMeWe-3, TAT-14",
		"cableCount": 3
	},
	{
		"id": "10984",
		"name": "Noro, Soloman Islands",
		"lat": -8.241061,
		"lon": 157.199928,
		"desc": "1 cable system: Solomons Oceanic Cable Network",
		"cableCount": 1
	},
	{
		"id": "6171",
		"name": "Norrtalge, Sweden",
		"lat": 59.759615,
		"lon": 18.701357,
		"desc": "1 cable system: Sweden-Finland 4 (SFS-4)",
		"cableCount": 1
	},
	{
		"id": "5772",
		"name": "North Miami Beach, Florida, United States",
		"lat": 25.932896,
		"lon": -80.162369,
		"desc": "1 cable system: ARCOS",
		"cableCount": 1
	},
	{
		"id": "9762",
		"name": "Northport, New York, United States",
		"lat": 40.818744,
		"lon": -72.805276,
		"desc": "1 cable system: FLAG Atlantic-1 (FA-1)",
		"cableCount": 1
	},
	{
		"id": "4192",
		"name": "Nouakchott, Mauritania",
		"lat": 18.083857,
		"lon": -15.978298,
		"desc": "1 cable system: Africa Coast to Europe (ACE)",
		"cableCount": 1
	},
	{
		"id": "5704",
		"name": "Noumea, New Caledonia",
		"lat": -22.303336,
		"lon": 166.439122,
		"desc": "1 cable system: Gondwana-1",
		"cableCount": 1
	},
	{
		"id": "5117",
		"name": "Novorossiysk, Russia",
		"lat": 44.723588,
		"lon": 37.772831,
		"desc": "2 cable systems: Georgia-Russia, ITUR",
		"cableCount": 2
	},
	{
		"id": "10315",
		"name": "Nuku'alofa, Tonga",
		"lat": -21.133329,
		"lon": -175.200006,
		"desc": "1 cable system: Tonga Cable",
		"cableCount": 1
	},
	{
		"id": "8488",
		"name": "Nuuk, Greenland",
		"lat": 64.181149,
		"lon": -51.729983,
		"desc": "1 cable system: Greenland Connect",
		"cableCount": 1
	},
	{
		"id": "10122",
		"name": "Nyali, Kenya",
		"lat": -4.050416,
		"lon": 39.700055,
		"desc": "1 cable system: Lower Indian Ocean Network 2 (LION2)",
		"cableCount": 1
	},
	{
		"id": "5951",
		"name": "Nynashamn, Sweden",
		"lat": 58.902914,
		"lon": 17.946549,
		"desc": "1 cable system: Latvia-Sweden 1 (LV-SE 1)",
		"cableCount": 1
	},
	{
		"id": "5769",
		"name": "Oahu, Hawaii, United States",
		"lat": 21.438883,
		"lon": -158.000042,
		"desc": "1 cable system: APX-East",
		"cableCount": 1
	},
	{
		"id": "7688",
		"name": "Ocho Rios, Jamaica",
		"lat": 18.39857,
		"lon": -77.103234,
		"desc": "1 cable system: ALBA-1",
		"cableCount": 1
	},
	{
		"id": "5355",
		"name": "Odessa, Ukraine",
		"lat": 46.488989,
		"lon": 30.677495,
		"desc": "1 cable system: ITUR",
		"cableCount": 1
	},
	{
		"id": "5886",
		"name": "Okinawa, Japan",
		"lat": 26.212373,
		"lon": 127.680604,
		"desc": "3 cable systems: China-U.S. Cable Network (CHUS), Guam Okinama Kyushu Incheon (GOKI), SeaMeWe-3",
		"cableCount": 3
	},
	{
		"id": "8592",
		"name": "Olbia, Italy",
		"lat": 40.922544,
		"lon": 9.486858,
		"desc": "1 cable system: Janna",
		"cableCount": 1
	},
	{
		"id": "8359",
		"name": "Oran, Algeria",
		"lat": 35.70163,
		"lon": -0.641964,
		"desc": "2 cable systems: Algeria-Spain, Med Cable Network",
		"cableCount": 2
	},
	{
		"id": "4233",
		"name": "Oranjestad, Aruba",
		"lat": 12.52464,
		"lon": -70.02647,
		"desc": "1 cable system: Alonso de Ojeda",
		"cableCount": 1
	},
	{
		"id": "5789",
		"name": "Ostend, Belgium",
		"lat": 51.231159,
		"lon": 2.91263,
		"desc": "2 cable systems: SeaMeWe-3, Tangerine",
		"cableCount": 2
	},
	{
		"id": "10322",
		"name": "Osterby, Denmark",
		"lat": 55.858285,
		"lon": 10.60095,
		"desc": "1 cable system: Kattegat 2",
		"cableCount": 1
	},
	{
		"id": "6027",
		"name": "Otranto, Italy",
		"lat": 40.14806,
		"lon": 18.485726,
		"desc": "1 cable system: Italy-Greece 1",
		"cableCount": 1
	},
	{
		"id": "5778",
		"name": "Oxford Falls, Australia",
		"lat": -33.737386,
		"lon": 151.244986,
		"desc": "1 cable system: Australia-Japan Cable (AJC)",
		"cableCount": 1
	},
	{
		"id": "3145",
		"name": "Oxwich Bay, United Kingdom",
		"lat": 51.557817,
		"lon": -4.169604,
		"desc": "1 cable system: Solas",
		"cableCount": 1
	},
	{
		"id": "5983",
		"name": "Pa Li, Taiwan",
		"lat": 25.14998,
		"lon": 121.383243,
		"desc": "1 cable system: EAC-C2C",
		"cableCount": 1
	},
	{
		"id": "5779",
		"name": "Paddington, Australia",
		"lat": -33.882144,
		"lon": 151.228623,
		"desc": "3 cable systems: Australia-Japan Cable (AJC), Tasman-2, Telstra Endeavour",
		"cableCount": 3
	},
	{
		"id": "9069",
		"name": "Paget, Bermuda",
		"lat": 32.280551,
		"lon": -64.788692,
		"desc": "1 cable system: Challenger Bermuda-1 (CB-1)",
		"cableCount": 1
	},
	{
		"id": "9070",
		"name": "Pago Pago, American Samoa",
		"lat": -14.276512,
		"lon": -170.695703,
		"desc": "2 cable systems: American Samoa-Hawaii (ASH), Samoa-American Samoa (SAS)",
		"cableCount": 2
	},
	{
		"id": "3177",
		"name": "Palermo, Italy",
		"lat": 38.121453,
		"lon": 13.358373,
		"desc": "3 cable systems: FLAG Europe-Asia (FEA), ITUR, SeaMeWe-4",
		"cableCount": 3
	},
	{
		"id": "4723",
		"name": "Palma, Spain",
		"lat": 39.552366,
		"lon": 2.605246,
		"desc": "1 cable system: BalaLink",
		"cableCount": 1
	},
	{
		"id": "10725",
		"name": "Palmarejo, Cape Verde",
		"lat": 14.92308,
		"lon": -23.521257,
		"desc": "1 cable system: West African Cable System (WACS)",
		"cableCount": 1
	},
	{
		"id": "3334",
		"name": "Panama City, Panama",
		"lat": 8.964424,
		"lon": -79.536709,
		"desc": "1 cable system: Pan American (PAN-AM)",
		"cableCount": 1
	},
	{
		"id": "8974",
		"name": "Papenoo, French Polynesia",
		"lat": -17.512379,
		"lon": -149.441068,
		"desc": "1 cable system: Honotua",
		"cableCount": 1
	},
	{
		"id": "9246",
		"name": "Paphos, Cyprus",
		"lat": 34.916405,
		"lon": 32.491986,
		"desc": "1 cable system: Tamares North",
		"cableCount": 1
	},
	{
		"id": "6083",
		"name": "Pargas, Finland",
		"lat": 60.306622,
		"lon": 22.301025,
		"desc": "1 cable system: Sweden-Finland 6",
		"cableCount": 1
	},
	{
		"id": "5822",
		"name": "Pedersker, Denmark",
		"lat": 55.030897,
		"lon": 14.992167,
		"desc": "1 cable system: Baltica",
		"cableCount": 1
	},
	{
		"id": "10373",
		"name": "Pembroke, United Kingdom",
		"lat": 49.509526,
		"lon": -2.537617,
		"desc": "1 cable system: High-capacity Undersea Guernsey Optical-fibre (HUGO)",
		"cableCount": 1
	},
	{
		"id": "3307",
		"name": "Penang, Malaysia",
		"lat": 5.353613,
		"lon": 100.362961,
		"desc": "3 cable systems: FLAG Europe-Asia (FEA), SAFE, SeaMeWe-3",
		"cableCount": 3
	},
	{
		"id": "3119",
		"name": "Penmarch, France",
		"lat": 47.811283,
		"lon": -4.338706,
		"desc": "3 cable systems: Africa Coast to Europe (ACE), SeaMeWe-3, TAGIDE 2",
		"cableCount": 3
	},
	{
		"id": "3734",
		"name": "Pennant Point,NS,Canada",
		"lat": 44.434072,
		"lon": -63.645638,
		"desc": "1 cable system: Canada-United States 1 (CANUS 1)",
		"cableCount": 1
	},
	{
		"id": "5812",
		"name": "Pentaskhinos, Cyprus",
		"lat": 34.828466,
		"lon": 33.603568,
		"desc": "6 cable systems: ALASIA, CADMOS, EUROPA, +3 more",
		"cableCount": 6
	},
	{
		"id": "3239",
		"name": "Perth, Australia",
		"lat": -31.953413,
		"lon": 115.857254,
		"desc": "4 cable systems: APX-West, Australia-Singapore Cable (ASC), Australia-Singapore Submarine Cable-1 (ASSC-1), +1 more",
		"cableCount": 4
	},
	{
		"id": "8550",
		"name": "Petersburg, Alaska, United States",
		"lat": 56.807642,
		"lon": -132.970063,
		"desc": "1 cable system: Alaska United South East",
		"cableCount": 1
	},
	{
		"id": "6050",
		"name": "Pevensey Bay, United Kingdom",
		"lat": 50.819071,
		"lon": 0.366722,
		"desc": "1 cable system: Circe South",
		"cableCount": 1
	},
	{
		"id": "5973",
		"name": "Piti, Guam",
		"lat": 13.464662,
		"lon": 144.694751,
		"desc": "3 cable systems: HANTRU1 Cable System, Pipe Pacific Cable-1 (PPC-1), Tata TGN-Pacific",
		"cableCount": 3
	},
	{
		"id": "5836",
		"name": "Plerin, France",
		"lat": 48.534771,
		"lon": -2.768055,
		"desc": "1 cable system: FLAG Atlantic-1 (FA-1)",
		"cableCount": 1
	},
	{
		"id": "4355",
		"name": "Plymouth, Montserrat",
		"lat": 16.706551,
		"lon": -62.215729,
		"desc": "1 cable system: Eastern Caribbean Fiber System (ECFS)",
		"cableCount": 1
	},
	{
		"id": "9062",
		"name": "Pohnpei, Federated States of Micronesia",
		"lat": 7.786486,
		"lon": 159.070234,
		"desc": "1 cable system: HANTRU1 Cable System",
		"cableCount": 1
	},
	{
		"id": "5971",
		"name": "Point Noire, Congo,Rep.",
		"lat": -4.779123,
		"lon": 11.863614,
		"desc": "1 cable system: West African Cable System (WACS)",
		"cableCount": 1
	},
	{
		"id": "4906",
		"name": "Pointe-a-Pitre, Guadeloupe",
		"lat": 16.241058,
		"lon": -61.533099,
		"desc": "1 cable system: Eastern Caribbean Fiber System (ECFS)",
		"cableCount": 1
	},
	{
		"id": "5945",
		"name": "Ponta Delgada, Portugal",
		"lat": 37.739281,
		"lon": -25.668781,
		"desc": "1 cable system: Columbus-III",
		"cableCount": 1
	},
	{
		"id": "8847",
		"name": "Port Elizabeth, South Africa",
		"lat": -33.932638,
		"lon": 25.569918,
		"desc": "1 cable system: South Atlantic Express (SAEx)",
		"cableCount": 1
	},
	{
		"id": "10818",
		"name": "Port Gentil, Gabon",
		"lat": -0.720989,
		"lon": 8.781641,
		"desc": "1 cable system: Libreville-Port Gentil Cable",
		"cableCount": 1
	},
	{
		"id": "10363",
		"name": "Port Nelson, Bahamas",
		"lat": 23.652109,
		"lon": -74.840567,
		"desc": "1 cable system: Bahamas Domestic Submarine Network (BDSNi)",
		"cableCount": 1
	},
	{
		"id": "4236",
		"name": "Port of Spain, Trinidad and Tobago",
		"lat": 10.649817,
		"lon": -61.516686,
		"desc": "1 cable system: Americas-II",
		"cableCount": 1
	},
	{
		"id": "5950",
		"name": "Port Sudan, Sudan",
		"lat": 19.615558,
		"lon": 37.2197,
		"desc": "4 cable systems: Eastern Africa Submarine System (EASSy), FLAG FALCON, Saudi Arabia-Sudan-1 (SAS-1), +1 more",
		"cableCount": 4
	},
	{
		"id": "9086",
		"name": "Port Vila, Vanuatu",
		"lat": -17.730419,
		"lon": 168.32288,
		"desc": "1 cable system: Interchange Cable Network (ICN)",
		"cableCount": 1
	},
	{
		"id": "3878",
		"name": "Port-au-Prince, Haiti",
		"lat": 18.542725,
		"lon": -72.343146,
		"desc": "2 cable systems: Bahamas Domestic Submarine Network (BDSNi), Fibralink",
		"cableCount": 2
	},
	{
		"id": "3082",
		"name": "Porthcurno, United Kingdom",
		"lat": 50.043081,
		"lon": -5.654525,
		"desc": "2 cable systems: FLAG Europe-Asia (FEA), High-capacity Undersea Guernsey Optical-fibre (HUGO)",
		"cableCount": 2
	},
	{
		"id": "5530",
		"name": "Poti, Georgia",
		"lat": 42.150776,
		"lon": 41.667635,
		"desc": "2 cable systems: Caucasus Cable System, Georgia-Russia",
		"cableCount": 2
	},
	{
		"id": "5744",
		"name": "Pottington, United Kingdom",
		"lat": 51.11983,
		"lon": -4.227829,
		"desc": "2 cable systems: Tata TGN-Atlantic, Tata TGN-Western Europe",
		"cableCount": 2
	},
	{
		"id": "8972",
		"name": "Pozzallo, Italy",
		"lat": 36.733707,
		"lon": 14.853834,
		"desc": "1 cable system: Melita 1",
		"cableCount": 1
	},
	{
		"id": "4257",
		"name": "Praia, Cape Verde",
		"lat": 14.92308,
		"lon": -23.521257,
		"desc": "1 cable system: Atlantis-2",
		"cableCount": 1
	},
	{
		"id": "4258",
		"name": "Providenciales, Turks and Caicos Islands",
		"lat": 21.851071,
		"lon": -72.120237,
		"desc": "1 cable system: ARCOS",
		"cableCount": 1
	},
	{
		"id": "5848",
		"name": "Puerto Barrios, Guatemala",
		"lat": 15.727178,
		"lon": -88.597215,
		"desc": "3 cable systems: America Movil Submarine Cable System-1 (AMX-1), ARCOS, South America-1 (SAm-1)",
		"cableCount": 3
	},
	{
		"id": "5921",
		"name": "Puerto Cabezas, Nicaragua",
		"lat": 14.021607,
		"lon": -83.393919,
		"desc": "1 cable system: ARCOS",
		"cableCount": 1
	},
	{
		"id": "5851",
		"name": "Puerto Cortes, Honduras",
		"lat": 15.844831,
		"lon": -87.946056,
		"desc": "2 cable systems: ARCOS, Maya-1",
		"cableCount": 2
	},
	{
		"id": "5692",
		"name": "Puerto Lempira, Honduras",
		"lat": 15.261283,
		"lon": -83.776794,
		"desc": "1 cable system: ARCOS",
		"cableCount": 1
	},
	{
		"id": "5810",
		"name": "Puerto Limon, Costa Rica",
		"lat": 9.98857,
		"lon": -83.037697,
		"desc": "2 cable systems: ARCOS, Maya-1",
		"cableCount": 2
	},
	{
		"id": "5823",
		"name": "Puerto Plata, Dominican Republic",
		"lat": 19.799366,
		"lon": -70.691232,
		"desc": "3 cable systems: America Movil Submarine Cable System-1 (AMX-1), ARCOS, Fibralink",
		"cableCount": 3
	},
	{
		"id": "5849",
		"name": "Puerto San Jose, Guatemala",
		"lat": 13.934572,
		"lon": -90.822237,
		"desc": "1 cable system: South America-1 (SAm-1)",
		"cableCount": 1
	},
	{
		"id": "5967",
		"name": "Puerto Viejo, Venezuela",
		"lat": 10.722397,
		"lon": -62.473924,
		"desc": "1 cable system: South American Crossing (SAC)/Latin American Nautilus (LAN)",
		"cableCount": 1
	},
	{
		"id": "5694",
		"name": "Punta Cana, Dominican Republic",
		"lat": 18.621328,
		"lon": -68.438252,
		"desc": "2 cable systems: Antillas 1, ARCOS",
		"cableCount": 2
	},
	{
		"id": "5824",
		"name": "Punta Carnero, Ecuador",
		"lat": -2.272968,
		"lon": -80.914417,
		"desc": "2 cable systems: Pan American (PAN-AM), South America-1 (SAm-1)",
		"cableCount": 2
	},
	{
		"id": "5965",
		"name": "Punto Fijo, Venezuela",
		"lat": 11.708596,
		"lon": -70.204356,
		"desc": "2 cable systems: ARCOS, Pan American (PAN-AM)",
		"cableCount": 2
	},
	{
		"id": "4183",
		"name": "Pusan, Korea,Rep.",
		"lat": 35.170083,
		"lon": 128.999384,
		"desc": "6 cable systems: APCN-2, Asia Pacific Gateway (APG), China-U.S. Cable Network (CHUS), +3 more",
		"cableCount": 6
	},
	{
		"id": "5839",
		"name": "Puttgarden, Germany",
		"lat": 54.496037,
		"lon": 11.212506,
		"desc": "1 cable system: Fehmarn B\u00e4lt",
		"cableCount": 1
	},
	{
		"id": "5911",
		"name": "Pyapon, Myanmar",
		"lat": 16.282216,
		"lon": 95.682028,
		"desc": "1 cable system: SeaMeWe-3",
		"cableCount": 1
	},
	{
		"id": "10684",
		"name": "Qalhat, Oman",
		"lat": 23.615167,
		"lon": 58.591033,
		"desc": "1 cable system: Tata TGN-Gulf",
		"cableCount": 1
	},
	{
		"id": "8543",
		"name": "Qaqortoq, Greenland",
		"lat": 60.71891,
		"lon": -46.035394,
		"desc": "1 cable system: Greenland Connect",
		"cableCount": 1
	},
	{
		"id": "6012",
		"name": "Qingdao, China",
		"lat": 36.087115,
		"lon": 120.342634,
		"desc": "2 cable systems: EAC-C2C, Trans-Pacific Express (TPE) Cable System",
		"cableCount": 2
	},
	{
		"id": "7869",
		"name": "Ras Lanuf, Libya",
		"lat": 30.586725,
		"lon": 18.411942,
		"desc": "1 cable system: LFON (Libyan Fiber Optic Network)",
		"cableCount": 1
	},
	{
		"id": "3085",
		"name": "Redcar, United Kingdom",
		"lat": 54.613891,
		"lon": -1.068206,
		"desc": "1 cable system: Pangea North",
		"cableCount": 1
	},
	{
		"id": "4992",
		"name": "Redondo Beach, California, United States",
		"lat": 33.844375,
		"lon": -118.387985,
		"desc": "1 cable system: Unity/EAC-Pacific",
		"cableCount": 1
	},
	{
		"id": "8970",
		"name": "Rengit, Malaysia",
		"lat": 1.67715,
		"lon": 103.14769,
		"desc": "1 cable system: Batam-Rengit Cable System (BRCS)",
		"cableCount": 1
	},
	{
		"id": "5842",
		"name": "Ribnitz, Germany",
		"lat": 54.243363,
		"lon": 12.431502,
		"desc": "1 cable system: Germany-Denmark 2",
		"cableCount": 1
	},
	{
		"id": "8354",
		"name": "Riding Point, Bahamas",
		"lat": 24.424987,
		"lon": -76.574447,
		"desc": "1 cable system: Bahamas Internet Cable System (BICS)",
		"cableCount": 1
	},
	{
		"id": "3242",
		"name": "Rio de Janeiro, Brazil",
		"lat": -22.903448,
		"lon": -43.209557,
		"desc": "5 cable systems: America Movil Submarine Cable System-1 (AMX-1), GlobeNet, South America-1 (SAm-1), +2 more",
		"cableCount": 5
	},
	{
		"id": "5807",
		"name": "Riohacha, Colombia",
		"lat": 11.482927,
		"lon": -72.952744,
		"desc": "1 cable system: ARCOS",
		"cableCount": 1
	},
	{
		"id": "5814",
		"name": "Rodbyhavn, Denmark",
		"lat": 54.66308,
		"lon": 11.358669,
		"desc": "1 cable system: Fehmarn B\u00e4lt",
		"cableCount": 1
	},
	{
		"id": "8837",
		"name": "Rodney Bay, Saint Lucia",
		"lat": 14.035661,
		"lon": -60.988552,
		"desc": "1 cable system: Global Caribbean Network (GCN)",
		"cableCount": 1
	},
	{
		"id": "9375",
		"name": "Rose Blanche, NL, Canada",
		"lat": 47.617637,
		"lon": -58.686583,
		"desc": "1 cable system: Persona",
		"cableCount": 1
	},
	{
		"id": "4260",
		"name": "Roseau, Dominica",
		"lat": 15.251746,
		"lon": -61.370724,
		"desc": "1 cable system: Eastern Caribbean Fiber System (ECFS)",
		"cableCount": 1
	},
	{
		"id": "10400",
		"name": "Rota, Spain",
		"lat": 36.616957,
		"lon": -6.358186,
		"desc": "1 cable system: Loukkos",
		"cableCount": 1
	},
	{
		"id": "10606",
		"name": "Saeby, Denmark",
		"lat": 57.330858,
		"lon": 10.516625,
		"desc": "1 cable system: Kattegat 1",
		"cableCount": 1
	},
	{
		"id": "6047",
		"name": "Saida, Lebanon",
		"lat": 33.450157,
		"lon": 35.386236,
		"desc": "1 cable system: Berytar",
		"cableCount": 1
	},
	{
		"id": "7876",
		"name": "Saint Barthelemy, Guadeloupe",
		"lat": 17.900049,
		"lon": -62.833409,
		"desc": "1 cable system: Global Caribbean Network (GCN)",
		"cableCount": 1
	},
	{
		"id": "3188",
		"name": "Saint Maarten, Netherlands Antilles",
		"lat": 18.031054,
		"lon": -63.073735,
		"desc": "2 cable systems: Eastern Caribbean Fiber System (ECFS), Saint Maarten Puerto Rico Network One (SMPR-1)",
		"cableCount": 2
	},
	{
		"id": "7875",
		"name": "Saint Martin, Guadeloupe",
		"lat": 18.092792,
		"lon": -63.050094,
		"desc": "1 cable system: Global Caribbean Network (GCN)",
		"cableCount": 1
	},
	{
		"id": "5978",
		"name": "Saint Paul, R\u00e9union",
		"lat": -21.000216,
		"lon": 55.279174,
		"desc": "1 cable system: SAFE",
		"cableCount": 1
	},
	{
		"id": "9399",
		"name": "Sainte Marie, R\u00e9union",
		"lat": -20.897319,
		"lon": 55.549917,
		"desc": "1 cable system: Lower Indian Ocean Network (LION)",
		"cableCount": 1
	},
	{
		"id": "10374",
		"name": "Saints Bay, United Kingdom",
		"lat": 49.423294,
		"lon": -2.558046,
		"desc": "2 cable systems: Guernsey-Jersey-4, High-capacity Undersea Guernsey Optical-fibre (HUGO)",
		"cableCount": 2
	},
	{
		"id": "10307",
		"name": "Sakra Island, Singapore",
		"lat": 1.258838,
		"lon": 103.704234,
		"desc": "1 cable system: PGASCOM",
		"cableCount": 1
	},
	{
		"id": "3342",
		"name": "Salvador, Brazil",
		"lat": -12.969979,
		"lon": -38.504631,
		"desc": "2 cable systems: America Movil Submarine Cable System-1 (AMX-1), South America-1 (SAm-1)",
		"cableCount": 2
	},
	{
		"id": "10382",
		"name": "Samandag, Turkey",
		"lat": 36.082297,
		"lon": 35.999298,
		"desc": "1 cable system: Turcyos-2",
		"cableCount": 1
	},
	{
		"id": "4262",
		"name": "San Juan, Puerto Rico, United States",
		"lat": 18.465829,
		"lon": -66.106669,
		"desc": "4 cable systems: America Movil Submarine Cable System-1 (AMX-1), Global Caribbean Network (GCN), Pacific Caribbean Cable System (PCCS), +1 more",
		"cableCount": 4
	},
	{
		"id": "3772",
		"name": "San Luis Obispo, California, United States",
		"lat": 35.285025,
		"lon": -120.662699,
		"desc": "2 cable systems: Asia-America Gateway (AAG) Cable System, China-U.S. Cable Network (CHUS)",
		"cableCount": 2
	},
	{
		"id": "4496",
		"name": "San Sebasti\u00e1n, Spain",
		"lat": 43.320783,
		"lon": -1.984436,
		"desc": "1 cable system: WASACE Europe",
		"cableCount": 1
	},
	{
		"id": "8683",
		"name": "Sandwick, United Kingdom",
		"lat": 59.996026,
		"lon": -1.238663,
		"desc": "1 cable system: SHEFA-2",
		"cableCount": 1
	},
	{
		"id": "10799",
		"name": "Sandy Point, Australia",
		"lat": -38.820168,
		"lon": 146.119641,
		"desc": "1 cable system: Bass Strait-1",
		"cableCount": 1
	},
	{
		"id": "5788",
		"name": "Sandy Point, Bahamas",
		"lat": 26.025151,
		"lon": -77.399525,
		"desc": "2 cable systems: Bahamas Domestic Submarine Network (BDSNi), Bahamas Internet Cable System (BICS)",
		"cableCount": 2
	},
	{
		"id": "5865",
		"name": "Sandymount, Ireland",
		"lat": 53.33145,
		"lon": -6.215436,
		"desc": "1 cable system: ESAT-2",
		"cableCount": 1
	},
	{
		"id": "10727",
		"name": "Sangano, Angola",
		"lat": -8.812863,
		"lon": 13.234998,
		"desc": "1 cable system: West African Cable System (WACS)",
		"cableCount": 1
	},
	{
		"id": "10094",
		"name": "Santana, Sao Tome and Principe",
		"lat": 0.8596,
		"lon": 6.532877,
		"desc": "1 cable system: Africa Coast to Europe (ACE)",
		"cableCount": 1
	},
	{
		"id": "4242",
		"name": "Santo Domingo, Dominican Republic",
		"lat": 18.49996,
		"lon": -69.983304,
		"desc": "1 cable system: Antillas 1",
		"cableCount": 1
	},
	{
		"id": "3411",
		"name": "Santos, Brazil",
		"lat": -23.961926,
		"lon": -46.328071,
		"desc": "6 cable systems: Seabras-1, South America-1 (SAm-1), South American Crossing (SAC)/Latin American Nautilus (LAN), +3 more",
		"cableCount": 6
	},
	{
		"id": "5956",
		"name": "Satun, Thailand",
		"lat": 6.613166,
		"lon": 100.066118,
		"desc": "3 cable systems: FLAG Europe-Asia (FEA), SeaMeWe-3, SeaMeWe-4",
		"cableCount": 3
	},
	{
		"id": "5880",
		"name": "Savona, Italy",
		"lat": 44.305577,
		"lon": 8.483793,
		"desc": "2 cable systems: BARSAV, Italy-Monaco",
		"cableCount": 2
	},
	{
		"id": "10353",
		"name": "Schiehallion, United Kingdom",
		"lat": 60.333124,
		"lon": -4.333436,
		"desc": "1 cable system: SHEFA-2",
		"cableCount": 1
	},
	{
		"id": "9058",
		"name": "Seixal, Portugal",
		"lat": 38.642259,
		"lon": -9.107377,
		"desc": "2 cable systems: Main One, West African Cable System (WACS)",
		"cableCount": 2
	},
	{
		"id": "5742",
		"name": "Sennen Cove, United Kingdom",
		"lat": 50.076109,
		"lon": -5.698745,
		"desc": "2 cable systems: Celtic, ESAT-1",
		"cableCount": 2
	},
	{
		"id": "5948",
		"name": "Ses Covetes, Spain",
		"lat": 39.354604,
		"lon": 2.971005,
		"desc": "1 cable system: ALPAL-2",
		"cableCount": 1
	},
	{
		"id": "5934",
		"name": "Sesimbra, Portugal",
		"lat": 38.44269,
		"lon": -9.10276,
		"desc": "5 cable systems: Eurafrica, Europe India Gateway (EIG), SAT-3/WASC, +2 more",
		"cableCount": 5
	},
	{
		"id": "5755",
		"name": "Seward, Alaska, United States",
		"lat": 60.112173,
		"lon": -149.443126,
		"desc": "2 cable systems: Alaska United West, Kodiak Kenai Fiber Link (KKFL)",
		"cableCount": 2
	},
	{
		"id": "5859",
		"name": "Seydisfjordur, Iceland",
		"lat": 65.251372,
		"lon": -14.018046,
		"desc": "1 cable system: FARICE-1",
		"cableCount": 1
	},
	{
		"id": "3246",
		"name": "Shanghai, China",
		"lat": 31.247571,
		"lon": 121.472487,
		"desc": "3 cable systems: EAC-C2C, FLAG Europe-Asia (FEA), SeaMeWe-3",
		"cableCount": 3
	},
	{
		"id": "5803",
		"name": "Shantou, China",
		"lat": 23.354563,
		"lon": 116.675506,
		"desc": "4 cable systems: APCN-2, China-U.S. Cable Network (CHUS), SeaMeWe-3, +1 more",
		"cableCount": 4
	},
	{
		"id": "5883",
		"name": "Shima, Japan",
		"lat": 34.336772,
		"lon": 136.874423,
		"desc": "5 cable systems: Asia Pacific Gateway (APG), Australia-Japan Cable (AJC), EAC-C2C, +2 more",
		"cableCount": 5
	},
	{
		"id": "5977",
		"name": "Shindu-Ri, Korea,Rep.",
		"lat": 36.5763,
		"lon": 126.391638,
		"desc": "1 cable system: EAC-C2C",
		"cableCount": 1
	},
	{
		"id": "3783",
		"name": "Shirley, New York, United States",
		"lat": 40.800273,
		"lon": -72.872234,
		"desc": "2 cable systems: Apollo, Emerald Express",
		"cableCount": 2
	},
	{
		"id": "8351",
		"name": "Siboney, Cuba",
		"lat": 19.963699,
		"lon": -75.712376,
		"desc": "1 cable system: ALBA-1",
		"cableCount": 1
	},
	{
		"id": "3029",
		"name": "Singapore, Singapore",
		"lat": 1.293672,
		"lon": 103.853007,
		"desc": "2 cable systems: APX-West, Australia-Singapore Submarine Cable-1 (ASSC-1)",
		"cableCount": 2
	},
	{
		"id": "7868",
		"name": "Sirt, Libya",
		"lat": 31.205308,
		"lon": 16.588316,
		"desc": "1 cable system: LFON (Libyan Fiber Optic Network)",
		"cableCount": 1
	},
	{
		"id": "8554",
		"name": "Sitka, Alaska, United States",
		"lat": 57.052887,
		"lon": -135.334372,
		"desc": "1 cable system: Alaska United South East",
		"cableCount": 1
	},
	{
		"id": "8398",
		"name": "Sizewell, United Kingdom",
		"lat": 52.207118,
		"lon": 1.620301,
		"desc": "1 cable system: Concerto",
		"cableCount": 1
	},
	{
		"id": "10323",
		"name": "Skalvik, Sweden",
		"lat": 56.683163,
		"lon": 12.683272,
		"desc": "1 cable system: Kattegat 2",
		"cableCount": 1
	},
	{
		"id": "5741",
		"name": "Skewjack, United Kingdom",
		"lat": 50.06356,
		"lon": -5.675054,
		"desc": "1 cable system: FLAG Atlantic-1 (FA-1)",
		"cableCount": 1
	},
	{
		"id": "5092",
		"name": "Sochi, Russia",
		"lat": 43.615519,
		"lon": 39.725855,
		"desc": "1 cable system: Georgia-Russia",
		"cableCount": 1
	},
	{
		"id": "4265",
		"name": "Songkhla, Thailand",
		"lat": 7.078459,
		"lon": 100.596963,
		"desc": "4 cable systems: Asia Pacific Gateway (APG), FLAG Europe-Asia (FEA), Southeast Asia Japan Cable (SJC), +1 more",
		"cableCount": 4
	},
	{
		"id": "10604",
		"name": "Soroosh Platform, Iran",
		"lat": 29.072491,
		"lon": 49.478025,
		"desc": "1 cable system: Kuwait-Iran",
		"cableCount": 1
	},
	{
		"id": "10780",
		"name": "South Arne",
		"lat": 56.078332,
		"lon": 4.228399,
		"desc": "1 cable system: CANTAT-3",
		"cableCount": 1
	},
	{
		"id": "3324",
		"name": "Southport, United Kingdom",
		"lat": 53.647969,
		"lon": -3.006373,
		"desc": "2 cable systems: ESAT-2, Hibernia Atlantic",
		"cableCount": 2
	},
	{
		"id": "8357",
		"name": "Spanish River Park, Florida, United States",
		"lat": 26.378011,
		"lon": -80.067705,
		"desc": "1 cable system: Bahamas Internet Cable System (BICS)",
		"cableCount": 1
	},
	{
		"id": "5752",
		"name": "Spencer Beach, Hawaii, United States",
		"lat": 20.023128,
		"lon": -155.822051,
		"desc": "1 cable system: Southern Cross Cable Network",
		"cableCount": 1
	},
	{
		"id": "6014",
		"name": "Sri Racha, Thailand",
		"lat": 13.174444,
		"lon": 100.930548,
		"desc": "1 cable system: Asia-America Gateway (AAG) Cable System",
		"cableCount": 1
	},
	{
		"id": "5750",
		"name": "St. Croix, Virgin Islands, United States",
		"lat": 17.771855,
		"lon": -64.81941,
		"desc": "5 cable systems: Americas-II, Global Caribbean Network (GCN), Mid-Atlantic Crossing (MAC), +2 more",
		"cableCount": 5
	},
	{
		"id": "5793",
		"name": "St. David\u2019s, Bermuda",
		"lat": 32.312172,
		"lon": -64.769518,
		"desc": "4 cable systems: Caribbean-Bermuda U.S. (CBUS), Gemini Bermuda, GlobeNet, +1 more",
		"cableCount": 4
	},
	{
		"id": "4244",
		"name": "St. George\u2019s, Grenada",
		"lat": 12.187943,
		"lon": -61.711637,
		"desc": "1 cable system: Global Caribbean Network (GCN)",
		"cableCount": 1
	},
	{
		"id": "5834",
		"name": "St. Hilaire, France",
		"lat": 46.72018,
		"lon": -1.945887,
		"desc": "1 cable system: Eurafrica",
		"cableCount": 1
	},
	{
		"id": "4239",
		"name": "St. John\u2019s, Antigua and Barbuda",
		"lat": 17.05148,
		"lon": -61.857951,
		"desc": "2 cable systems: Eastern Caribbean Fiber System (ECFS), Global Caribbean Network (GCN)",
		"cableCount": 2
	},
	{
		"id": "10379",
		"name": "St. Ouens Bay, Jersey",
		"lat": 49.215694,
		"lon": -2.225916,
		"desc": "1 cable system: UK-Channel Islands-8",
		"cableCount": 1
	},
	{
		"id": "8561",
		"name": "St. Paul's Bay, Malta",
		"lat": 35.950389,
		"lon": 14.415646,
		"desc": "1 cable system: GO-1 Mediterranean Cable System",
		"cableCount": 1
	},
	{
		"id": "4359",
		"name": "St. Thomas, Virgin Islands (U.S.)",
		"lat": 18.324484,
		"lon": -64.904438,
		"desc": "1 cable system: Pan American (PAN-AM)",
		"cableCount": 1
	},
	{
		"id": "5331",
		"name": "St. Val\u00e9ry, France",
		"lat": 49.860478,
		"lon": 0.708439,
		"desc": "1 cable system: TAT-14",
		"cableCount": 1
	},
	{
		"id": "7861",
		"name": "Stanley, Australia",
		"lat": -40.760443,
		"lon": 145.29406,
		"desc": "1 cable system: Bass Strait-2",
		"cableCount": 1
	},
	{
		"id": "5952",
		"name": "Stavsnas, Sweden",
		"lat": 59.822758,
		"lon": 18.764601,
		"desc": "2 cable systems: BCS North - Phase 1, Sweden-Estonia (EE-S 1)",
		"cableCount": 2
	},
	{
		"id": "3063",
		"name": "Stockholm, Sweden",
		"lat": 59.332168,
		"lon": 18.062897,
		"desc": "3 cable systems: BCF-1, Pangea Baltic Ring, Sweden-Finland 6",
		"cableCount": 3
	},
	{
		"id": "5825",
		"name": "Suez, Egypt",
		"lat": 29.972258,
		"lon": 32.530133,
		"desc": "5 cable systems: FLAG Europe-Asia (FEA), FLAG FALCON, IMEWE, +2 more",
		"cableCount": 5
	},
	{
		"id": "9094",
		"name": "Sungai Kakap, Indonesia",
		"lat": -0.06707,
		"lon": 109.183242,
		"desc": "1 cable system: JAKABARE",
		"cableCount": 1
	},
	{
		"id": "10378",
		"name": "Surville, France",
		"lat": 49.283254,
		"lon": -1.649997,
		"desc": "1 cable system: INGRID",
		"cableCount": 1
	},
	{
		"id": "4268",
		"name": "Suva, Fiji",
		"lat": -18.123834,
		"lon": 178.437446,
		"desc": "3 cable systems: Interchange Cable Network (ICN), Southern Cross Cable Network, Tonga Cable",
		"cableCount": 3
	},
	{
		"id": "5311",
		"name": "Sventoji, Lithuania",
		"lat": 56.02834,
		"lon": 21.08243,
		"desc": "2 cable systems: BCS East, BCS East-West Interlink",
		"cableCount": 2
	},
	{
		"id": "9845",
		"name": "Swakopmund, Namibia",
		"lat": -22.67828,
		"lon": 14.528079,
		"desc": "2 cable systems: Africa Coast to Europe (ACE), West African Cable System (WACS)",
		"cableCount": 2
	},
	{
		"id": "3030",
		"name": "Sydney, Australia",
		"lat": -33.869897,
		"lon": 151.20704,
		"desc": "6 cable systems: APX-East, Australia-Papua New Guinea-2 (APNG-2), Gondwana-1, +3 more",
		"cableCount": 6
	},
	{
		"id": "3142",
		"name": "Sylt, Germany",
		"lat": 54.898487,
		"lon": 8.383407,
		"desc": "2 cable systems: Atlantic Crossing-1 (AC-1), CANTAT-3",
		"cableCount": 2
	},
	{
		"id": "5900",
		"name": "Taipa, China",
		"lat": 22.156146,
		"lon": 113.561007,
		"desc": "1 cable system: SeaMeWe-3",
		"cableCount": 1
	},
	{
		"id": "5918",
		"name": "Takapuna, New Zealand",
		"lat": -36.787938,
		"lon": 174.767909,
		"desc": "1 cable system: Southern Cross Cable Network",
		"cableCount": 1
	},
	{
		"id": "3089",
		"name": "Tallinn, Estonia",
		"lat": 59.436169,
		"lon": 24.752369,
		"desc": "4 cable systems: Finland Estonia Connection (FEC), Finland-Estonia 2 (EESF-2), Pangea Baltic Ring, +1 more",
		"cableCount": 4
	},
	{
		"id": "9135",
		"name": "Tanah Merah, Singapore",
		"lat": 1.327202,
		"lon": 103.946567,
		"desc": "2 cable systems: Asia Pacific Gateway (APG), Australia-Singapore Cable (ASC)",
		"cableCount": 2
	},
	{
		"id": "3251",
		"name": "Tanguisson Point, Guam",
		"lat": 13.549087,
		"lon": 144.809393,
		"desc": "3 cable systems: Asia-America Gateway (AAG) Cable System, Australia-Japan Cable (AJC), China-U.S. Cable Network (CHUS)",
		"cableCount": 3
	},
	{
		"id": "9096",
		"name": "Tanjung Bemban, Indonesia",
		"lat": 1.173208,
		"lon": 104.133186,
		"desc": "1 cable system: JAKABARE",
		"cableCount": 1
	},
	{
		"id": "9095",
		"name": "Tanjung Pakis, Indonesia",
		"lat": -5.981455,
		"lon": 107.120897,
		"desc": "1 cable system: JAKABARE",
		"cableCount": 1
	},
	{
		"id": "5982",
		"name": "Tanshui, Taiwan",
		"lat": 25.1813,
		"lon": 121.462649,
		"desc": "4 cable systems: APCN-2, EAC-C2C, Taiwan Strait Express-1 (TSE)-1, +1 more",
		"cableCount": 4
	},
	{
		"id": "6030",
		"name": "Tartous, Syria",
		"lat": 34.89171,
		"lon": 35.897807,
		"desc": "4 cable systems: ALASIA, Aletar, Berytar, +1 more",
		"cableCount": 4
	},
	{
		"id": "3213",
		"name": "Tel Aviv, Israel",
		"lat": 32.044642,
		"lon": 34.769661,
		"desc": "3 cable systems: Jonah, Lev Submarine System, MedNautilus Submarine System",
		"cableCount": 3
	},
	{
		"id": "10309",
		"name": "Telisai, Brunei",
		"lat": 4.70371,
		"lon": 114.570597,
		"desc": "1 cable system: Southeast Asia Japan Cable (SJC)",
		"cableCount": 1
	},
	{
		"id": "7713",
		"name": "Tenerife,Canary Islands, Spain",
		"lat": 28.292788,
		"lon": -16.522745,
		"desc": "4 cable systems: Africa Coast to Europe (ACE), CanaLink, Pencan-8, +1 more",
		"cableCount": 4
	},
	{
		"id": "9400",
		"name": "Terre Rouge, Mauritius",
		"lat": -20.077862,
		"lon": 57.510069,
		"desc": "1 cable system: Lower Indian Ocean Network (LION)",
		"cableCount": 1
	},
	{
		"id": "5909",
		"name": "T\u00e9touan, Morocco",
		"lat": 35.565908,
		"lon": -5.391813,
		"desc": "2 cable systems: Estepona-Tetouan, SeaMeWe-3",
		"cableCount": 2
	},
	{
		"id": "4195",
		"name": "The Valley, Anguilla",
		"lat": 18.217372,
		"lon": -63.057221,
		"desc": "1 cable system: Eastern Caribbean Fiber System (ECFS)",
		"cableCount": 1
	},
	{
		"id": "6054",
		"name": "Thisted, Denmark",
		"lat": 56.959126,
		"lon": 8.70354,
		"desc": "1 cable system: Denmark-Norway 6",
		"cableCount": 1
	},
	{
		"id": "8399",
		"name": "Thorpeness, United Kingdom",
		"lat": 52.180817,
		"lon": 1.613074,
		"desc": "1 cable system: Concerto",
		"cableCount": 1
	},
	{
		"id": "3484",
		"name": "Tijuana, Mexico",
		"lat": 32.530815,
		"lon": -117.038185,
		"desc": "1 cable system: Pan-American Crossing (PAC)",
		"cableCount": 1
	},
	{
		"id": "5724",
		"name": "Tjornuvik, Faeroe Islands",
		"lat": 62.289963,
		"lon": -7.147226,
		"desc": "1 cable system: CANTAT-3",
		"cableCount": 1
	},
	{
		"id": "9398",
		"name": "Toamasina, Madagascar",
		"lat": -18.146221,
		"lon": 49.400326,
		"desc": "1 cable system: Lower Indian Ocean Network (LION)",
		"cableCount": 1
	},
	{
		"id": "7874",
		"name": "Tobrok, Libya",
		"lat": 32.079576,
		"lon": 23.960317,
		"desc": "1 cable system: LFON (Libyan Fiber Optic Network)",
		"cableCount": 1
	},
	{
		"id": "7398",
		"name": "Toliary, Madagascar",
		"lat": -23.354787,
		"lon": 43.663123,
		"desc": "1 cable system: Eastern Africa Submarine System (EASSy)",
		"cableCount": 1
	},
	{
		"id": "7872",
		"name": "Tolmeta, Libya",
		"lat": 32.716731,
		"lon": 20.95002,
		"desc": "1 cable system: LFON (Libyan Fiber Optic Network)",
		"cableCount": 1
	},
	{
		"id": "5808",
		"name": "Tolu, Colombia",
		"lat": 9.496273,
		"lon": -75.558583,
		"desc": "1 cable system: Maya-1",
		"cableCount": 1
	},
	{
		"id": "5855",
		"name": "Tong Fuk, Hong Kong",
		"lat": 22.22732,
		"lon": 113.932137,
		"desc": "1 cable system: FLAG North Asia Loop/REACH North Asia Loop",
		"cableCount": 1
	},
	{
		"id": "8681",
		"name": "Torshavn, Faeroe Islands",
		"lat": 62.017513,
		"lon": -6.77183,
		"desc": "1 cable system: SHEFA-2",
		"cableCount": 1
	},
	{
		"id": "9589",
		"name": "Tortola, Virgin Islands (U.K.)",
		"lat": 18.414732,
		"lon": -64.597254,
		"desc": "2 cable systems: Caribbean-Bermuda U.S. (CBUS), Pacific Caribbean Cable System (PCCS)",
		"cableCount": 2
	},
	{
		"id": "9669",
		"name": "Totness, Suriname",
		"lat": 5.886567,
		"lon": -56.375379,
		"desc": "1 cable system: Suriname-Guyana Submarine Cable System (SG-SCS)",
		"cableCount": 1
	},
	{
		"id": "5981",
		"name": "Toucheng, Taiwan",
		"lat": 24.863576,
		"lon": 121.801454,
		"desc": "3 cable systems: Asia Pacific Gateway (APG), FLAG North Asia Loop/REACH North Asia Loop, SeaMeWe-3",
		"cableCount": 3
	},
	{
		"id": "5893",
		"name": "Toyohashi, Japan",
		"lat": 34.769038,
		"lon": 137.391515,
		"desc": "1 cable system: Tata TGN-Pacific",
		"cableCount": 1
	},
	{
		"id": "6046",
		"name": "Trablous, Lebanon",
		"lat": 34.439468,
		"lon": 35.859158,
		"desc": "1 cable system: Berytar",
		"cableCount": 1
	},
	{
		"id": "5876",
		"name": "Trapani, Italy",
		"lat": 38.017954,
		"lon": 12.513618,
		"desc": "1 cable system: Trapani-Kelibia",
		"cableCount": 1
	},
	{
		"id": "10388",
		"name": "Tricomo, Cyprus",
		"lat": 35.297273,
		"lon": 33.896898,
		"desc": "1 cable system: Turcyos-2",
		"cableCount": 1
	},
	{
		"id": "8663",
		"name": "Tripoli, Lebanon",
		"lat": 34.439468,
		"lon": 35.859158,
		"desc": "1 cable system: IMEWE",
		"cableCount": 1
	},
	{
		"id": "4271",
		"name": "Tripoli, Libya",
		"lat": 32.87735,
		"lon": 13.187314,
		"desc": "3 cable systems: Europe India Gateway (EIG), Italy-Libya, LFON (Libyan Fiber Optic Network)",
		"cableCount": 3
	},
	{
		"id": "7706",
		"name": "Trivendrum, India",
		"lat": 8.798184,
		"lon": 76.97024,
		"desc": "1 cable system: WARF Submarine Cable",
		"cableCount": 1
	},
	{
		"id": "5850",
		"name": "Trujillo, Honduras",
		"lat": 15.915102,
		"lon": -85.954735,
		"desc": "1 cable system: ARCOS",
		"cableCount": 1
	},
	{
		"id": "5857",
		"name": "Tseung Kwan O, Hong Kong",
		"lat": 22.31827,
		"lon": 114.258695,
		"desc": "3 cable systems: Asia Pacific Gateway (APG), Asia Submarine-cable Express (ASE)/Cahaya Malaysia, EAC-C2C",
		"cableCount": 3
	},
	{
		"id": "5938",
		"name": "Tuas, Singapore",
		"lat": 1.338244,
		"lon": 103.647114,
		"desc": "4 cable systems: i2i Cable Network (i2icn), SeaMeWe-3, SeaMeWe-4, +1 more",
		"cableCount": 4
	},
	{
		"id": "8402",
		"name": "Tuborg, Denmark",
		"lat": 55.721959,
		"lon": 12.545541,
		"desc": "1 cable system: Danica North",
		"cableCount": 1
	},
	{
		"id": "3808",
		"name": "Tuckerton, New Jersey, United States",
		"lat": 39.603864,
		"lon": -74.337931,
		"desc": "3 cable systems: GlobeNet, GlobeNet Segment 5 (Bermuda-U.S.), TAT-14",
		"cableCount": 3
	},
	{
		"id": "5908",
		"name": "Tulum, Mexico",
		"lat": 20.212558,
		"lon": -87.463598,
		"desc": "1 cable system: ARCOS",
		"cableCount": 1
	},
	{
		"id": "5972",
		"name": "Tumon Bay, Guam",
		"lat": 13.51355,
		"lon": 144.800459,
		"desc": "2 cable systems: Australia-Japan Cable (AJC), Guam Okinama Kyushu Incheon (GOKI)",
		"cableCount": 2
	},
	{
		"id": "5970",
		"name": "Tungku, Brunei",
		"lat": 4.926367,
		"lon": 114.885811,
		"desc": "2 cable systems: Asia-America Gateway (AAG) Cable System, SeaMeWe-3",
		"cableCount": 2
	},
	{
		"id": "3126",
		"name": "Turku, Finland",
		"lat": 60.449272,
		"lon": 22.259264,
		"desc": "1 cable system: Sweden-Finland 4 (SFS-4)",
		"cableCount": 1
	},
	{
		"id": "7678",
		"name": "Tuticorine, India",
		"lat": 8.802199,
		"lon": 78.145167,
		"desc": "1 cable system: Bharat Lanka Cable System",
		"cableCount": 1
	},
	{
		"id": "10782",
		"name": "Tyra",
		"lat": 55.715635,
		"lon": 4.748503,
		"desc": "1 cable system: CANTAT-3",
		"cableCount": 1
	},
	{
		"id": "7647",
		"name": "Ula, Norway",
		"lat": 57.111111,
		"lon": 2.847228,
		"desc": "1 cable system: NorSea Com",
		"cableCount": 1
	},
	{
		"id": "6017",
		"name": "Umag, Croatia",
		"lat": 45.433121,
		"lon": 13.520196,
		"desc": "1 cable system: Italy-Croatia",
		"cableCount": 1
	},
	{
		"id": "6004",
		"name": "Ume\u00e5, Sweden",
		"lat": 63.82588,
		"lon": 20.262973,
		"desc": "1 cable system: Botnia",
		"cableCount": 1
	},
	{
		"id": "7981",
		"name": "Unqui, Costa Rica",
		"lat": 9.525887,
		"lon": -84.454254,
		"desc": "1 cable system: Pan-American Crossing (PAC)",
		"cableCount": 1
	},
	{
		"id": "5052",
		"name": "Vaasa, Finland",
		"lat": 63.095165,
		"lon": 21.616387,
		"desc": "1 cable system: Botnia",
		"cableCount": 1
	},
	{
		"id": "6000",
		"name": "V\u00e4dd\u00f6, Sweden",
		"lat": 59.983377,
		"lon": 18.816601,
		"desc": "1 cable system: Sweden-Finland Link (SFL)",
		"cableCount": 1
	},
	{
		"id": "10781",
		"name": "Valdemar",
		"lat": 55.804076,
		"lon": 4.564293,
		"desc": "1 cable system: CANTAT-3",
		"cableCount": 1
	},
	{
		"id": "5764",
		"name": "Valdez, Alaska, United States",
		"lat": 61.130396,
		"lon": -146.353323,
		"desc": "2 cable systems: Alaska United East, NorthStar",
		"cableCount": 2
	},
	{
		"id": "3066",
		"name": "Valencia, Spain",
		"lat": 39.468342,
		"lon": -0.376943,
		"desc": "2 cable systems: Algeria-Spain, BalaLink",
		"cableCount": 2
	},
	{
		"id": "7650",
		"name": "Valhala, Norway",
		"lat": 56.278102,
		"lon": 3.39534,
		"desc": "1 cable system: NorSea Com",
		"cableCount": 1
	},
	{
		"id": "3331",
		"name": "Valpara\u00edso, Chile",
		"lat": -33.045822,
		"lon": -71.620512,
		"desc": "2 cable systems: South America-1 (SAm-1), South American Crossing (SAC)/Latin American Nautilus (LAN)",
		"cableCount": 2
	},
	{
		"id": "5356",
		"name": "Varna, Bulgaria",
		"lat": 43.20835,
		"lon": 27.912845,
		"desc": "1 cable system: KAFOS",
		"cableCount": 1
	},
	{
		"id": "5897",
		"name": "Ventspils, Latvia",
		"lat": 57.389484,
		"lon": 21.570009,
		"desc": "2 cable systems: BCF-1, Latvia-Sweden 1 (LV-SE 1)",
		"cableCount": 2
	},
	{
		"id": "3813",
		"name": "Vero Beach, Florida, United States",
		"lat": 27.638366,
		"lon": -80.394263,
		"desc": "2 cable systems: Americas-I North, Bahamas 2",
		"cableCount": 2
	},
	{
		"id": "10321",
		"name": "Vestero, Denmark",
		"lat": 57.272232,
		"lon": 10.96696,
		"desc": "1 cable system: Kattegat 2",
		"cableCount": 1
	},
	{
		"id": "5858",
		"name": "Vestmannaeyjar, Iceland",
		"lat": 63.437685,
		"lon": -20.267321,
		"desc": "1 cable system: CANTAT-3",
		"cableCount": 1
	},
	{
		"id": "4362",
		"name": "Victoria, Seychelles",
		"lat": -4.617601,
		"lon": 55.445013,
		"desc": "1 cable system: Seychelles to East Africa System (SEAS)",
		"cableCount": 1
	},
	{
		"id": "4862",
		"name": "Virginia Beach, VA, United States",
		"lat": 36.852966,
		"lon": -75.977999,
		"desc": "1 cable system: WASACE Europe",
		"cableCount": 1
	},
	{
		"id": "6013",
		"name": "Vung Tau, Vietnam",
		"lat": 10.341931,
		"lon": 107.079236,
		"desc": "2 cable systems: Asia-America Gateway (AAG) Cable System, Tata TGN-Intra Asia (TGN-IA)",
		"cableCount": 2
	},
	{
		"id": "5892",
		"name": "Wada, Japan",
		"lat": 35.035866,
		"lon": 140.016729,
		"desc": "1 cable system: FLAG North Asia Loop/REACH North Asia Loop",
		"cableCount": 1
	},
	{
		"id": "3822",
		"name": "Wall Township, New Jersey, United States",
		"lat": 40.152879,
		"lon": -74.062871,
		"desc": "1 cable system: Tata TGN-Atlantic",
		"cableCount": 1
	},
	{
		"id": "6191",
		"name": "Warrenton, Oregon, United States",
		"lat": 46.165141,
		"lon": -123.923862,
		"desc": "1 cable system: Alaska United West",
		"cableCount": 1
	},
	{
		"id": "3824",
		"name": "West Palm Beach, FL, United States",
		"lat": 26.71531,
		"lon": -80.053349,
		"desc": "1 cable system: Columbus-II b",
		"cableCount": 1
	},
	{
		"id": "5919",
		"name": "Whenuapai, New Zealand",
		"lat": -36.788842,
		"lon": 174.623453,
		"desc": "1 cable system: Southern Cross Cable Network",
		"cableCount": 1
	},
	{
		"id": "3081",
		"name": "Whitesands Bay, United Kingdom",
		"lat": 50.078518,
		"lon": -5.698444,
		"desc": "2 cable systems: Atlantic Crossing-1 (AC-1), Pan European Crossing (UK-Ireland)",
		"cableCount": 2
	},
	{
		"id": "6255",
		"name": "Whittier, Alaska, United States",
		"lat": 60.772919,
		"lon": -148.684704,
		"desc": "2 cable systems: Alaska United East, NorthStar",
		"cableCount": 2
	},
	{
		"id": "10729",
		"name": "Willemstad, Cura\u00e7ao",
		"lat": 12.095286,
		"lon": -68.896618,
		"desc": "1 cable system: Alonso de Ojeda",
		"cableCount": 1
	},
	{
		"id": "4275",
		"name": "Willemstad, Cura\u00e7ao",
		"lat": 12.095286,
		"lon": -68.896618,
		"desc": "3 cable systems: Americas-II, ARCOS, ECLink",
		"cableCount": 3
	},
	{
		"id": "3269",
		"name": "Winterton, United Kingdom",
		"lat": 53.656201,
		"lon": -0.601608,
		"desc": "1 cable system: UK-Netherlands 14",
		"cableCount": 1
	},
	{
		"id": "8549",
		"name": "Wrangell, Alaska, United States",
		"lat": 56.470744,
		"lon": -132.383805,
		"desc": "1 cable system: Alaska United South East",
		"cableCount": 1
	},
	{
		"id": "5811",
		"name": "Yeroskipos, Cyprus",
		"lat": 34.766427,
		"lon": 32.466588,
		"desc": "3 cable systems: Aphrodite 2, Lev Submarine System, SeaMeWe-3",
		"cableCount": 3
	},
	{
		"id": "5954",
		"name": "Ystad, Sweden",
		"lat": 55.43134,
		"lon": 13.828283,
		"desc": "1 cable system: Baltica",
		"cableCount": 1
	},
	{
		"id": "9844",
		"name": "Yzerfontein, South Africa",
		"lat": -33.348187,
		"lon": 18.155554,
		"desc": "2 cable systems: South Atlantic Express (SAEx), West African Cable System (WACS)",
		"cableCount": 2
	},
	{
		"id": "9486",
		"name": "Zafarana, Egypt",
		"lat": 29.116662,
		"lon": 32.649894,
		"desc": "3 cable systems: Europe India Gateway (EIG), Middle East North Africa (MENA) Cable System/Gulf Bridge International, SEACOM/Tata TGN-Eurasia",
		"cableCount": 3
	},
	{
		"id": "3141",
		"name": "Zandvoort, Netherlands",
		"lat": 52.370448,
		"lon": 4.527251,
		"desc": "2 cable systems: Circe North, Concerto",
		"cableCount": 2
	},
	{
		"id": "7865",
		"name": "Zawia, Libya",
		"lat": 32.774654,
		"lon": 12.529781,
		"desc": "1 cable system: LFON (Libyan Fiber Optic Network)",
		"cableCount": 1
	},
	{
		"id": "3139",
		"name": "Zeebrugge, Belgium",
		"lat": 51.330742,
		"lon": 3.206964,
		"desc": "1 cable system: Concerto",
		"cableCount": 1
	},
	{
		"id": "7864",
		"name": "Zwara, Libya",
		"lat": 32.933366,
		"lon": 12.083361,
		"desc": "1 cable system: LFON (Libyan Fiber Optic Network)",
		"cableCount": 1
	}
];
