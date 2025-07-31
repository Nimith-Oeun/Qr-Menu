> npm run build:client && npm run build:server


> build:client
> vite build

vite v6.3.5 building for production...
✓ 4 modules transformed.
✗ Build failed in 442ms
error during build:
Could not resolve "./pages/Admin" from "client/App.tsx"
file: D:/react/Project React coffe/Qr-Menu/client/App.tsx
    at getRollupError (file:///D:/react/Project%20React%20coffe/Qr-Menu/node_modules/rollup/dist/es/shared/parseAst.js:400:41)
    at error (file:///D:/react/Project%20React%20coffe/Qr-Menu/node_modules/rollup/dist/es/shared/parseAst.js:396:42)
    at ModuleLoader.handleInvalidResolvedId (file:///D:/react/Project%20React%20coffe/Qr-Menu/node_modules/rollup/dist/es/shared/node-entry.js:21379:24)
    at file:///D:/react/Project%20React%20coffe/Qr-Menu/node_modules/rollup/dist/es/shared/node-entry.js:21339:26
Deploying files to server...
scp: stat local "build/*": No such file or director