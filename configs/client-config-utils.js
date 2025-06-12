import { CLIENT_CONFIGS } from './client-config.js';

export function getClientConfig(clientName) {
  const name = clientName || process.env.CLIENT || 'farmers';

  const config = CLIENT_CONFIGS[name];

  if (!config) {
    throw new Error(`Client config not found for: "${name}". Check CLIENT_CONFIGS or your environment variable.`);
  }

  return config;
}
