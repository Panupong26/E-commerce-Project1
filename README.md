# E-commerce-Project1 (Personal project)

โปรเจคนี้เป็นโปรเจ็คเว็บไซต์ซื้อขายสินค้าออนไลน์ครับ โดยรูปแบบของเว็บไซต์สามารถรองรับได้ทั้งการซื้อสินค้า และการสมัครร้านค้าเพื่อขายสินค้า มีระบบยืนยันอีเมล ตะกร้าสินค้า ถูกใจร้านค้า รีวิวสินค้า และระบบพื้นฐานอื่นๆเพื่ออำนวยความสะดวกในการซื้อขายสินค้า
รวมถึงมีระบบแอดมินในระดับเบื้องต้น ที่สามารถตรวจสอบข้อมูลสินค้า คำสั่งซื้อในระบบ และคำขอถอนเงินจากผู้ขายได้ 

ใช้ Express.js และ React ในการสร้าง </br>
ใช้ฐานข้อมูล MySql </br>

Figma https://www.figma.com/file/oyLai5nYubrlCAUJlCVTGQ/Project1-e-commerce?type=design&node-id=0%3A1&mode=design&t=wOd8fwnGyZwkdhz1-1 </br>

วิดีโอตัวอย่าง </br>
หน้าแรก-หน้าสินค้า-หน้าร้านค้า : [video](https://drive.google.com/file/d/1KLmhZ2-x8KP2nViKmyIW8DTRntm9zPcO/view?usp=sharing)</br>
การสร้างบัญชีผู้ซื้อ : [video](https://drive.google.com/file/d/1VUAZ-IzrVaWsCaV0HfQC8R3Hjqh8Yqtc/view?usp=sharing) </br>
ฟีเจอร์ถูกใจร้านค้า : [video](https://drive.google.com/file/d/18kXBKOdJBCTMT-piHbEBhvPUyaSA1ty-/view?usp=sharing) </br>
การสร้างร้านค้า และ เพิ่มสินค้า : [video](https://drive.google.com/file/d/1N1Cx8xLi6sOdq2B_KGcVXSQ-i75Gq7oC/view?usp=sharing) </br>
การสั่งซื้อสินค้า : [video](https://drive.google.com/file/d/1_jBQIQ6a_KDYJaXtQVsHS__i4FspuZZo/view?usp=sharing) </br>
ระบบตะกร้าสินค้า : [video](https://drive.google.com/file/d/14KaMenGe0OJWkZCe66FGxPceU2CEiZIr/view?usp=sharing) </br>
การรับคำสั่งซื้อ และ update การจัดส่ง : [video](https://drive.google.com/file/d/10cHupRNWeF4qIxfajUn4NsNMH0bqHPSj/view?usp=sharing) </br>
การรับสินค้า และ รีวิวสินค้า : [video](https://drive.google.com/file/d/1RbpeZiq9eOrCoes-buXuv3FVHEx6c3mK/view?usp=sharing) </br>
ฟีเจอร์แสดงสถิติการขายสินค้า : [video](https://drive.google.com/file/d/1mkvNqpAYPIh0FWTYMTbjjiolX2n_ct9N/view?usp=sharing) </br>
การถอนเงินจากการขายสินค้า : [video](https://drive.google.com/file/d/1r9Jj0czVs0rJYUsoWKs4uxQBqItTjMB6/view?usp=sharing) </br>
การยกเลิกคำสั่งซื้อ : [video](https://drive.google.com/file/d/13DMbA2N2I-C4anSWm5S11qBY7zrvpAIx/view?usp=sharing) </br>
การ update สถานะคำขอถอนเงินจากการขาย และ คำขอคืนเงินจากการยกเลิกคำสั่งซื้อ : [video](https://drive.google.com/file/d/1OBYG5ogKT_x04azrLHxf9N3jbuXDo3JP/view?usp=sharing) </br>



*เนื่องจากยังไม่มีประสบการณ์และเป็นโปรเจคส่วนตัวชิ้นแรก หากมีข้อผิดพลาด หรือไม่เรียบร้อยในส่วนไหน ต้องขออภัยไว้ ณ ที่นี้ด้วยครับ ขอบคุณครับ

# การติดตั้ง
### ส่วน API 
-ทำการติดตั้งแพคเกจ โดย cd ไปที่โฟลเดอร์ project1-api และใช้คำสั่ง 
```
npm install 
```
-เปิดไฟล์ .env ในโฟลเดอร์ project1-api เพื่อทำการใส่ค่า </br>
  &nbsp;&nbsp;&nbsp;-Port </br> 
  &nbsp;&nbsp;&nbsp;-password สำหรับ MySql </br>
  &nbsp;&nbsp;&nbsp;-Secret key และ เวลาหมดอายุของ token </br>
  &nbsp;&nbsp;&nbsp;-Email address สำหรับใช้ส่งในระบบยืนยัน โดยหากใช้ Gmail   password ที่ใช้ จะต้องได้จากการ generate application password </br>
  &nbsp;&nbsp;&nbsp;-Stripe private key (สมัคร Stripe โดยยังไม่ต้องยืนยันธุรกิจ และเขาไปคัดลอกในส่วน API secret key มาใช้สำหรับทดสอบระบบชำระเงิน (Test mode)) </br>
  &nbsp;&nbsp;&nbsp;-URL ของฝั่ง web </br>
-ทำการสร้าง schema MySql โดยชื่อจะต้องตรงกับชื่อที่ตั้งไว้ใน .env (DB_NAME) </br>
-เริ่มการทำงาน sever โดยคำสั่ง 
```
npx nodemon
``` 


### ส่วน WEB 
-ทำการติดตั้งแพคเกจ โดย cd ไปที่โฟลเดอร์ project1-web และใช้คำสั่ง
```
npm install
```
-เปิดไฟล์ env.js ในโฟลเดอร์ src ทำการใส่ค่า URL ของฝั่ง web และ ของฝั่ง api </br>
-เริ่มการทำงานโดยคำสั่ง
```
npm start
```

 
