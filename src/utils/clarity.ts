import { clarity } from '@microsoft/clarity';
import siteConfig from '../data/site-config';

export function initClarity() {
    const { analytics } = siteConfig;

    if (analytics?.clarity?.enabled && analytics?.clarity?.projectId) {
        clarity.start({
            projectId: analytics.clarity.projectId,
            upload: {
                endpoint: 'https://www.clarity.ms/collect'
            }
        });
    }
}
