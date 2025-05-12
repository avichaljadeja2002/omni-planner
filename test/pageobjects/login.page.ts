// test/pageobjects/auth.page.ts
import Page from './page'; // Import the base Page object
import { $ } from '@wdio/globals'; // Import $ for element finding

/**
 * Page object representing the Authentication (Login/Signup) screen.
 */
class AuthPage extends Page {

    /**
     * Define selectors using testIDs added to your React Native components.
     * Use '~' prefix for accessibility ID locators, which map to testID in React Native.
     */
    get emailInput() {
        return $('~email-input'); // Corresponds to testID="email-input"
    }

    get passwordInput() {
        return $('~password-input');
    }

    get signInButton() {
        return $('~auth-button'); // This button text changes, but testID remains
    }

    get signUpButton() {
        // If you need to explicitly select the signup toggle button
         return $('~signup-toggle');
    }

     get signInToggle() {
         // If you need to explicitly select the signin toggle button
          return $('~signin-toggle');
     }


    /**
     * Method to perform login actions.
     * @param username Email address for login.
     * @param password Password for login.
     */
    public async login(username: string, password: string) {
        // Ensure we are on the Sign In tab if necessary (optional, depending on initial state)
        // await this.signInToggle.click(); // Uncomment if your app doesn't start on Sign In

        await this.emailInput.setValue(username);
        await this.passwordInput.setValue(password);
        await this.signInButton.click(); // Clicks the button which should have "Log In" text
    }

    /**
     * A method to wait for the Auth screen to be visible.
     * You can call this in your test before interacting with elements.
     */
    public async waitForIsShown() {
        await this.emailInput.waitForDisplayed({ timeout: 30000 }); // Wait for the email input to be visible
    }

    // Add methods for signup if needed
    // public async signup(username: string, password: string) { ... }

}

// Export an instance of the AuthPage
export default new AuthPage();