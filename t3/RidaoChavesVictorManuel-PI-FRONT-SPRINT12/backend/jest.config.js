export default {
    testEnvironment: 'node',
    transform: {},
    // Aumenta el timeout global para evitar errores de timeout en tests con MongoMemoryServer
    testTimeout: 30000,
    collectCoverage: true,
    collectCoverageFrom: [
        'src/app.js',
        'src/controllers/userController.js',
        'src/controllers/favoriteController.js',
        'src/controllers/aiController.js',
        'src/routes/authRoutes.js',
        'src/routes/favoriteRoutes.js',
        'src/routes/aiRoutes.js',
        'src/middlewares/authMiddleware.js',
    ],
    coverageThreshold: {
        global: {
            branches: 35,
            functions: 50,
            lines: 50,
            statements: 50,
        },
    },
};
