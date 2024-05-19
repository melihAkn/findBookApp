const {bookCommentsModel,bookModel} = require('../model/books')
const {bookStoreCartModel,bookStoreOrdersModel,bookStoresModel,bookStoresBookModel} = require('../model/bookStores')
const {userBuyLaterModel,userCartModel,userWishListModel,userFavBooksModel,usersModel} = require('../model/users')
const {contactsModel} = require('../model/contacts')


//for mock data prep
const capitalAndNonCapital = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z','A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
const categories = ["Fiction","Non-Fiction","Science Fiction","Fantasy","Romance","Mystery","Thriller","History","Biography","Art","Music","Philosophy","Religion","Science","Technology","Medicine","Health","Psychology","Self-Help","Education","Children's Books","Young Adult Fiction","Comic Book","Humor","Cooking","Travel","Hobby","Sports","Other","Law","Business","Entertainment","Travel","Cooking","Gardening","Home and Family","Parenting","Pets","Crafts","Language","Science and Mathematics","History","Biology","Medicine","Psychology","Philosophy","Religion","Spirituality","Social Sciences","Politics","Education"]
const bookImagesPath = "public/uploads/bookImages/deneme123/1.png"
const numbers = ["1","2","3","4","5","6","7","8","9","0"]
const prepareMockForBooks = async (req,res) => {

  let bookName = ""
  let bookDescription = ""
  let bookAuthor = ""
  let bookISBN = ""
  //book count
  for(let j = 0; j < 150; j++){
  //name book name book description create random
  const nameLength = Math.floor((Math.random() + 1) * 5)
  for(let i = 0; i<nameLength;i++){
    bookName += capitalAndNonCapital[Math.floor(Math.random() * capitalAndNonCapital.length)]
    bookAuthor += capitalAndNonCapital[Math.floor(Math.random() * capitalAndNonCapital.length)]

  }
  const descLength = Math.random() * 200
  let count = 0
  for(let k = 0; k < descLength; k++){
    bookDescription += capitalAndNonCapital[Math.floor(Math.random() * capitalAndNonCapital.length)]
    if(count == 6){
      bookDescription += " "
      count = 0
    }
    count+=1
  }
  for(let p = 0; p < 10; p++){
    bookISBN += numbers[Math.floor(Math.random() * numbers.length)]
  }
  let bookObject = {
    "name" : bookName,
    "description" : bookDescription,
    "pageCount": Math.floor(Math.random() * 1000),
    "category": categories[Math.floor(Math.random() * categories.length)],
    "averageRating": (Math.random() * 5).toFixed(2),
    "author": bookAuthor,
    "ISBN" : bookISBN,
    "images" : { path: "public/uploads/bookImages/dds/1.png", index: 1 },
    "isValidBook" : false,
    "publicationDate": `${Math.floor((Math.random() + 1) * 1050 )}-${Math.floor((Math.random() * 11) + 1 )}-${Math.floor((Math.random() * 27) + 1 )}`
  }
  const newBook = new bookModel(bookObject)
  await newBook.save()
   bookName = ""
   bookDescription = ""
   bookAuthor = ""
   bookISBN = ""
}
  res.send()

}
  let bookstoreUsername = ""
  let bookStoreName = ""
  let bookStorePhoneNumber = ""
  let bookStorePhyscialAddress = ""
  let bookStoreNames = ["Yazı Düşler Kitabevi", "Kitap Kokusu", "Sayfa Dünyası", "Okuyan Baykuş", "Kelime Hazinesi", "Edebiyat Bahçesi", "Roman Kahramanları", "Öykü Evi", "Felsefe Durağı", "Şiir Sokağı", "Edebiyat Durağı", "Kitap Kurdu", "Yazarın Evi", "Kitap Tutkunu", "Oku Kitap", "Düşler Kitaplığı", "Kağıt ve Mürekkep", "Hikaye Anlatıcısı", "Edebiyat Kafe", "Kitap Dostları", "Okumak Güzeldir", "Kitap Tutkusu", "Kitap Keyfi", "Kitap Dünyası", "Edebiyat Evi", "Okuyan Kalem", "Okuyan Gözler", "Kitap Meraklısı", "Kitap Tutkunları", "Okuyan Ruhlar", "Kitap Sevdalıları", "Okuyan Eller", "Kitap Canavarı", "Okuyan Beyinler", "Kitap Avcıları", "Okuyan Yürekler", "Kitap Tutkusu", "Okuyan Akıllar", "Kitap Dostları", "Okuyan İnsanlar", "Kağıt Gemiler", "Kelimeler ve Kanatlar", "Zihin Haritası", "Düş Bahçesi", "Fikir Atölyesi", "Sonsuzluk Kütüphanesi", "Bilgi Kaynağı", "Okuyan Şehir", "Kitap Köşkü", "Hikaye Diyarı", "Gece Kuşu Kitabevi", "Kitap Perisi", "Okuyan Ağaç", "Kelimeler ve Renkler", "Sayfalar Arası", "Kitap Fısıltısı", "Okuyan Kule", "Düşler Kütüphanesi", "Kitap Evreni", "Yazarın Sığınağı", "Okuyan Köy", "Kitap Kaşifi", "Kelimelerin Dansı", "Sayfaların Sesi", "Kitapların Büyüsü", "Okuyan Orman", "Kitap Avcısı", "Kelimelerin Şarkısı", "Sayfaların Kokusu", "Kitapların Dili", "Galata Kitapçısı", "Bostanlı Okuyucu", "Kordonboyu Kitap", "Hisarönü Okuyanlar", "Cihangir Kitap Dostları", "Moda Kitap Evi", "Beyoğlu Edebiyatçısı", "Kadıköy Kitap Kurdu", "Beşiktaş Okuyanlar", "Nişantaşı Kitap Merkezi", "Ankara Kitapçısı", "İzmir Kitap Evi", "Bursa Kitap Dostları", "Antalya Kitap Dünyası", "Okuyanlar Kulübü", "Kitap Gezegeni", "Okuyanlar Mekanı", "Kitap Merkezi", "Okuyanlar Evi", "Kitap Durağı", "Okuyanlar Buluşması", "Kitap Köşesi", "Okuyanlar Platformu", "Kitap Dünyası", "Okuyanlar Topluluğu", "Kitap Evi", "Okuyanlar Arası", "Kitap Kafe", "Okuyanlar Yuvası", "Kitap Durağı", "Okuyanlar Buluşması", "Kitap Köşesi", "Okuyanlar Platformu", "Kitap Dünyası", "Okuyanlar Topluluğu", "Kitap Evi", "Okuyanlar Arası", "Kitap Kafe", "Okuyanlar Yuvası", "Kelimeler Diyarı", "Okuyanlar Sokağı", "Kitaplar ve Kahve", "Edebiyat Durağınız", "Okuyanlar Köşkü", "Kitap Feneri", "Okuyanlar Bahçesi", "Kelimeler ve Hayaller", "Sayfaların İzinde", "Kitapların Fısıltısı", "Okuyanlar Dünyası", "Kitapların Sırları", "Yazarın Köşesi", "Okuyanlar Köprüsü", "Kelimelerin Gücü", "Sayfaların Aşkı", "Kitapların Işığı", "Okuyanlar Yolu", "Kitapların Rüyası", "Yazarın Kalemi", "Okuyanlar Sokağı", "Kitaplar ve Kahve", "Edebiyat Durağınız", "Okuyanlar Köşkü", "Kitap Feneri", "Okuyanlar Bahçesi", "Kelimeler ve Hayaller", "Sayfaların İzinde", "Kitapların Fısıltısı", "Okuyanlar Dünyası", "Kitapların Sırları", "Yazarın Köşesi", "Okuyanlar Köprüsü", "Kelimelerin Gücü", "Sayfaların Aşkı", "Kitapların Işığı", "Okuyanlar Yolu", "Kitapların Rüyası", "Yazarın Kalemi"]
  let physicalAddresses = [
    "Anıtpark Caddesi No: 15",
    "İstanbul Caddesi No: 32",
    "Hastane Caddesi No: 48",
    "Çınar Caddesi No: 63",
    "Cumhuriyet Meydanı No: 12",
    "Atatürk Bulvarı No: 75",
    "Fatih Caddesi No: 88",
    "İstasyon Caddesi No: 23",
    "Şehitler Caddesi No: 56",
    "Gazi Caddesi No: 91",
    "Cumhuriyet Meydanı No: 18",
    "İnönü Caddesi No: 42",
    "Hastane Caddesi No: 67",
    "Çınar Caddesi No: 83",
    "Atatürk Bulvarı No: 99",
    "Fatih Caddesi No: 115",
    "İstasyon Caddesi No: 38",
    "Şehitler Caddesi No: 72",
    "Gazi Caddesi No: 106",
    "Cumhuriyet Meydanı No: 24",
    "İnönü Caddesi No: 57",
    "Hastane Caddesi No: 82",
    "Çınar Caddesi No: 98",
    "Atatürk Bulvarı No: 114",
    "Fatih Caddesi No: 130",
    "İstasyon Caddesi No: 53",
    "Şehitler Caddesi No: 87",
    "Gazi Caddesi No: 121",
    "Cumhuriyet Meydanı No: 30",
    "İnönü Caddesi No: 72",
    "Hastane Caddesi No: 97",
    "Çınar Caddesi No: 113",
    "Atatürk Bulvarı No: 129",
    "Fatih Caddesi No: 145",
    "İstasyon Caddesi No: 68",
    "Şehitler Caddesi No: 102",
    "Gazi Caddesi No: 136",
    "Cumhuriyet Meydanı No: 36",
    "İnönü Caddesi No: 87",
    "Hastane Caddesi No: 112",
    "Çınar Caddesi No: 128",
    "Atatürk Bulvarı No: 144",
    "Fatih Caddesi No: 160",
    "İstasyon Caddesi No: 83",
    "Şehitler Caddesi No: 117",
    "Gazi Caddesi No: 151",
    "Cumhuriyet Meydanı No: 42",
    "İnönü Caddesi No: 102",
    "Hastane Caddesi No: 127",
    "Çınar Caddesi No: 143",
    "Atatürk Bulvarı No: 159",
    "Fatih Caddesi No: 175",
    "İstasyon Caddesi No: 98",
    "Şehitler Caddesi No: 132",
    "Gazi Caddesi No: 166",
    "Cumhuriyet Meydanı No: 48",
    "İnönü Caddesi No: 117",
    "Hastane Caddesi No: 142",
    "Çınar Caddesi No: 158",
    "Atatürk Bulvarı No: 174",
    "Fatih Caddesi No: 190",
    "İstasyon Caddesi No: 113",
    "Şehitler Caddesi No: 147",
    "Gazi Caddesi No: 181",
    "Cumhuriyet Meydanı No: 54",
    "İnönü Caddesi No: 132",
    "Hastane Caddesi No: 157",
    "Çınar Caddesi No: 173",
    "Atatürk Bulvarı No: 189",
    "Fatih Caddesi No: 205",
    "İstasyon Caddesi No: 128",
    "Şehitler Caddesi No: 162",
    "Gazi Caddesi No: 196",
    "Cumhuriyet Meydanı No: 60",
    "İnönü Caddesi No: 147",
    "Hastane Caddesi No: 172",
    "Çınar Caddesi No: 188",
    "Atatürk Bulvarı No: 204",
    "Fatih Caddesi No: 220",
    "İstasyon Caddesi No: 143",
    "Şehitler Caddesi No: 177",
    "Gazi Caddesi No: 211",
    "Cumhuriyet Meydanı No: 66",
    "İnönü Caddesi No: 162",
    "Hastane Caddesi No: 187",
    "Çınar Caddesi No: 203",
    "Atatürk Bulvarı No: 219",
    "Fatih Caddesi No: 235",
    "İstasyon Caddesi No: 158",
    "Şehitler Caddesi No: 192"
]
  let citys = [
    "Adana",
    "Adıyaman",
    "Afyonkarahisar",
    "Ağrı",
    "Amasya",
    "Ankara",
    "Antalya",
    "Artvin",
    "Aydın",
    "Balıkesir",
    "Bilecik",
    "Bingöl",
    "Bitlis",
    "Bolu",
    "Burdur",
    "Bursa",
    "Çanakkale",
    "Çankırı",
    "Çorum",
    "Denizli",
    "Diyarbakır",
    "Edirne",
    "Elazığ",
    "Erzincan",
    "Erzurum",
    "Eskişehir",
    "Gaziantep",
    "Giresun",
    "Gümüşhane",
    "Hakkari",
    "Hatay",
    "Isparta",
    "Mersin",
    "İstanbul",
    "İzmir",
    "Kars",
    "Kastamonu",
    "Kayseri",
    "Kırklareli",
    "Kırşehir",
    "Kocaeli",
    "Konya",
    "Kütahya",
    "Malatya",
    "Manisa",
    "Kahramanmaraş",
    "Mardin",
    "Muğla",
    "Muş",
    "Nevşehir",
    "Niğde",
    "Ordu",
    "Rize",
    "Sakarya",
    "Samsun",
    "Siirt",
    "Sinop",
    "Sivas",
    "Tekirdağ",
    "Tokat",
    "Trabzon",
    "Tunceli",
    "Şanlıurfa",
    "Uşak",
    "Van",
    "Yozgat",
    "Zonguldak",
    "Aksaray",
    "Bayburt",
    "Karaman",
    "Kırıkkale",
    "Batman",
    "Şırnak",
    "Bartın",
    "Ardahan",
    "Iğdır",
    "Yalova",
    "Karabük",
    "Kilis",
    "Osmaniye",
    "Düzce"
]
const prepareMockForBookStores = async (req,res) => {
  for(let g = 0; g < 50; g++){

    bookStoreName = bookStoreNames[Math.floor(Math.random() * bookStoreNames.length)]
    bookstoreUsername = bookStoreName + numbers[Math.floor(Math.random() * numbers.length)].toString() + numbers[Math.floor(Math.random() * numbers.length)].toString()
  //phone number
  for(let k = 0; k < 10; k++){
    bookStorePhoneNumber += numbers[Math.floor(Math.random() * numbers.length)]
  }
  bookstoreAdresses = physicalAddresses[Math.floor(Math.random() * physicalAddresses.length)]
  bookstoreEmail = bookstoreUsername +"@gmail.com"
  bookStorePassword = bookstoreUsername + "123"

  const bookStore = {
    "name" : bookStoreName,
    "username" : bookstoreUsername.replace(" ",""),
    "email" : bookstoreEmail.replace(" ",""),
    "phoneNumber" : bookStorePhoneNumber,
    "password" : bookStorePassword.replace(" ",""),
    "city" : citys[Math.floor(Math.random() * citys.length)],
    "physcialAddress" : bookstoreAdresses
  }
  //citys[Math.floor(Math.random() * citys.length)]
  const newBookStore = new bookStoresModel(bookStore)
  await newBookStore.save()
  console.log(bookStore)

  bookstoreUsername = ""
  bookStoreName = ""
  bookstoreEmail = ""
  bookStorePhoneNumber = ""
  bookStorePassword = ""
  bookStorePhyscialAddress = ""
  }
  res.send()
}

