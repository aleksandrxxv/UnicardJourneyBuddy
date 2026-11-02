import 'dotenv/config';

export const env = {
  port: Number(process.env.PORT ?? 4000),
  tflAppKey: process.env.TFL_APP_KEY ?? '',
};
