# MERN Blog

Chhota sa full-stack blog app — React (Vite) frontend + Node/Express backend + MongoDB. CRUD (Create, Read, Update, Delete) posts ke liye. EC2 par PM2 + Nginx reverse proxy ke saath deploy karne ke liye ready.

## Tech Stack

- **Frontend:** React (Vite), React Router, Axios
- **Backend:** Node.js, Express, Mongoose
- **Database:** MongoDB

## Folder Structure

```
mern-blog/
├── backend/
│   ├── models/Post.js
│   ├── routes/posts.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── pages/ (Home, PostDetail, CreatePost, EditPost)
    │   ├── App.jsx
    │   ├── api.js
    │   └── main.jsx
    └── package.json
```

## Local Development

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# .env me apna MONGO_URI daal do (local Mongo ya Atlas connection string)
npm run dev       # nodemon se, port 5000 par
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev        # port 5173 par, /api calls backend:5000 ko proxy hoti hain
```

Browser me `http://localhost:5173` kholo.

---

## EC2 Deployment (PM2 + Nginx Reverse Proxy)

Tumhare Docket/React apps wale established pattern jaisa hi setup.

### Step 1 — EC2 Instance Prepare Karo

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y nginx
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2
```

MongoDB ke liye do options:
- **MongoDB Atlas** (recommended, free tier) — connection string `.env` me daal do.
- Ya EC2 par hi MongoDB install karo.

### Step 2 — Code EC2 Par Le Jao

```bash
# local se scp karo, ya EC2 par git clone karo
scp -i your-key.pem -r mern-blog ubuntu@<EC2_PUBLIC_IP>:/home/ubuntu/
```

### Step 3 — Backend Setup

```bash
cd /home/ubuntu/mern-blog/backend
npm install --production
cp .env.example .env
nano .env     # MONGO_URI aur PORT set karo
```

### Step 4 — Frontend Build Karo

```bash
cd /home/ubuntu/mern-blog/frontend
npm install
npm run build     # dist/ folder banega
```

Backend ka `server.js` already configured hai ki `NODE_ENV=production` set hone par `frontend/dist` ko serve kare — matlab ek hi Express server dono API aur static React build serve kar sakta hai, agar tum single-instance setup chahte ho.

### Step 5 — PM2 Se Backend Start Karo

```bash
cd /home/ubuntu/mern-blog/backend
NODE_ENV=production pm2 start server.js --name mern-blog
pm2 save
pm2 startup     # ye command jo output de, usse run karo (boot par auto-start)
```

### Step 6 — Nginx Reverse Proxy Config

```bash
sudo nano /etc/nginx/sites-available/mern-blog
```

Ye config paste karo:

```nginx
server {
    listen 80;
    server_name your_domain_or_ec2_ip;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable karo:

```bash
sudo ln -s /etc/nginx/sites-available/mern-blog /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 7 — Security Group

EC2 Security Group me inbound rules check karo:
- Port 80 (HTTP) — 0.0.0.0/0
- Port 22 (SSH) — apna IP

Ab `http://<EC2_PUBLIC_IP>` par app live hai.

---

## Alternative: Frontend Alag Serve Karna (S3/CloudFront)

Agar tum frontend ko backend se alag serve karna chahte ho (jaise tumhare 3-tier HA architecture diagrams me), to:
1. `frontend/dist` ko S3 static hosting par upload karo + CloudFront ke peeche.
2. `frontend/src/api.js` me `baseURL` ko backend ke actual domain/ALB URL se replace karo.
3. Backend ko sirf `/api` routes serve karne do (static file serving hata do).

Ye resume portfolio ke liye acha hai kyunki tum apne existing 3-tier AWS architecture (ALB, Auto Scaling, RDS/DocumentDB) ke saath is app ko bhi map kar sakte ho.

## API Endpoints

| Method | Endpoint          | Description       |
|--------|--------------------|--------------------|
| GET    | /api/posts         | Saare posts        |
| GET    | /api/posts/:id     | Ek post            |
| POST   | /api/posts         | Naya post banao    |
| PUT    | /api/posts/:id     | Post update karo   |
| DELETE | /api/posts/:id     | Post delete karo   |
