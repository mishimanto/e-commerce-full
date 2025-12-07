#E-commerce (Laravel)

<p align="center">
  <a href="https://laravel.com" target="_blank">
    <img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="300" alt="Laravel Logo">
  </a>
</p>

## Overview

This is a **Mini E-commerce REST API** built using **Laravel 12**.  
It demonstrates:

- User registration & login with **Laravel Sanctum**  
- Role-based access control (Admin/User)  
- Product management (Admin only)  
- Order management (Authenticated users)  
- Pagination & search for products  
- Request validation and proper JSON responses  

## Technologies Used

| Technology          | Version | Description                 |
| ------------------- | ------- | --------------------------- |
| **Laravel**         | 12.x    | Backend framework           |
| **PHP**             | 8.2.12  | Server-side language        |
| **React**           | Latest  | Fronted library             |
| **MySQL / MariaDB** | 10.4+   | Relational database         |
| **Composer**        | Latest  | PHP dependency manager      |
| **Node**            | 22      | React dependency manager    |
| **Postman**         | Latest  | API testing tool            |
                                                                                           

## Default Credentials

| Role  | Email              | Password |
| ----- | ------------------ | -------- |
| Admin | admin@gmail.com    | shimanto |
| User  | user@gmail.com     | shimanto |


# Installation Instructions

```bash
1. Clone the repository:  
git clone <https://github.com/mishimanto/e-commerce-full>
cd mini-ecommerce-api

2. Install dependencies:
composer install

3. Copy .env.example → .env and update database credentials:

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ecm
DB_USERNAME=root
DB_PASSWORD=

4. Generate Key:
php artisan key:generate

5. Run migrations and seeders:
php artisan migrate 
php artisan db:seed 


6.Run the development server:
php artisan serve
npm run build (Another CMD)
npm run dev

7. Access:
http://localhost:8000

