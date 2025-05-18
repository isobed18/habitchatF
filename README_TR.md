# Habit Tracker - React Native Mobil Uygulaması

Bu proje, React Native (Expo) ve Django backend kullanılarak geliştirilmiş sosyal bir habit takip uygulamasıdır.

Bu, Habit Tracker projesinin frontend (mobil uygulama) kısmıdır.

## Özellikler
- Sosyal alışkanlık takibi
- Fotoğrafla doğrulama sistemi
- Başarım ve ödül sistemi
- Avatar özelleştirme
- Arkadaşlarla alışkanlıkları doğrulama sistemi

## Ön Gereksinimler
- Node.js (v14 veya üzeri)
- npm veya yarn
- Expo CLI
- Mobil cihazınızda Expo Go uygulaması kurulu olmalı

## Kurulum

**Önemli:** Bu frontend uygulamasının çalışması için backend sunucusunun çalışıyor olması gerekmektedir. Lütfen öncelikle backend reposundaki README dosyasındaki talimatları izleyerek backend'i kurun:

[Habit Tracker Backend Reposu](https://github.com/isobed18/habitchatB)

Backend kurulup çalışır duruma geldikten sonra, frontend kurulumuna devam edin:

1. Bu repoyu klonlayın:
```bash
git clone https://github.com/isobed18/habitchatF.git
cd habit_f
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. API URL'ini Yapılandırın:
Projenin ana dizininde `.env` adında bir dosya oluşturun ve backend API URL'inizi buraya ekleyin:
```
API_URL=http://YEREL_IP_ADRESINIZ:8000/api/
```

Yerel IP Adresinizi bulmak için:
- Windows:
  1. Komut İstemi'ni açın
  2. `ipconfig` yazın
  3. "Wireless LAN adapter Wi-Fi: IPv4 Address" kısmına bakın
- Mac/Linux:
  1. Terminal'i açın
  2. `ifconfig` yazın
  3. WiFi arayüzünüzün altındaki "inet" kısmına bakın

4. Geliştirme sunucusunu başlatın:
```bash
npx expo start
```

5. Cihazınızda Çalıştırın:
- Mobil cihazınıza Expo Go uygulamasını yükleyin
- Terminalde veya tarayıcıda görünen QR kodu tarayın
- Uygulama cihazınızda açılacaktır

## Önemli Notlar
- Frontend'i başlatmadan önce backend sunucusunun çalıştığından emin olun
- Frontend ve backend aynı ağda olmalıdır
- IP adresiniz değişirse, .env dosyasındaki API_URL'ini güncellemeyi unutmayın
- Geliştirme sürecinde hem frontend hem de backend aynı anda çalışıyor olmalıdır
- .env dosyanızı asla git'e commit etmeyin (.gitignore dosyasına eklenmiştir)
- API bağlantı hataları alırsanız, şunları kontrol edin:
  1. .env dosyasındaki IP adresiniz doğru mu?
  2. Backend sunucusu çalışıyor mu?
  3. Backend sunucusuyla aynı ağda mısınız?

## Kullanılabilir Komutlar
- `npx expo start` - Expo geliştirme sunucusunu başlatır
- `npx expo start --android` - Uygulamayı Android'de çalıştırır
- `npx expo start --ios` - Uygulamayı iOS'ta çalıştırır
- `npx expo start --web` - Uygulamayı web tarayıcısında çalıştırır

## Proje Yapısı
- `/assets` - Resimler ve diğer statik dosyalar
- `/HomeModals` - Ana ekran için modal bileşenler
- `/services` - API ve diğer servisler
- `/utils` - Yardımcı fonksiyonlar

## Katkıda Bulunma
1. Repoyu Fork'layın
2. Yeni bir branch oluşturun
3. Değişikliklerinizi commit edin
4. Branch'inize push edin
5. Yeni bir Pull Request oluşturun 