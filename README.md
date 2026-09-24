# SpendSense

SpendSense is a personal finance management application built with **Spring Boot, React, and PostgreSQL**. It helps users track their expenses, manage budgets, and gain insights into their spending habits through an easy-to-use dashboard.

## 🚀 Features

- 🔐 User authentication and authorization
- 💰 Track income and expenses
- 🏷️ Categorize transactions
- 📊 Visualize spending patterns
- 🎯 Manage personal budgets
- 📈 Financial insights and summaries
- 🔎 View and manage transaction history
- 🗄️ Persistent PostgreSQL database
- 🐳 Dockerized backend and database setup
- 🌐 React-based responsive frontend

## 🛠️ Tech Stack

### Backend

- Java 21
- Spring Boot
- Spring Security
- REST APIs
- PostgreSQL
- JPA / Hibernate
- Maven
- Docker

### Frontend

- React
- JavaScript
- Vite
- Tailwind CSS
- Axios
- Recharts

### Database & Infrastructure

- PostgreSQL
- Docker
- Docker Compose

## 🏗️ Architecture

```text
                    ┌─────────────────────┐
                    │      React UI       │
                    │   Vite + Tailwind   │
                    └──────────┬──────────┘
                               │
                              HTTP
                               │
                               ▼
                    ┌─────────────────────┐
                    │    Spring Boot      │
                    │     REST API        │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │     PostgreSQL      │
                    │      Database       │
                    └─────────────────────┘
