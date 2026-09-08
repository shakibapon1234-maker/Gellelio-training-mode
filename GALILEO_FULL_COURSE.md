# GALILEO GDS — FULL COURSE NOTES
### Wings Fly Aviation Academy

---

## ১. ট্রাভেল অ্যান্ড ট্যুরিজম (Travel and Tourism)

ট্রাভেল অ্যান্ড ট্যুরিজম বলতে বোঝায় মানুষ তাদের স্বাভাবিক পরিবেশের বাইরে ভ্রমণ ও অবস্থান করা — leisure, business বা অন্য কোনো উদ্দেশ্যে। এই সেক্টর গ্লোবাল ইকোনমিক গ্রোথ, কর্মসংস্থান সৃষ্টি এবং সাংস্কৃতিক আদান-প্রদান ও পরিবেশ সচেতনতা বৃদ্ধিতে গুরুত্বপূর্ণ ভূমিকা রাখে।

**কেন ট্রাভেল অ্যান্ড ট্যুরিজম গুরুত্বপূর্ণ?**
এই ইন্ডাস্ট্রি অর্থনৈতিক প্রবৃদ্ধি তৈরি করে, কর্মসংস্থান সৃষ্টি করে, সাংস্কৃতিক বিনিময়কে উৎসাহিত করে এবং অবকাঠামো উন্নয়নে অবদান রাখে। স্থানীয় অর্থনীতি ও গ্লোবাল কমার্স উভয়ের জন্যই এটি অপরিহার্য।

### Travel Agents
ট্রাভেল এজেন্টরা সাপ্লায়ারদের পক্ষ থেকে ট্রাভেল প্রোডাক্ট বিক্রি করে এবং সাধারণত এর বিনিময়ে কমিশন পায়। তারা কাস্টমারদের চাহিদা ও বাজেট অনুযায়ী সেরা ট্রাভেল প্রোডাক্ট সম্পর্কে পরামর্শও দেয়। এই অর্থে তারা ট্যুরিস্ট ও সাপ্লায়ারদের মধ্যে একটি মধ্যস্থতাকারী হিসেবে কাজ করে।

**Travel Agency-র মূল কার্যক্রমসমূহ:**
1. Visa Processing
2. Air Ticketing ⭐ *(আমাদের মূল শেখার বিষয়)*
3. Hajj & Umrah
4. Recruitment Agency
5. Tour Operator / Tour Package

---

## ২. এয়ার টিকেটিং (AIR TICKETING / RESERVATION)

এয়ার টিকেট প্রসেস করার আগে যেসব বিষয় জানা প্রয়োজন:

1. IATA
2. IATA Agents
3. Non-IATA Agents
4. Vendor
5. BSP
6. GDS
7. Budget Airlines

### IATA (International Air Transport Association)
১৯৪৫ সালে প্রতিষ্ঠিত বিশ্বের এয়ারলাইনগুলোর একটি ট্রেড অ্যাসোসিয়েশন। IATA শুধু এয়ারলাইনের জন্য টেকনিক্যাল স্ট্যান্ডার্ড নির্ধারণই করে না, ট্যারিফ কনফারেন্সও আয়োজন করে যা প্রাইস ফিক্সিংয়ের একটি ফোরাম হিসেবে কাজ করে। মূলত IATA হলো এয়ারলাইন ও ট্রাভেল এজেন্টদের মধ্যে একটি মিডিয়া/সংযোগকারী প্রতিষ্ঠান।

### IATA ও Non-IATA Agents
কোনো এজেন্সি টিকেটিং করতে চাইলে অবশ্যই IATA-এর মেম্বার হতে হবে। তাই **IATA agents** টিকেট ইস্যু করতে পারে, কিন্তু **Non-IATA agents** টিকেট ইস্যু করতে পারে না (শুধু PNR বুক করতে পারে)। আমাদের দেশে Non-IATA agents-দের **Sub-agents** বলা হয় — তারা PNR বুক করে IATA agents-এর সাথে শেয়ার করে টিকেট ইস্যু করার জন্য।

