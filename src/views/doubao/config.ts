export const ws_connect_config = {
  base_url: 'wss://openspeech.bytedance.com/api/v3/realtime/dialogue',
  headers: {
    'X-Api-App-ID': '3810425215',
    'X-Api-Access-Key': 'mHT8sdy_o3wVHNSIw9jfJqCawEu0Aq5s',
    'X-Api-Resource-Id': 'volc.speech.dialog', // 固定值
    'X-Api-App-Key': 'PlgvMymc7f3tQnJ6', // 固定值
    'X-Api-Connect-Id': createUUID(),
  },
}