const prepareMockForBookStoresBooks = async (req,res) => {
  const findbooks = await bookModel.find({})
  const findBookstores = await bookStoresModel.find({})
  for(const bookstoreIndex in findBookstores){
    //every bookstore must have 15 books
    for(let i = 0; i < 15; i++ ){
      const newBookStoresBook = {
        "bookStoreId" : findBookstores[bookstoreIndex]._id,
        "bookId" : findbooks[Math.floor(Math.random() * findbooks.length)]._id,
        "stockInfo" : Math.floor((Math.random() * 100) + 1),
        "price" : Math.floor((Math.random() * 2500) + 1)
      }
      const addbookToBookstoresBook = new bookStoresBookModel(newBookStoresBook)
      await addbookToBookstoresBook.save()
    }
  }


/*
  {
    "bookStoreId" : "65faec61f6e1bcfe6bb2d61f",
    "bookId" : "65faec87f6e1bcfe6bb2d625",
    "stockInfo" : 2,
    "price" : 356
  }
bookStoreId

bookId

stockInfo
2
price
32



{
  "_id": {
    "$oid": "65faec87f6e1bcfe6bb2d625"
  },
  "name": "deneme123",
  "description": "deneme123",
  "pageCount": 544,
  "category": "Sanat",
  "averageRating": 5,
  "publicationDate": "2024-03-15",
  "author": "deneme123",
  "ISBN": "12345678912",
  "images": [
    [
      {
        "index": 1,
        "path": "public/uploads/bookImages/deneme123/1.png"
      }
    ],
    [
      {
        "index": 2,
        "path": "public/uploads/bookImages/deneme123/2.png"
      }
    ]
  ],
  "isValidBook": false,
  "createdAt": {
    "$date": "2024-03-20T14:02:47.415Z"
  },
  "updatedAt": {
    "$date": "2024-03-20T14:02:47.415Z"
  },
  "__v": 0
}
*/
  
    res.send()
  }
module.exports = {
    prepareMockForBooks,
    prepareMockForBookStores,
    prepareMockForBookStoresBooks

}