### Vendor
মূলত এয়ারলাইনগুলোই এজেন্টদের প্রধান ভেন্ডর। কিন্তু IATA agent-দের ভেন্ডর হলো IATA নিজেই। IATA-লিস্টেড এয়ারলাইন ও IATA মেম্বার এজেন্টদের মধ্যে প্রতিটি অপারেশন IATA-এর মাধ্যমে সেটেল হয়।

### BSP (Billing and Settlement Plan)
IATA স্বীকৃত পেসেঞ্জার সেলস এজেন্টদের সেলিং, রিপোর্টিং ও রেমিটিং প্রসেস সহজ করার জন্য ডিজাইন করা একটি সিস্টেম, যা BSP এয়ারলাইনগুলোর ফাইন্যান্সিয়াল কন্ট্রোল ও ক্যাশ ফ্লো উন্নত করে। এটি অনেকটা IATA agents ও IATA Airlines-এর মধ্যকার একটি অ্যাকাউন্টিং সফটওয়্যারের মতো কাজ করে।

### GDS (Global Distribution System)
একটি কম্পিউটার-ভিত্তিক নেটওয়ার্কের অধীনে রিজার্ভেশন ইনভেন্টরিকে সংযুক্ত করে। ট্যুরিজম ইন্ডাস্ট্রিতে এয়ারলাইন, ট্রাভেল এজেন্ট, হসপিটালিটি ও কার রেন্টাল কোম্পানির জন্য এটি সবচেয়ে বেশি ব্যবহৃত হয়।

**এয়ার টিকেটিং-এর জন্য ৩টি GDS ব্যবহার করা যায়:**
1. Galileo
2. Sabre
3. Amadeus

### LCC Airlines (Low Cost Carrier)
LCC এয়ারলাইনগুলো মূলত Non-IATA এয়ারলাইন। এরা তাদের প্রতিটি অপারেশন নিজস্ব পলিসি অনুযায়ী পরিচালনা করে।

---

## ৩. দেশের তালিকা (Country Lists by Region)

**এশিয়া (ASIA):** Bangladesh, India, Pakistan, China, Japan, Indonesia, Iran, Turkey, Thailand, Saudi Arabia, Malaysia, Nepal, Sri Lanka, Cambodia, Singapore, Oman, Kuwait, Qatar, Bahrain, Maldives

**ইউরোপিয়ান ইউনিয়ন (EU):** Austria, Belgium, Croatia, Denmark, Finland, France, Germany, Greece, Ireland, Italy, Malta, Netherlands, Poland, Portugal, Romania, Spain, Sweden

**আমেরিকা (AMERICAS):** United States, Canada, Brazil, Mexico, Argentina, Colombia, Peru, Chile, Panama, Ecuador, Uruguay, Paraguay, Montserrat, Greenland, Bolivia, Haiti, Cuba, Jamaica, Dominica

---

## ৪. এয়ারলাইন নাম ও কোড (2 & 3 Digit Codes)

