// test/pageobjects/main.page.ts
import Page from './page'; // Import the base Page object
import { $ } from '@wdio/globals'; // Import $ for element finding

/**
 * Page object representing the main screen after successful login.
 */
class MainPage extends Page {

    /**
     * Define a selector for an element that exists on the main page
     * after a successful login in your app. Replace with an actual testID
     * from your mainPage component.
     */
    get mainPageHeader() {
        // **IMPORTANT:** Replace '~main-page-header' with a testID from an element on your actual mainPage component.
        // Example: If you have a header <Text testID="main-page-header">...</Text>
        return $('~main-page-header');
    }

    /**
     * A method to wait for the main page to be shown after login.
     */
    public async waitForIsShown() {
        await this.mainPageHeader.waitForDisplayed({ timeout: 30000 }); // Wait for the main page header to be visible
    }

    // Add other selectors and methods for interacting with the main page if needed

}

// Export an instance of the MainPage
export default new MainPage();