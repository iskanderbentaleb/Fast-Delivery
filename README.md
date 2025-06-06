# 📦 Fast-Delivery: Delivery Management System

A modern web application built with Laravel 12, Inertia.js, and React.js, designed to streamline parcel delivery operations. Fast-Delivery enables efficient parcel management, label printing, status tracking, payment processing, and provides dedicated dashboards for administrators and delivery personnel (livreurs).

---

## 🚀 Features

- **Parcel Management:** Easily create, update, and track parcels
- **Label Printing:** Generate and print shipping labels
- **Status Tracking:** Monitor parcel status throughout the delivery process
- **Export Functionality:** Export data in Excel (XLSX) format for reporting
- **Multi-Authentication:** Separate authentication for administrators and livreurs
- **Payment Management:** Track payments for both livreurs and stores
- **Dashboard Analytics:** Visualize key metrics with interactive dashboards
- **Dark/Light Mode:** Toggle between dark and light themes
- **Responsive Design:** Fully functional across all device sizes

---

## 🛠️ Tech Stack

**Backend:**
- Laravel 12
- MySQL

**Frontend:**
- React.js (TypeScript) with Inertia.js
- Tailwind CSS
- Shadcn UI

**Additional:**
- Laravel 12 Starter Kit (modified to support two user types)

---

## ⚡ Installation

### Prerequisites

- PHP 8.2+
- MySQL 5.7+
- Node.js 18+
- Composer 2.0+
- XAMPP/WAMP/LAMP (or equivalent)

### Setup Instructions

1. **Clone the repository**
    ```bash
    git clone https://github.com/iskanderbentaleb/Fast-Delivery.git
    cd Fast-Delivery
    ```

2. **Install dependencies**
    ```bash
    composer install
    npm install
    ```

3. **Configure environment**
    ```bash
    cp .env.example .env
    ```
    > **Note:** Edit the `.env` file with your database credentials and mail settings.

4. **Generate application key**
    ```bash
    php artisan key:generate
    ```

5. **Database setup**
    - Edit `database/seeders/UserSeeder.php` with your admin credentials
    - Edit `database/seeders/LivreurSeeder.php` with your delivery personnel credentials
    - Run migrations and seeders:
      ```bash
      php artisan migrate --seed
      ```

6. **Start the development server**
    ```bash
    composer run dev
    ```

7. **Access the application**
    - **Admin:** [http://localhost:8000/admin/login](http://localhost:8000/admin/login)
    - **Livreur:** [http://localhost:8000/livreur/login](http://localhost:8000/livreur/login)

---

## 📄 License

This project is open-source and free to use.

---

## 📬 Contact

For inquiries or support, please contact:  
📧 iskanderboss1999@gmail.com

