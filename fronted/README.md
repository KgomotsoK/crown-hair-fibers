# Cuvva Hair Fibers

This is a [Next.js](https://nextjs.org) project for the Cuvva Hair Fibers e-commerce website.

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Development

### Prerequisites
- Node.js 20+
- npm 10+

### Installation
```bash
npm install
```

### Available Scripts
- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Run ESLint with auto-fix
- `npm run analyze` - Analyze the bundle size
- `npm run check-types` - Check TypeScript types

## Deployment

### Environment Variables
Make sure to set the following environment variables:

```
# API URLs
NEXT_PUBLIC_API_URL=https://api.cuvvahairfibers.com
NEXT_PUBLIC_SITE_URL=https://cuvvahairfibers.com

# WooCommerce API
NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY=your_consumer_key
NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET=your_consumer_secret
```

### Deploying with Docker
This application can be deployed using Docker:

```bash
# Build the Docker image
docker build -t cuvva-frontend \
  --build-arg NEXT_PUBLIC_API_URL=https://api.cuvvahairfibers.com \
  --build-arg NEXT_PUBLIC_SITE_URL=https://cuvvahairfibers.com \
  .

# Run the container
docker run -p 3000:3000 cuvva-frontend
```

### Deployment to Vercel

The easiest way to deploy this app is to use the [Vercel Platform](https://vercel.com/new) from the creators of Next.js.

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Import the project into Vercel
3. Set the environment variables
4. Deploy

## Production Checklist

Before deploying to production, ensure:

- [ ] All environment variables are properly set
- [ ] All linting issues are resolved (`npm run lint`)
- [ ] TypeScript types are checked (`npm run check-types`)
- [ ] Production build succeeds (`npm run build`)
- [ ] Test the application in a staging environment
- [ ] Image optimization and caching are configured
- [ ] Security headers are set up (handled in next.config.ts)

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
