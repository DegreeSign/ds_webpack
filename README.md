# DegreeSign webpack setup for WebApps
The progressive web application template built with Webpack and TypeScript. Leverage `@degreesign/webpack` package for streamlined configuration and deployment. In addition to server bundling.

## Features
- **Webpack-powered**: Optimised bundling for production-ready applications.
- **TypeScript Support**: Ensures type safety and modern JavaScript features.
- **Modular Structure**: Organised folder layout for scalability.
- **SEO & PWA Ready**: Configurable metadata and manifest for progressive web apps.
- **Customisable**: Flexible Webpack configuration via `@degreesign/webpack`.

## Recommended Setup
1. **Node.js**: Version 18.x or higher.
2. **Package Manager**: npm or Yarn.
3. **Dependencies**:
   - Install the `@degreesign/webpack` package: `npm install @degreesign/webpack`.
   - Install Webpack and TypeScript: `npm install webpack webpack-cli typescript ts-loader`.
4. **Environment**:
   - Create a `.env` file in the root directory with for any keys used in ts code.
   - Ensure a TypeScript configuration (`tsconfig.json`) is set up.
5. **IDE**: Use VS Code or any TypeScript-compatible editor for best experience.

## Package File
Add file `package.json` as following
```json
{
  "license": "MIT",
  "scripts": {
    "build": "webpack --config webpack.web.ts",
    "start": "webpack serve --config webpack.web.ts",
    "build_server": "webpack --config webpack.server.ts",
    "start_server": "webpack serve --config webpack.server.ts"
  },
  "devDependencies": {
    "@degreesign/webpack": "latest"
  }
}
```

## WebApp FrontEnd
WebApp front-end website configuration

### Folder Structure
```
app_folder/
├── public_html/                 # Output directory for production build
├── src/                         # Source files
│   ├── assets/                  # Static assets
│   │   ├── images/              # Image assets
│   │   │   ├── favicon.ico      # Favicon
│   │   │   ├── app_icon.png     # App icon for PWA
│   │   │   └── app_cover_image.webp  # Cover image for SEO
│   ├── code/                    # Utility scripts
│   │   └── utils.ts             # Shared TypeScript utilities (optional)
│   ├── pages/                   # Page-specific files
│   │   ├── home/                # Home page
│   │   │   ├── home.ts          # Home page logic
│   │   │   └── home.html        # Home page template
│   └── styles.css               # Global styles
├── webpack.web.ts            # Webpack configuration
├── .env                         # Environment variables
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Project metadata and scripts
```

### Configuration
Add `webpack.web.ts` file as the core of the webapp build process as following
```typescript
import { build } from "@degreesign/webpack";

module.exports = build({
  type: "webapp",
  websiteDomain: "example.com",
  websiteName: "Your App Name",
  appShortName: "AppName",
  twitterUserName: "YourApp",
  publishedTime: "2025-01-01T00:00:00+00:00",
  author: "Your Name",
  websiteTitle: "Your App Slogan",
  websiteDescription: "A brief description of your app.",
  coverImage: "app_cover_image.webp",
  coverImageDescription: "A descriptive alt text for the cover image.",
  background_color: "#ffffff",
  theme_color: "#000000",
  appIcon: "app_icon.png",
  appIconMaskable: "app_icon_maskable.png",
  fav_icon: "favicon.ico",
  orientation: "portrait",
  pagesList: [{
    uri: `home`,
    name: `HomePage`,
    description: `Progressive Web App (PWA) HomePage`,
  }],
  htmlCommonElements: [],
  obfuscateON: false,
  srcDir: "src",
  assetsDir: "assets",
  commonDir: "code",
  imagesDir: "images",
  pagesDir: "pages",
  pageHome: "home",
  productionDir: "public_html",
  htaccessCustom: "",
  startURI: "/",
  language: "en_GB",
  port: 3210,
});
```

## WebApp BackEnd
WebApp back-end server configuration

### Folder Structure
```
app_folder/
├── server_build/                # Output directory for production build
├── server/                      # Source files
│   ├── code/                    # Utility scripts
│   │   └── utils.ts             # Shared TypeScript utilities (optional)
│   └── main.ts                  # Main server file
├── webpack.server.ts            # Webpack configuration
├── .env                         # Environment variables
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Project metadata and scripts
```

### Configuration
Add `webpack.server.ts` file as the core of the server build process as following
```typescript
import { build } from "@degreesign/webpack";

module.exports = build({
    type: `server`,
    obfuscateON: true,
    srcDir: `server`,
    productionDir: `server_build`,
    filesList: [`main`],
    port: 3211,
});
```

## Key Configuration Notes
- **Environment Variables**: Use `.env` to securely store sensitive data.
- **Development Server**: Runs on `port: 3210` by default.
- **PWA Support**: Customise `app_icon`, `fav_icon`, and `orientation` for a native-like experience.
- **SEO Optimisation**: Set `websiteTitle`, `websiteDescription`, and `coverImage` for better search visibility.
- **Pages**: Add all pages to `pagesList`.

## Getting Started
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/DegreeSign/ds_webpack.git
   cd ds_webpack
   ```
2. **Install Dependencies**:
   ```bash
   yarn install
   ```
3. **Create Folders Structure**:
   Create folder structure for webapp, server, or both and add necessary files as explained above.
4. **Run Development Server**:
   *For WebApp*
   ```bash
   yarn start
   ```
   *For Server*
   ```bash
   yarn start_server
   ```
5. **Build for Production**:
   *For WebApp*
   ```bash
   yarn build
   ```
   Output will be in the `public_html/` directory.
   *For Server*
   ```bash
   yarn build_server
   ```
   Output will be in the `server_build/` directory.

## Contributing
1. Fork the repository.
2. Create a feature branch: `git checkout -b feature-name`.
3. Commit changes: `git commit -m "Add feature"`.
4. Push to the branch: `git push origin feature-name`.
5. Submit a pull request.

## License
This project is licensed under the MIT License. See the `LICENSE` file for details.