| # | এয়ারলাইন | 2-Digit | 3-Digit |
|---|---|---|---|
| 01 | Air India | AI | 098 |
| 02 | Air Canada | AC | 014 |
| 03 | Air France | AF | 057 |
| 04 | Bangladesh Biman | BG | 997 |
| 05 | Batik Air / Malindo | OD | 816 |
| 06 | Cathay Pacific Airways | CX | 160 |
| 07 | China Southern Airlines | CZ | 784 |
| 08 | China Eastern Airlines | MU | 781 |
| 09 | Emirates | EK | 176 |
| 10 | Etihad Airways | EY | 607 |
| 11 | Gulf Air | GF | 072 |
| 12 | Malaysian Airlines | MH | 232 |
| 13 | Qatar Airways | QR | 157 |
| 14 | Singapore Airlines | SQ | 618 |
| 15 | Turkish Airlines | TK | 235 |
| 16 | Thai Airways Int'l | TG | 217 |
| 17 | Kuwait Airways | KU | 229 |
| 18 | Himalaya Airlines | H9 | 769 |
| 19 | Oman Airways | WY | 910 |
| 20 | Jet Airways | 9W | 589 |
| 21 | Royal Air Maroc | AT | 147 |
| 22 | Royal Brunei Airlines | BI | 672 |
| 23 | SriLankan Airlines | UL | 603 |
| 24 | Saudi Arabian Airlines | SV | 065 |
| 25 | Fly Dubai | FZ | 141 |
| 26 | APG Airlines | GP | 275 |
| 27 | Flynas | XY | 593 |
| 28 | Egypt Air | MS | 077 |
| 29 | Vistara Airlines | UK | 228 |
| 30 | US Bangla | BS | 779 |
| 31 | Novo Air | VQ | 910 |
| 32 | Air Astra | 2A | 610 |
| 33 | Salam Air | OV | 960 |
| 34 | Indigo | 6E | 312 |
| 35 | Jazeera Airways | J9 | 486 |
| 36 | Air Arabia | G9 | 514 |

---

## ৫. এয়ারপোর্ট নাম ও কোড (Airport Codes)

| এয়ারপোর্ট | কোড | | এয়ারপোর্ট | কোড |
|---|---|---|---|---|
| Abha | AHB | | London, Heathrow | LHR |
| Abu Dhabi | AUH | | Los Angeles | LAX |
| Amsterdam | AMS | | Milan, Malpensa | MXP |
| Bahrain | BAH | | Montreal | YUL |
| Bangalore | BLR | | Osaka, Kansai Int'l | KIX |
| Bangkok | BKK | | Prague | PRG |
| Barcelona | BCN | | Rome, Fiumicino | FCO |
| Beijing | PEK | | Sharjah | SHJ |
| Cairo | CAI | | Toronto | YYZ |
| Kolkata | CCU | | Tokyo, Narita | NRT |
| Calgary | YYC | | Tokyo, Haneda | HND |
| Cape Town | CPT | | Zurich | ZRH |
| Chicago | CHI | | Dhaka | DAC |
| Chicago, O'Hare | ORD | | Doha | DOH |
| Chittagong | CGP | | Dublin | DUB |
| Dallas, Love Field | DAL | | Durban | DUR |
| Dallas/Ft. Worth | DFW | | Frankfurt | FRA |
| Darwin | DRW | | Fukuoka | FUK |
| Delhi | DEL | | Guangzhou | CAN |
| Dubai | DXB | | Hong Kong | HKG |
| Hangzhou | HGH | | Houston | IAH |
| Jakarta | CGK | | Hyderabad | HYD |
| Jeddah | JED | | Istanbul | IST |
| Kabul | KBL | | Johannesburg | JNB |
| Karachi | KHI | | Kunming | KMG |
| Kathmandu | KTM | | Kuwait | KWI |
| Kuala Lumpur | KUL | | Lisbon | LIS |
| Lahore | LHE | | Liverpool | LPL |
| Male | MLE | | Athens | ATH |
| Malta | MLA | | Atlanta | ATL |
| Manchester | MAN | | Auckland | AKL |
| Manila | MNL | | Bombay | BOM |
| Mauritius | MRU | | Boston | BOS |
| Medina | MED | | | |
| Melbourne | MEL | | | |
| New York | JFK | | | |
| Oakland | OAK | | | |
| Osaka | OSA | | | |
| Paris | CDG | | | |
| Perth | PER | | | |
| Phoenix | PHX | | | |
| Phuket | HKT | | | |
| Riyadh | RUH | | | |
| Saipan | SPN | | | |
| San Francisco | SFO | | | |
| Seattle | SEA | | | |
| Seoul | SEL | | | |
| Shanghai | SHA | | | |
| Singapore | SIN | | | |
| Tabuk | TUU | | | |
| Taif | TIF | | | |
| Venice | VCE | | | |
| Washington | IAD | | | |

