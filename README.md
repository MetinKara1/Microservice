Merhaba,

Bu projede microservice mimarisi ile gerçek zamanlı bir stok güncelleme projesi yapmaya çalıştım. Kullandığım teknolojilerden bahsedeyim.
Frontend tarafında react kullandım. Backend tarafında ise node.js kullandım. Dağıtık sistem modelini tam olarak ortaya koyabilmek için açtığım repositorye iki ayrı 
react projesi yani iki ayrı arayüz yükledim. Projeyi kısaca özetlemek gerekirse; arayüzler birbirinden farklı olduğu için iki ayrı mağaza gibi düşünebiliriz. Bu iki ayrı 
mağazanın her ikisindede aynı ürünün bir adet stoğu bulunmakta. Clientlardan herhangi biri ürünü satın almak için butona bastığında diğer clientın ekranında real time 
olarak stok adedi güncelleniyor ve stok sıfır olarak güncellendiği için ürün artık satın alınamıyor. Projenin genel amacı bu şekildeydi. Stoğun real time güncellenmesi 
için yaptığım işlemler ise sırasyıla; güncel datayı backend post servisinde alıp önce mongo dbye kaydetmek. Ardından rabbitmqda kuyruğa stoğun güncellendiğine dair 
bir mesaj eklemek ve de bu kuruğu dinleyen socket io teknolojisi ile clientların browerlarını ve redislerini güncellemek şeklinde. Projenin anlaşılması için özet geçmeye 
çalıştım. Herhangi bir sorunuz olursa iletişime geçebilirsiniz.
