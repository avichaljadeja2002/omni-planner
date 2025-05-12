import { $, browser } from '@wdio/globals';
import type { ChainablePromiseElement } from 'webdriverio'; // Import types for better clarity

/**
 * main page object containing all methods, selectors and functionality
 * that is shared across all page objects
 */
export default class Page {
    // Define emailInput as a getter that returns the element
    get emailInput(): any{
        return $('~email-input');
    }

    get screenTitle(): any {
        return $('~welcome-title');
    }


    public async waitForAuthScreenLoaded() {
        // Wait for the screen title to be visible first (more stable indicator of the screen)
        await this.screenTitle.waitForDisplayed({ timeout: 30000, timeoutMsg: 'Auth screen title not displayed' });

        // Now that the screen is likely loaded, wait for the email input
        await this.emailInput.waitForDisplayed({ timeout: 10000, timeoutMsg: 'Email input not displayed after screen load' });
    }

    // Add other shared methods if needed
}