---

## ৬. SIGN ON / SIGN OFF এন্ট্রি

| এন্ট্রি | ব্যাখ্যা |
|---|---|
| `SON/ZHA` | Sign on with staff initials |
| `SON/ZH89MD` | Sign on with PCC & staff initials |
| `SB` | Switch to work area B |
| `SA/AG` | Switch to work area A, duty code AG |
| `OP/W*` | Show current work areas |
| `STD/ZHA` | Display user profile |
| `SOF` | Sign off |
| `SOF/HA89MD` | Sign off with PCC |
| `SAI` | Sign back into all areas when temporarily signed off |

---

## ৭. প্রিন্টার অ্যাসাইনমেন্ট (Printer Assigned)

| এন্ট্রি | ব্যাখ্যা |
|---|---|
| `HMET` | Display printer GTID |
| `HMLM821881DI` | — |
| `HMLM821881DIE` | — |
| `HMOM821881-U` | Device up |
| `HMOM821881-TKT` | Device is now up for TKT |
| `HMOM821881-ITN` | Device is now up for ITN |

**Capping Check:**
`HMTQ/D` — Ticketing quota for agent

---

## ৮. বুকিং (A TO Z)

**STEP FOR CREATING A BOOKING PNR:**
1. Sets Searching
2. Booking Air Segments as per requirement
3. Name Insert
4. Phone Filed / Contact Details
5. Ticketing Agreement
6. Received Field

### SETS SEARCHING — BY AVAILABILITY

| এন্ট্রি | ব্যাখ্যা |
|---|---|
| `A22JUNDACDXB` | Neutral availability, 22 Jun, DAC–DXB |
| `A22JUNDACDXB*EK` | Carrier specific display on only EK |
| `A22JUNDACDXB/BS#` | Carrier specific display on only BS |
| `A22JUNDACDXB#BS` | Carrier specific display on BS with other carrier code shear |
| `ADACSYD.SIN/SQ` | Connection via Singapore on SQ |
| `A22JUNDACDXB.D` | Availability displaying direct flight only |
| `AR27JUN` | Display return availability for 27 JUN |
| `FDA` | Convert availability to fare display |

**এন্ট্রির গঠন — `A22JUNDACDXB`:**
- `A` = Searching code
- `22JUN` = Searching date
- `DAC` = Depart from Dhaka
- `DXB` = Arrival in Dubai

### SETS SEARCHING — BY FARE SHOP

আমরা ফেয়ার শপ এন্ট্রি ব্যবহার করি প্রয়োজন অনুযায়ী সর্বনিম্ন available fare সার্চ করার জন্য।

| এন্ট্রি | ব্যাখ্যা |
|---|---|
| `FSDAC22JUNDXB` | Fare searching as per lowest available fare |
| `FSDAC22JUNDXB//BS` | Fare searching as per lowest available fare, only BS carrier |
| `FS9DAC22JUNDXB` | Fare searching for 9 adults |
| `FS2DAC22JUNDXB+P1.2*C10` | Fare searching for 1 adult and 1 child |
| `FS2DAC22JUNDXB+P1.2*INF` | Fare searching for 1 adult and 1 infant |
| `FS4DAC22JUNDXB+P1-2.3*C10.4*INF` | Fare searching for 2 adults, 1 child & 1 infant |
| `FSDAC22JUNDXB++-BUSNS` | Business class lowest fare |

### BOOKING AIR SEGMENTS

| এন্ট্রি | ব্যাখ্যা |
|---|---|
| `N3K2` | Sell 3, K class sets from line 2 |
| `N1K1*` | Sell 1, K class seat, all connections |
| `N1Y1J2` | Sell 1, Y class for segment 1 & J class for segment 2 |

**এন্ট্রির গঠন — `N3K2`:**
- `N` = Code of sell
- `3` = Number of sell/sets
- `K` = Booking class
- `2` = Selling sets line no.

