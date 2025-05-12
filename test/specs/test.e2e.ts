import { expect } from '@wdio/globals';
// Import the renamed/updated page objects
import AuthPage from '../pageobjects/login.page'; // Assuming you renamed LoginPage to AuthPage
import MainPage from '../pageobjects/page'; // Assuming you renamed SecurePage to MainPage

describe('My Login application', () => {
    it('should login with valid credentials', async () => {
        // The app is launched automatically by Appium based on wdio.conf.ts
        // You might want to wait for the initial screen (AuthPage) to be ready
        await AuthPage.waitForIsShown(); // Wait for the Auth screen elements to be visible

        // Use the login method from the AuthPage object
        // Replace 'tomsmith' and 'SuperSecretPassword!' with actual credentials
        // that work for your React Native app's login API.
        console.log("I AM HERE - LOGIN PAGE SHOWED UP!!")
        await AuthPage.login('your_valid_email@example.com', 'your_valid_password!');

        // Now, assert that you are on the main page by checking for an element
        // on that page (defined in MainPage.ts).
        await expect(MainPage.mainPageHeader).toBeDisplayed(); // Assert the main page header is visible

        // Remove the old assertions that were checking text from the-internet.herokuapp.com
        // await expect(SecurePage.flashAlert).toBeExisting();
        // await expect(SecurePage.flashAlert).toHaveText(...);
    });
});