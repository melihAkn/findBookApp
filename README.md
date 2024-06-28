## Projenin amacı
kullanıcı kitap satın alacağı zaman kargo beklemek yerine kendi şehrinde ki aradığı kitabı satan mağazalardan satın alabilmesi
## Resimler




## Kurulum ve Çalıştırma
Aşağıdaki adımları izleyerek projeyi yerel makinenizde çalıştırabilirsiniz
1. projeyi klonlayın:
```shell
git clone https://github.com/melihAkn/localBookMarketApp.git](https://github.com/melihAkn/findBookApp.git
```

2. Proje klasörüne gidin:

```shell
cd .\findBookApp
```

3. projenin ana dizinine .env adında bir dosya oluşturun ve içine aşağıdaki kodları yazın
```shell
CONNECTION_STRING = "mongodb://localhost:27017/findBookInMyCity"
SECRET_KEY = "secret"
JWT_USER_SECRET_KEY = "secret"
JWT_BOOKSTORES_SECRET_KEY = "secret"
```

4. Gerekli bağımlılıkları yüklemek için aşağıdaki komutu çalıştırın:

```shell
npm install
```

5. MongoDB veritabanını başlatın:

```shell
mongod
```

6. Projeyi başlatmak için aşağıdaki komutu çalıştırın:

```shell
npm start
```
7. projeyi tarayıcınızda şu adrese giderek goruntuleyeblirsiniz
http://localhost:3000/
