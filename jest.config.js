module.exports = {
    collectCoverageFrom: ["src/**/*.{js,jsx,ts,tsx}", "!src/**/*.d.ts"],
    coverageDirectory: "output/coverage/jest",
    setupFiles: ["react-app-polyfill/jsdom"],
    roots: ["<rootDir>/src"],
    testPathIgnorePatterns: [
        "node_modules/",
        "config/",
        "scripts/",
        "<rootDir>/*.config.js",
        "<rootDir>/src/context/configuration-context.model.tsx",
        "<rootDir>/src/context/configuration-context.tsx",
        "src/serviceWorker.ts"
    ],
    coveragePathIgnorePatterns: [
        "app/babel.config.js",
        "app/jest.config.js",
        "<rootDir>/*.config.js",
        "src/model",
        "<rootDir>/src/context/configuration-context.model.tsx",
        "<rootDir>/src/context/configuration-context.tsx",
        "src/serviceWorker.ts"
    ],
    testResultsProcessor: "jest-sonar-reporter",
    setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
    testMatch: [
        "<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}",
        "<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}",
        "**/*.test.(ts|tsx)"
    ],
    testEnvironment: "jest-environment-jsdom-fourteen",
    transform: {
        "^.+\\.tsx?$": "ts-jest",
        "^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/node_modules/babel-jest",
        "^.+\\.css$": "<rootDir>/config/jest/cssTransform.js",
        "^(?!.*\\.(js|jsx|ts|tsx|css|json)$)":
            "<rootDir>/config/jest/fileTransform.js"
    },
    transformIgnorePatterns: [
        "[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$",
        "^.+\\.module\\.(css|sass|scss)$"
    ],
    modulePaths: [],
    moduleNameMapper: {
        "^react-native$": "react-native-web",
        "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy",
        "\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
            "identity-obj-proxy",
        "\\.(css|less|scss|sass)$": "identity-obj-proxy",
        intlLoaders: 'terra-enzyme-intl',
        translationsLoaders: 'terra-enzyme-intl'
    },
    moduleFileExtensions: [
        "web.js",
        "js",
        "web.ts",
        "ts",
        "web.tsx",
        "tsx",
        "json",
        "web.jsx",
        "jsx",
        "node"
    ],
    watchPlugins: [
        "jest-watch-typeahead/filename",
        "jest-watch-typeahead/testname"
    ]
};
