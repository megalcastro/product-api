export const CONFIG = {
    PORT: process.env.PORT || 3000,
    JWT_SECRET: process.env.JWT_SECRET || 'default_secret',
    DATABASE: {
      HOST: process.env.DB_HOST || 'localhost',
      PORT: parseInt(process.env.DB_PORT || '5432', 10),
      USER: process.env.DB_USER || 'admin',
      PASSWORD: process.env.DB_PASSWORD || 'admin',
      NAME: process.env.DB_NAME || 'postgres',
    },
    CONTENTFUL_API:{
     CONTENTFUL_SPACE_ID:process.env.CONTENTFUL_SPACE_ID,
     CONTENTFUL_ACCESS_TOKEN:process.env.CONTENTFUL_ACCESS_TOKEN,
     CONTENTFUL_ENVIRONMENT:process.env.CONTENTFUL_ENVIRONMENT,
     CONTENTFUL_CONTENT_TYPE:process.env.CONTENTFUL_CONTENT_TYPE,
    }
  };
  