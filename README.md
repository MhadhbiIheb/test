# لوميرا · Lumiera — Backend MongoDB
## دليل التثبيت الكامل · Guide d'installation complet

---

## هيكل المشروع · Structure du projet

```
lumiera/
├── server/
│   ├── index.js      ← Serveur Express principal
│   ├── models.js     ← Schémas MongoDB (User, Salon, RDV, Stock...)
│   └── routes.js     ← Toutes les routes API
├── public/
│   ├── index.html    ← Page d'accueil (Landing Page)
│   ├── app.html      ← Application principale (Login + Dashboard)
│   ├── chatbot.html  ← Assistant IA Lumiera
│   └── api.js        ← Client API partagé (connecte toutes les pages)
├── .env              ← Variables d'environnement
├── package.json      ← Dépendances Node.js
└── README.md         ← Ce fichier
```

---

## 1. Prérequis · المتطلبات

- **Node.js** >= 18  →  https://nodejs.org
- **MongoDB** >= 7   →  https://www.mongodb.com/try/download/community
  - OU **MongoDB Atlas** (cloud gratuit) → https://www.mongodb.com/atlas

---

## 2. Installation · التثبيت

```bash
# Cloner / copier le projet
cd lumiera

# Installer les dépendances
npm install

# Configurer la base de données
cp .env .env.local
# Éditer .env et remplacer MONGODB_URI si nécessaire
```

---

## 3. Lancer MongoDB · تشغيل قاعدة البيانات

### Option A — MongoDB Local
```bash
# Windows
mongod --dbpath C:\data\db

# Mac / Linux
mongod --dbpath ~/data/db
# ou si installé via brew:
brew services start mongodb-community
```

### Option B — MongoDB Atlas (Cloud Gratuit)
1. Créer un compte sur https://www.mongodb.com/atlas
2. Créer un cluster gratuit (M0 Free)
3. Obtenir l'URI de connexion
4. Modifier `.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/lumiera
   ```

---

## 4. Lancer le serveur · تشغيل السيرفر

```bash
# Mode production
npm start

# Mode développement (rechargement auto)
npm run dev
```

**Résultat attendu:**
```
╔══════════════════════════════════════╗
║        LUMIERA SERVER STARTED         ║
╠══════════════════════════════════════╣
║  App:     http://localhost:3000       ║
║  API:     http://localhost:3000/api   ║
╚══════════════════════════════════════╝

✅ MongoDB connecté — Base: lumiera
✅ Base initialisée avec données demo
   Owner:  admin@lumiera.tn / demo1234
   Client: client@lumiera.tn / demo1234
```

---

## 5. Accès aux pages · الوصول للصفحات

| Page | URL | Description |
|------|-----|-------------|
| Landing Page | http://localhost:3000/ | الصفحة الرئيسية |
| Application | http://localhost:3000/app | Dashboard + Login |
| Chatbot | http://localhost:3000/chatbot | المساعد الذكي |
| API | http://localhost:3000/api | REST API JSON |

---

## 6. API Endpoints · نقاط الاتصال

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/auth/login | تسجيل الدخول |
| POST | /api/auth/register | إنشاء حساب |
| GET  | /api/auth/me | معلومات المستخدم |

### Rendez-vous
| Method | Route | Description |
|--------|-------|-------------|
| GET  | /api/rdv | كل المواعيد (owner) |
| GET  | /api/rdv/client | مواعيد الزبون |
| POST | /api/rdv | حجز موعد جديد |
| PATCH | /api/rdv/:id/statut | تغيير الحالة |
| DELETE | /api/rdv/:id | إلغاء موعد |

### Clients / Employés / Stock / Services
```
GET/POST    /api/clients
GET/POST    /api/employes
PATCH/DELETE /api/employes/:id
GET/POST    /api/stock
GET         /api/stock/alertes
GET/POST    /api/services
```

### Rapports
```
GET /api/rapports/dashboard  → KPIs du jour
GET /api/rapports/revenus?periode=mois  → Revenus par période
```

### POS / Paiements
```
GET/POST /api/paiements
```

---

## 7. Comptes de démonstration · حسابات تجريبية

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Propriétaire | admin@lumiera.tn | demo1234 |
| Client | client@lumiera.tn | demo1234 |

---

## 8. Schéma MongoDB · قاعدة البيانات

```
Collections:
├── users        → Utilisateurs (owners, clients, employés)
├── salons       → Établissements
├── services     → Services proposés par salon
├── employes     → Équipe du salon
├── rendezvous   → Réservations
├── stocks       → Inventaire produits
└── paiements    → Transactions POS
```

---

## 9. Variables d'environnement

```env
MONGODB_URI=mongodb://localhost:27017/lumiera
JWT_SECRET=votre_secret_tres_securise
PORT=3000
NODE_ENV=development
```

---

## 10. Déploiement · النشر على الإنترنت

### Render.com (gratuit)
1. Pousser le code sur GitHub
2. Créer un Web Service sur Render
3. Variables d'environnement: MONGODB_URI (Atlas), JWT_SECRET
4. Start command: `npm start`

### Railway.app
```bash
railway init
railway add mongodb
railway up
```

---

**Lumiera Platform — Fait avec ❤ en Tunisie 🇹🇳**
