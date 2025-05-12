// Remove the line below:
// global.__DEV__ = true; // Or false, depending on what you want to simulate

module.exports = {
    "preset": "react-native",

    // Use <rootDir> and anchor specific mappings
    "moduleNameMapper": {
        "^@/components/(.*)$": "<rootDir>/components/$1",
        "^@/assets/styles/styles$": "<rootDir>/assets/styles/styles.tsx", // Added $ and used <rootDir>
        "^@/styles/(.*)$": "<rootDir>/styles/$1",
        "^@/(.*)$": "<rootDir>/$1", // Used <rootDir>
        // Add mocks for assets like images if needed
        "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/fileMock.js",
        "\\.(css|less)$": "<rootDir>/__mocks__/styleMock.js" // Add if you import css/less directly
    },

    "setupFiles": [
        "./node_modules/react-native-gesture-handler/jestSetup.js",
        "<rootDir>/jest.setup.js" // Assuming jest.setup.js is at the root
    ],
    // If needed, add setupFilesAfterEnv
    // setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],


    "transform": {
        "^.+\\.jsx?$": "babel-jest",
        "^.+\\.tsx?$": "babel-jest"
    },
    "transformIgnorePatterns": [
        "node_modules/(?!(jest-)?react-native|@react-native|@react-navigation|@react-native-community|@expo)"
    ],

    "testMatch": [
        "**/__tests__/**/*.{js,jsx,ts,tsx}",
        "**/?(*.)+(spec|test).{js,jsx,ts,tsx}"
    ],
    "collectCoverage": true,
    "collectCoverageFrom": [
        "src/**/*.{js,jsx,ts,tsx}",
        "!src/**/*.test.{js,jsx,ts,tsx}",
        "!src/**/__tests__/**",
        "!src/**/index.{js,jsx,ts,tsx}",
        "!src/types/**"
    ],
    "coverageReporters": ["text", "lcov", "clover"],
    "coverageDirectory": "coverage",
    "maxWorkers": "50%",
    "verbose": true,

    "globals": {
        "__DEV__": true
    }
}