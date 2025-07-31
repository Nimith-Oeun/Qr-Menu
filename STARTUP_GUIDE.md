# 🚀 QR Menu System - Startup Guide

## Prerequisites
Make sure these services are running:
- ✅ PostgreSQL (port 5432) with database `qr_menu`
- ✅ Redis (port 6379)

## Step 1: Start Spring Boot Backend
```powershell
cd d:\SpringBoot\qr_menu
mvn spring-boot:run
```
**Backend will be available at:** `https://qr-menu-api-oj76.onrender.com`

## Step 2: Start React Frontend
```powershell
cd "c:\Users\Nimith\Desktop\Qr-Menu-ChhongCoffe"
npm run dev
```
**Frontend will be available at:** `http://localhost:5173`

## Step 3: Access the Application

### Customer View (QR Menu)
- URL: `http://localhost:5173/qr-menu-chhong_caffe`
- Mobile-optimized for QR code scanning
- Browse drinks and food items

### Admin Panel
- URL: `http://localhost:5173/qr-menu-chhong_caffe/admin`
- Add, edit, delete menu items
- Full CRUD operations

### API Endpoints
- All menu items: `http://localhost:8090/api/menu`
- Drinks only: `http://localhost:8090/api/menu/DRINK`
- Foods only: `http://localhost:8090/api/menu/FOOD`
- Separated menu: `http://localhost:8090/api/menu-separated`

## Testing the Integration

1. **Start both applications**
2. **Add sample data** via the admin panel
3. **View customer menu** to see real-time updates
4. **Test API directly** in browser or Postman

## Troubleshooting

### Backend Issues
- Check if PostgreSQL is running
- Check if Redis is running
- Verify database connection in `application.yml`

### Frontend Issues
- Check if `https://qr-menu-api-oj76.onrender.com` in `.env.development`
- Verify backend is running and accessible
- Check browser console for errors

### Integration Issues
- Verify CORS is enabled in Spring Boot
- Check network connections between frontend and backend
- Test API endpoints directly first

## Environment Files Created
- `.env.development` - Development configuration
- `.env.production` - Production configuration

## Next Steps
1. Add sample menu data
2. Customize UI/branding
3. Add image upload functionality
4. Deploy to production
