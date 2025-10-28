# Microsoft Clarity Integration Setup

This guide explains how to set up Microsoft Clarity analytics in your Astro.js project.

## 🚀 Quick Setup

### 1. Get Your Clarity Project ID

1. Go to [Microsoft Clarity](https://clarity.microsoft.com/)
2. Sign in with your Microsoft account
3. Create a new project or use an existing one
4. Copy your Project ID (it looks like `abc123def456`)

### 2. Configure Your Project

Open `src/data/site-config.ts` and update the analytics configuration:

```typescript
analytics: {
  clarity: {
    projectId: 'your-actual-project-id', // Replace with your Clarity Project ID
    enabled: true // Set to true to enable tracking
  }
}
```

### 3. Deploy and Test

1. Run `npm run build` and `npm run preview` to test locally
2. Deploy your site
3. Visit your site to verify Clarity is collecting data
4. Check your Clarity dashboard to see heatmaps and session recordings

## 📊 What You Can Track

Microsoft Clarity provides:
- **Heatmaps**: Visual representation of where users click, move, and scroll
- **Session Recordings**: Watch how users interact with your site
- **Insights**: Automatic detection of UX issues like rage clicks and dead clicks
- **Analytics**: Page views, unique visitors, and bounce rates

## 🔧 Advanced Configuration

### Environment-based Tracking

You can conditionally enable Clarity based on environment:

```typescript
// In site-config.ts
analytics: {
  clarity: {
    projectId: import.meta.env.PUBLIC_CLARITY_PROJECT_ID,
    enabled: import.meta.env.PROD // Only track in production
  }
}
```

### Custom Events

You can track custom events using the Clarity API:

```typescript
import { clarity } from '@microsoft/clarity';

// Track custom events
clarity.event('button_click', { 
  button_id: 'subscribe',
  page: '/blog'
});

// Set user identification
clarity.identify('user123', 'premium_user', 'user@example.com');
```

## 🛠️ Files Created/Modified

- ✅ `src/utils/clarity.ts` - Clarity initialization utility
- ✅ `src/data/site-config.ts` - Added analytics configuration
- ✅ `src/layouts/BaseLayout.astro` - Integrated Clarity initialization
- ✅ `package.json` - Added @microsoft/clarity dependency

## 📝 Important Notes

- Clarity only works in production environments (or when served over HTTP/HTTPS)
- The script is loaded asynchronously and won't affect your site's performance
- All data collection is GDPR and CCPA compliant
- You can pause or delete data collection at any time from your Clarity dashboard

## 🆘 Troubleshooting

If Clarity isn't working:

1. Check that `enabled: true` in your config
2. Verify your project ID is correct
3. Make sure you're accessing your site over HTTP/HTTPS
4. Check browser console for any errors
5. Wait a few minutes for data to appear in your Clarity dashboard

For more information, visit the [Microsoft Clarity documentation](https://learn.microsoft.com/en-us/clarity/).