---

## ৯. নাম ফিল্ড / নাম ইনসার্ট (Name Field/Name Insert)

**Adult:**
`N.RAHMAN/MD HAFIZUR MR`

**Child:**
`N.RAHMAN/MD HABIBUR MSTR*P-C10` — 10 হলো শিশুর বয়স

**Infant:**
`N.I/RAHMAN/MD HASANUR MSTR*02OCT2022` — 02OCT22 হলো Infant-এর জন্ম তারিখ

**একই এন্ট্রিতে দুই বা ততোধিক নাম:**
`N.1ISLAM/MD ROBIUL MR+N.1RAHMAN/MD HAFIZUR MR`

**একই এন্ট্রিতে দুই বা ততোধিক নাম (কমন লাস্ট নেম):**
`N.3RAHMAN/MD HAFIZUR MR/MD HABIBUR MR/MD HASANUR MR`

**অন্যান্য:**
| এন্ট্রি | ব্যাখ্যা |
|---|---|
| `N.P3@HAFIZUR MR` | Change name 3 |
| `N.P2-3@` | Delete name 2 & 3 |
| `ON*` | Check name change policy |

---

## ১০. ফোন ফিল্ড (Phone Field)

`P.T*WINGS FLY TOURS AND TRAVELS REF HAFIZ 01618000488` — সর্বোচ্চ ৫৩ ক্যারেক্টার

---

## ১১. টিকেটিং এগ্রিমেন্ট (Ticketing)

`T.T*` — বুকিং সম্পন্ন করার জন্য এই এন্ট্রিটি আবশ্যক (Mandatory)

---

## ১২. রিসিভড ফিল্ড (Received Field)

```
R.H
ER
IR
```

এখানেই বুকিং সম্পন্ন হয়ে একটি PNR তৈরি হয়ে যায়।

---

## ১৩. স্যাম্পল বুকিং PNR (উদাহরণ)

```
7F5432/HA DACOU 89MDHA AG 42341084 31MAR
 1.1ISLAM/MD SORIFUL MR
 1. BS 341 K 20JUN DACDXB HK1 2220 #0125 O*     E TH/FR
 2. BS 342 K 15JUL DXBDAC HK1 0225 0935 O*      E MO

*ALL  *P  *TD  *VL  *VR  *SI

** VENDOR LOCATOR DATA EXISTS ** >*VL
** VENDOR REMARKS DATA EXISTS ** >*VR
** SERVICE INFORMATION EXISTS ** >*SI

FONE-DACT*WINGS FLY TOURS AND TRAVELS REF HAFIZ 01618000488
TKTG-T*

VENDOR LOCATOR
VLOC-BS*06H5LO/31MAR 1922

VENDOR REMARKS
VRMK-VI/ABS *ADTK1GBS// TTL FOR AUTO CANX FIXED FOR 02APR24 AT 1922 GMT 1922Z 31MAR

*** SPECIAL SERVICE REQUIREMENT ***
SEGMENT/PASSENGER RELATED
*** MANUAL SSR DATA ***
 M 1. SSRDOCSBS HK  P/BGD/A12355689/BGD/10DEC78/M/31JAN32/ISLAM/MD SORIFUL -1ISLAM/MD SORIFUL MR
 M 2. SSRCTCMBS HK  /01735639995-1ISLAM/MD SORIFUL MR
 M 3. SSRCTCEBS HK  /UNIVERSALAIRINT//GMAIL.COM-1ISLAM/MD SORIFUL MR
NO OSI EXISTS
```

**PNR-এর অংশগুলোর ব্যাখ্যা:**

| অংশ | ব্যাখ্যা |
|---|---|
| `7F5432` | The PNR number |
| `89MDHA` | "89MD" হলো PCC এবং "HA" হলো বুকিং ইউজারের সাইন |
| `42341084` | IATA number, যা বুকিং ID-তে ব্যবহৃত হয় |
| `31MAR` | Booking date |
| `*P` | Phone data exists |
| `*TD` | Ticketing arrangement data exists |
| `*VL` | Vendor locator data exists |
| `*VR` | Vendor remarks data exists |
| `*SI` | Service information exists |

