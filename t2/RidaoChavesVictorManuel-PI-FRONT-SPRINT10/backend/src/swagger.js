// swagger.js - Configura Swagger para documentación interactiva de la API REST.
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'FitFood Backend API',
        version: '1.0.0',
        description: 'Documentación de la API REST de FitFood',
    },
    servers: [
        {
            url: 'http://localhost:5000',
            description: 'Servidor local',
        },
    ],
};

const options = {
    swaggerDefinition,
    apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

export default (app) => {
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
