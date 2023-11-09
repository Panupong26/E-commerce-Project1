# E-commerce-Project1 (Personal project)

โปรเจคนี้เป็นโปรเจ็คเว็บไซต์ซื้อขายสินค้าออนไลน์ครับ โดยรูปแบบของเว็บไซต์สามารถรองรับได้ทั้งการซื้อสินค้า และการสมัครร้านค้าเพื่อขายสินค้า มีระบบยืนยันอีเมล ระบบตะกร้าสินค้า ระบบถูกใจร้านค้า และระบบพื้นฐานอื่นๆเพื่ออำนวยความสะดวกในการซื้อขายสินค้า
รวมถึงมีระบบแอดมินในระดับเบื้องต้น ที่สามารถตรวจสอบข้อมูลสินค้า คำสั่งซื้อในระบบ และคำขอถอนเงินจากผู้ขายได้ โดยอาจจะมีการเพิ่มระบบชำระเงินผ่าน QR code เข้าไปในอนาคต

ใช้ Express.js และ React ในการสร้าง </br>
ใช้ฐานข้อมูล MySql </br>

Figma https://www.figma.com/file/oyLai5nYubrlCAUJlCVTGQ/Project1-e-commerce?type=design&node-id=0%3A1&mode=design&t=wOd8fwnGyZwkdhz1-1

# การติดตั้ง
### ส่วน API 
-ทำการติดตั้งแพคเกจ โดย cd ไปที่โฟลเดอร์ project1-api และใช้คำสั่ง npm install </br>
-เปิดไฟล์ .env ในเพื่อทำการใส่ค่า </br>
  &nbsp;&nbsp;&nbsp;-Port </br> 
  &nbsp;&nbsp;&nbsp;-password สำหรับ MySql </br>
  &nbsp;&nbsp;&nbsp;-Secret key และ เวลาหมดอายุของ token </br>
  &nbsp;&nbsp;&nbsp;-Email สำหรับใช้ส่งในระบบยืนยัน โดยหากใช้ gmail password ที่ใช้ จะต้องได้จากการ generate application password </br>
  &nbsp;&nbsp;&nbsp;-URL ของฝั่ง web </br>
-ทำการสร้าง schema MySql โดยชื่อจะต้องตรงกับชื่อที่ตั้งไว้ใน .env (DB_NAME) </br>
-เริ่มการทำงาน sever โดยคำสั่ง npx nodemon </br>

### ส่วน WEB 
-ทำการติดตั้งแพคเกจ โดย cd ไปที่โฟลเดอร์ project1-web และใช้คำสั่ง npm install </br>
-เปิดไฟล์ env.js ในโฟลเดอร์ src ทำการใส่ค่า URL ของฝั่ง web และ ของฝั่ง api </br>
-เริ่มการทำงานโดยคำสั่ง npm start </br>
 