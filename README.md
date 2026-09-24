# ApexGarments ERP — Client (Frontend)

React + Vite + Tailwind CSS Frontend for ApexGarments ERP Application.

## 🚀 Netlify Deployment Instructions

1. Push this `client` folder to your GitHub **Client Repository**:
   ```bash
   cd client
   git init
   git add .
   git commit -m "Initial commit of ApexGarments Client"
   git branch -M main
   git remote add origin <YOUR_GITHUB_CLIENT_REPO_URL>
   git push -u origin main
   ```

2. Log in to [Netlify](https://app.netlify.com/):
   - Click **Add new site** -> **Import an existing project** -> **GitHub**.
   - Select your **Client Repository**.
   - **Build Command**: `npm run build`
   - **Publish directory**: `dist`
   - Click **Deploy site**.

3. **Routing & 404 Prevention**:
   - `public/_redirects` and `netlify.toml` are already included so route reloads work smoothly without 404 errors.
