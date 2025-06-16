# HyperFX + Vinxi SSR Example

This example demonstrates server-side rendering (SSR) with HyperFX and Vinxi.

## Features

- ✅ **Server-Side Rendering** - Pages rendered on the server
- ✅ **SEO Optimization** - Meta tags, Open Graph, Twitter Cards
- ✅ **Client-Side Hydration** - Progressive enhancement
- ✅ **Universal Routing** - File-based and programmatic routing
- ✅ **Hot Module Replacement** - Fast development workflow
- ✅ **TypeScript Support** - Full type safety
- ✅ **Modern Build System** - Powered by Vinxi

## Getting Started

### Prerequisites

Make sure you have the HyperFX workspace set up and built:

```bash
# From the workspace root
cd /home/du/Code/hyperfx
pnpm install
pnpm build
```

### Install Dependencies

```bash
cd ssr-example
pnpm install
```

### Development

Start the development server with hot reload:

```bash
pnpm dev
```

Visit `http://localhost:3000` to see the SSR demo.

### Production Build

Build for production:

```bash
pnpm build
```

Start the production server:

```bash
pnpm start
```

## Project Structure

```
ssr-example/
├── src/
│   ├── server.ts    # Vinxi SSR handler
│   └── client.ts    # Client-side hydration
├── public/          # Static assets
├── app.config.ts    # Vinxi configuration
└── package.json     # Dependencies and scripts
```

## Routes

The example includes these routes:

- `/` - Home page with feature overview
- `/about` - About HyperFX
- `/products` - Product showcase
- `*` - 404 page for unknown routes

## How It Works

1. **Server-Side Rendering**: Vinxi calls the `server.ts` handler for each request
2. **Component Rendering**: HyperFX components are rendered to HTML strings
3. **SEO Enhancement**: Meta tags and structured data are added
4. **Client Hydration**: The client-side script adds interactivity
5. **Progressive Enhancement**: Works with or without JavaScript

## Key Benefits

### Performance
- Fast initial page load (server-rendered HTML)
- Improved Core Web Vitals
- Efficient caching strategies

### SEO
- Search engine friendly content
- Open Graph and Twitter Card support
- Proper meta tags and structured data

### Developer Experience
- Hot module replacement during development
- TypeScript support throughout
- Modern tooling with Vinxi

## Customization

### Adding Routes

Add new routes in `src/server.ts`:

```typescript
const routes: Record<string, () => VNode> = {
  '/': HomePage,
  '/about': AboutPage,
  '/new-page': NewPageComponent  // Add your component
};
```

### Styling

The example uses Tailwind CSS loaded from CDN. For production, consider:

- Adding Tailwind as a build dependency
- Using CSS-in-JS solutions
- Custom CSS files in the public directory

### State Management

For complex applications, integrate with:

- HyperFX reactive signals for client state
- Server-side data fetching
- Database connections in server handlers

## Deployment

### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install
COPY . .
RUN pnpm build
EXPOSE 3000
CMD ["pnpm", "start"]
```

## Learn More

- [HyperFX Documentation](../README.md)
- [Vinxi Documentation](https://vinxi.vercel.app/)
- [SSR Best Practices](../docs/ssr-guide.md)

## Contributing

Contributions are welcome! Please see the main [HyperFX repository](../) for contribution guidelines.