---

## ১৪. বুকিং ওপেন (Booking Open)

| এন্ট্রি | ব্যাখ্যা |
|---|---|
| `*PNR` | PNR নাম্বার দিয়ে একটি PNR ওপেন করা |
| `*-RAHMAN/HAFIZUR` | পেসেঞ্জারের নাম দিয়ে একটি PNR ওপেন করা |

---

## ১৫. বুকিং ক্লাস আপগ্রেড (In Booking Class Upgraded)

```
FQBBCEK/ET++BUSNS
CLICK "BBK"
R.H>ER>IR
```

---

## ১৬. বুকিংয়ে ফেয়ার লোড (Fare Load in Booking)

| এন্ট্রি | ব্যাখ্যা |
|---|---|
| `FQCEK/ET` | As per booking segment |
| `FQBB/CEK/ET` | Best by fare |
| `FQCEK@FARE BASIS/ET` | Fix fare basis |
| `FQCEK/ACC` | Child fare |
| `FQCBG*ADR/ET` | BG Umrah fare |

---

## ১৭. বুকিং ফাইল ডিভাইড / স্প্লিট PNR (Divide Booking File)

| এন্ট্রি | ব্যাখ্যা |
|---|---|
| `DP1` | Pax 1 divide (split) |
| `DP1-3.6` | Pax 1-3 & 6 split |

তারপর:
```
R.H
F
R.H
ER
```

---

## ১৮. বুকিং (PNR) ক্যানসেল

```
XI
R.H
ER
IR
```

**HX PNR Cancel:**
```
XI>R.H>ER>ER>IR
```

**PNR লাইভ রাখার মেসেজ:**
`RT.T/31DEC*KEEP THE PNR LIVE`

**Issue-এর জন্য PNR শেয়ার:**
`QEB/89MD` — 89MD হলো শেয়ারড PCC

---

## ১৯. PNR তৈরির পর অন্যান্য সার্ভিস ইনফরমেশন যোগ করা

### Docs Insert (Passport Details)
```
SI.P1/SSRDOCSBGHK1/P/BGD/PASSPORT NO/BGD/DATE OF BIRTH/GENDER/PASSPORT EXP/PAX NAME
```

| এন্ট্রি | ব্যাখ্যা |
|---|---|
| `SI.P1/SSRDOCSBGHK1/...` | Passport details |
| `SI.P1/SSRCTCMBGHK1/01735639995` | Passenger phone number |
| `SI.P1/SSRCTCEBGHK1/WINGSFLY.BD//GMAIL.COM` | Passenger email |

### Docs Cancel
`SI.2@` — "2" হলো ডকস লাইন নাম্বার

### Food Add
| এন্ট্রি | ব্যাখ্যা |
|---|---|
| `SI.P1/MOML` | Muslim food |
| `SI.P2/CHML` | Child food |
| `SI.P3/BBML` | Baby (infant) food |
| `SI.P3/BSCT` | Baby cot/chair |
| `SI.P1/VSML` | Vegetable food |

### Wheelchair Service
`SI.P1/WCHR*THE PASSENGER IS SENIOR CITIZENS UNABLE TO WALK`

### মাইলেজ মেম্বারশিপ সার্ভিস (Mileage Membership Service)
| এন্ট্রি | ব্যাখ্যা |
|---|---|
| `M.EK1234567` | For all pax |
| `M.P2/EK1234567` | For pax no 2 |
| `M.P1/EK1234567/QR` | For pax no 1, EK card used in QR |
| `M.@` | Delete all mileage data |
| `M.P2@` | Delete mileage data for pax no 2 |

---

*Wings Fly Aviation Academy — Galileo GDS Course Notes*
