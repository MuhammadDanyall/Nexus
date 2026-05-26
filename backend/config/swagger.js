const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Nexus Platform API',
      version: '1.0.0',
      description: 'API Documentation for the Nexus Collaboration Platform',
      contact: {
        name: 'Developer'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Local development server'
      },
      {
        url: 'https://nexus-6koz.onrender.com',
        description: 'Production server on Render'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./routes/*.js', './controllers/*.js'] // Paths to files containing OpenAPI definitions
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = swaggerDocs;
