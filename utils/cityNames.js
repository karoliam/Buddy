const cityNames = [
  {key: '0', value: 'Helsinki'},
  {key: '1', value: 'Espoo'},
  {key: '2', value: 'Tampere'},
  {key: '3', value: 'Vantaa'},
  {key: '4', value: 'Oulu'},
  {key: '5', value: 'Turku'},
  {key: '6', value: 'Jyväskylä'},
  {key: '7', value: 'Kuopio'},
  {key: '8', value: 'Lahti'},
  {key: '9', value: 'Kouvola'},
  {key: '10', value: 'Pori'},
  {key: '11', value: 'Joensuu'},
  {key: '12', value: 'Lappeenranta'},
  {key: '13', value: 'Hämeenlinna'},
  {key: '14', value: 'Vaasa'},
  {key: '15', value: 'Rovaniemi'},
  {key: '16', value: 'Seinäjoki'},
  {key: '17', value: 'Mikkeli'},
  {key: '18', value: 'Kotka'},
  {key: '19', value: 'Salo'},
  {key: '20', value: 'Porvoo'},
  {key: '21', value: 'Kokkola'},
  {key: '22', value: 'Lohja'},
  {key: '23', value: 'Hyvinkää'},
  {key: '24', value: 'Nurmijärvi'},
  {key: '25', value: 'Järvenpää'},
  {key: '26', value: 'Rauma'},
  {key: '27', value: 'Kirkkonummi'},
  {key: '28', value: 'Tuusula'},
  {key: '29', value: 'Kajaani'},
  {key: '30', value: 'Jyväskylän Maalaiskunta'},
  {key: '31', value: 'Savonlinna'},
  {key: '32', value: 'Kerava'},
  {key: '33', value: 'Nokia'},
  {key: '34', value: 'Ylöjärvi'},
  {key: '35', value: 'Kaarina'},
  {key: '36', value: 'Kangasala'},
  {key: '37', value: 'Riihimäki'},
  {key: '38', value: 'Vihti'},
  {key: '39', value: 'Raseborg'},
  {key: '40', value: 'Imatra'},
  {key: '41', value: 'Sastamala'},
  {key: '42', value: 'Raahe'},
  {key: '43', value: 'Raisio'},
  {key: '44', value: 'Hollola'},
  {key: '45', value: 'Lempäälä'},
  {key: '46', value: 'Iisalmi'},
  {key: '47', value: 'Tornio'},
  {key: '48', value: 'Siilinjärvi'},
  {key: '49', value: 'Kemi'},
  {key: '50', value: 'Kurikka'},
  {key: '51', value: 'Jämsä'},
  {key: '52', value: 'Varkaus'},
  {key: '53', value: 'Valkeakoski'},
  {key: '54', value: 'Mäntsälä'},
  {key: '55', value: 'Äänekoski'},
  {key: '56', value: 'Hamina'},
  {key: '57', value: 'Heinola'},
  {key: '58', value: 'Jakobstad'},
  {key: '59', value: 'Sipoo'},
  {key: '60', value: 'Korsholm'},
  {key: '61', value: 'Lieto'},
  {key: '62', value: 'Naantali'},
  {key: '63', value: 'Pirkkala'},
  {key: '64', value: 'Laukaa'},
  {key: '65', value: 'Pieksämäki'},
  {key: '66', value: 'Forssa'},
  {key: '67', value: 'Kempele'},
  {key: '68', value: 'Toijala'},
  {key: '69', value: 'Kauhava'},
  {key: '70', value: 'Loimaa'},
  {key: '71', value: 'Orimattila'},
  {key: '72', value: 'Kuusamo'},
  {key: '73', value: 'Uusikaupunki'},
  {key: '74', value: 'Pargas'},
  {key: '75', value: 'Loviisa'},
  {key: '76', value: 'Ylivieska'},
  {key: '77', value: 'Nastola'},
  {key: '78', value: 'Kontiolahti'},
  {key: '79', value: 'Lapua'},
  {key: '80', value: 'Kauhajoki'},
  {key: '81', value: 'Ulvila'},
  {key: '82', value: 'Kalajoki'},
  {key: '83', value: 'Ilmajoki'},
  {key: '84', value: 'Liperi'},
  {key: '85', value: 'Eura'},
  {key: '86', value: 'Alavus'},
  {key: '87', value: 'Lieksa'},
  {key: '88', value: 'Kankaanpää'},
  {key: '89', value: 'Mariehamn'},
  {key: '90', value: 'Nivala'},
  {key: '91', value: 'Kitee'},
  {key: '92', value: 'Hämeenkyrö'},
  {key: '93', value: 'Paimio'},
  {key: '94', value: 'Sotkamo'},
  {key: '95', value: 'Huittinen'},
  {key: '96', value: 'Keuruu'},
  {key: '97', value: 'Alajärvi'},
  {key: '98', value: 'Lapinlahti'},
  {key: '99', value: 'Ii'},
  {key: '100', value: 'Leppävirta'},
  {key: '101', value: 'Liminka'},
  {key: '102', value: 'Saarijärvi'},
  {key: '103', value: 'Muurame'},
  {key: '104', value: 'Masku'},
  {key: '105', value: 'Kauniainen'},
  {key: '106', value: 'Orivesi'},
  {key: '107', value: 'Närpes'},
  {key: '108', value: 'Somero'},
  {key: '109', value: 'Muhos'},
  {key: '110', value: 'Karkkila'},
  {key: '111', value: 'Hanko'},
  {key: '112', value: 'Kuhmo'},
  {key: '113', value: 'Sodankylä'},
  {key: '114', value: 'Kiuruvesi'},
  {key: '115', value: 'Laitila'},
  {key: '116', value: 'Keminmaa'},
  {key: '117', value: 'Suomussalmi'},
  {key: '118', value: 'Pudasjärvi'},
  {key: '119', value: 'Loppi'},
  {key: '120', value: 'Laihia'},
  {key: '121', value: 'Nurmes'},
  {key: '122', value: 'Jalasjärvi'},
  {key: '123', value: 'Mynämäki'},
  {key: '124', value: 'Kemijärvi'},
  {key: '125', value: 'Oulainen'},
  {key: '126', value: 'Kokemäki'},
  {key: '127', value: 'Nykarleby'},
  {key: '128', value: 'Haapajärvi'},
  {key: '129', value: 'Suonenjoki'},
  {key: '130', value: 'Harjavalta'},
  {key: '131', value: 'Ikaalinen'},
  {key: '132', value: 'Haapavesi'},
  {key: '133', value: 'Outokumpu'},
  {key: '134', value: 'Mänttä'},
  {key: '135', value: 'Säkylä'},
  {key: '136', value: 'Virrat'},
  {key: '137', value: 'Inari'},
  {key: '138', value: 'Tyrnävä'},
  {key: '139', value: 'Kristinestad'},
  {key: '140', value: 'Parkano'},
  {key: '141', value: 'Vörå'},
  {key: '142', value: 'Kronoby'},
  {key: '143', value: 'Pälkäne'},
  {key: '144', value: 'Viitasaari'},
  {key: '145', value: 'Juva'},
  {key: '146', value: 'Kittilä'},
  {key: '147', value: 'Tammela'},
  {key: '148', value: 'Siuntio'},
  {key: '149', value: 'Mäntyharju'},
  {key: '150', value: 'Rusko'},
  {key: '151', value: 'Ähtäri'},
  {key: '152', value: 'Eurajoki'},
  {key: '153', value: 'Nakkila'},
  {key: '154', value: 'Kangasniemi'},
  {key: '155', value: 'Malax'},
  {key: '156', value: 'Ingå'},
  {key: '157', value: 'Kannus'},
  {key: '158', value: 'Teuva'},
  {key: '159', value: 'Jokioinen'},
  {key: '160', value: 'Ilomantsi'},
  {key: '161', value: 'Ruokolahti'},
  {key: '162', value: 'Hankasalmi'},
  {key: '163', value: 'Parikkala'},
  {key: '164', value: 'Larsmo'},
  {key: '165', value: 'Pornainen'},
  {key: '166', value: 'Sievi'},
  {key: '167', value: 'Joroinen'},
  {key: '168', value: 'Askola'},
  {key: '169', value: 'Juuka'},
  {key: '170', value: 'Nousiainen'},
  {key: '171', value: 'Urjala'},
  {key: '172', value: 'Taipalsaari'},
  {key: '173', value: 'Juankoski'},
  {key: '174', value: 'Isokyrö'},
  {key: '175', value: 'Pielavesi'},
  {key: '176', value: 'Tohmajärvi'},
  {key: '177', value: 'Ruukki'},
  {key: '178', value: 'Joutsa'},
  {key: '179', value: 'Jomala'},
  {key: '180', value: 'Ruovesi'},
  {key: '181', value: 'Polvijärvi'},
  {key: '182', value: 'Vesilahti'},
  {key: '183', value: 'Ylitornio'},
  {key: '184', value: 'Sonkajärvi'},
  {key: '185', value: 'Karstula'},
  {key: '186', value: 'Pihtipudas'},
  {key: '187', value: 'Taivalkoski'},
  {key: '188', value: 'Sysmä'},
  {key: '189', value: 'Ranua'},
  {key: '190', value: 'Petäjävesi'},
  {key: '191', value: 'Aura'},
  {key: '192', value: 'Maaninka'},
  {key: '193', value: 'Vieremä'},
  {key: '194', value: 'Rantasalmi'},
  {key: '195', value: 'Salla'},
  {key: '196', value: 'Kuortane'},
  {key: '197', value: 'Uurainen'},
  {key: '198', value: 'Pello'},
  {key: '199', value: 'Savitaipale'},
  {key: '200', value: 'Heinävesi'},
  {key: '201', value: 'Paltamo'},
  {key: '202', value: 'Posio'},
  {key: '203', value: 'Luvia'},
  {key: '204', value: 'Virolahti'},
  {key: '205', value: 'Kimito'},
  {key: '206', value: 'Toholampi'},
  {key: '207', value: 'Rautalampi'},
  {key: '208', value: 'Veteli'},
  {key: '209', value: 'Simo'},
  {key: '210', value: 'Lappajärvi'},
  {key: '211', value: 'Pyhäjoki'},
  {key: '212', value: 'Tervola'},
  {key: '213', value: 'Kaavi'},
  {key: '214', value: 'Merikarvia'},
  {key: '215', value: 'Padasjoki'},
  {key: '216', value: 'Vaala'},
  {key: '217', value: 'Lemi'},
  {key: '218', value: 'Vimpeli'},
  {key: '219', value: 'Punkalaidun'},
  {key: '220', value: 'Sauvo'},
  {key: '221', value: 'Hartola'},
  {key: '222', value: 'Reisjärvi'},
  {key: '223', value: 'Utajärvi'},
  {key: '224', value: 'Perho'},
  {key: '225', value: 'Puolanka'},
  {key: '226', value: 'Lappträsk'},
  {key: '227', value: 'Konnevesi'},
  {key: '228', value: 'Sulkava'},
  {key: '229', value: 'Alavieska'},
  {key: '230', value: 'Kärsämäki'},
  {key: '231', value: 'Köyliö'},
  {key: '232', value: 'Tuusniemi'},
  {key: '233', value: 'Evijärvi'},
  {key: '234', value: 'Karvia'},
  {key: '235', value: 'Toivakka'},
  {key: '236', value: 'Hyrynsalmi'},
  {key: '237', value: 'Ypäjä'},
  {key: '238', value: 'Humppila'},
  {key: '239', value: 'Keitele'},
  {key: '240', value: 'Koski Tl'},
  {key: '241', value: 'Muonio'},
  {key: '242', value: 'Rääkkylä'},
  {key: '243', value: 'Kuhmoinen'},
  {key: '244', value: 'Valtimo'},
  {key: '245', value: 'Hirvensalmi'},
  {key: '246', value: 'Puumala'},
  {key: '247', value: 'Pomarkku'},
  {key: '248', value: 'Soini'},
  {key: '249', value: 'Korsnäs'},
  {key: '250', value: 'Vesanto'},
  {key: '251', value: 'Pyhäranta'},
  {key: '252', value: 'Isojoki'},
  {key: '253', value: 'Hämeenkoski'},
  {key: '254', value: 'Miehikkälä'},
  {key: '255', value: 'Lumijoki'},
  {key: '256', value: 'Kihniö'},
  {key: '257', value: 'Marttila'},
  {key: '258', value: 'Lemland'},
  {key: '259', value: 'Pukkila'},
  {key: '260', value: 'Myrskylä'},
  {key: '261', value: 'Tarvasjoki'},
  {key: '262', value: 'Jämijärvi'},
  {key: '263', value: 'Lavia'},
  {key: '264', value: 'Enontekiö'},
  {key: '265', value: 'Pulkkila'},
  {key: '266', value: 'Pertunmaa'},
  {key: '267', value: 'Honkajoki'},
  {key: '268', value: 'Kinnula'},
  {key: '269', value: 'Rautavaara'},
  {key: '270', value: 'Multia'},
  {key: '271', value: 'Taivassalo'},
  {key: '272', value: 'Tervo'},
  {key: '273', value: 'Pyhäntä'},
  {key: '274', value: 'Hammarland'},
  {key: '275', value: 'Siikainen'},
  {key: '276', value: 'Enonkoski'},
  {key: '277', value: 'Kannonkoski'},
  {key: '278', value: 'Kyyjärvi'},
  {key: '279', value: 'Oripää'},
  {key: '280', value: 'Karijoki'},
  {key: '281', value: 'Ristijärvi'},
  {key: '282', value: 'Kaskinen'},
  {key: '283', value: 'Utsjoki'},
  {key: '284', value: 'Halsua'},
  {key: '285', value: 'Kivijärvi'},
  {key: '286', value: 'Merijärvi'},
  {key: '287', value: 'Savukoski'},
  {key: '288', value: 'Hailuoto'},
  {key: '289', value: 'Pelkosenniemi'},
  {key: '290', value: 'Eckerö'},
  {key: '291', value: 'Kustavi'},
  {key: '292', value: 'Lestijärvi'},
  {key: '293', value: 'Luhanka'},
  {key: '294', value: 'Brändö'},
  {key: '295', value: 'Geta'},
  {key: '296', value: 'Vårdö'},
  {key: '297', value: 'Lumparland'},
  {key: '298', value: 'Kumlinge'},
  {key: '299', value: 'Sottunga'},
  {key: '300', value: 'Nummela'},
  {key: '301', value: 'Turenki'},
  {key: '302', value: 'Parola'},
  {key: '303', value: 'Oitti'},
  {key: '304', value: 'Godby'},
  {key: '305', value: 'Järvelä'},
  {key: '306', value: 'Siltakylä'},
  {key: '307', value: 'Vääksy'},
  {key: '308', value: 'Ödkarby'},
  {key: '309', value: 'Bennäs'},
  {key: '310', value: 'Kaustinen'},
  {key: '311', value: 'Kyrö'},
  {key: '312', value: 'Vinkkilä'},
  {key: '313', value: 'Kausala'},
  {key: '314', value: 'Simpele'},
  {key: '315', value: 'Dalsbruk'},
  {key: '316', value: 'Björby'},
  {key: '317', value: 'Korkeakoski'},
  {key: '318', value: 'Taavetti'},
  {key: '319', value: 'Föglö'},
  {key: '320', value: 'Pyhäsalmi'},
  {key: '321', value: 'Karlby'},
  {key: '322', value: 'Polvijärvi'},
  {key: '323', value: 'Kolari'},
  {key: '324', value: 'Ivalo'},
  {key: '325', value: 'Åva'},
];

export default cityNames;
