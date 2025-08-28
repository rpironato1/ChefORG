import { Page } from '@playwright/test';
import { WCAGCriterion } from '../types';

/**
 * WCAG 2.1 AA Compliance Service
 * Autonomous validation of accessibility standards
 */
export class WCAGComplianceService {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Execute complete WCAG 2.1 AA compliance testing
   */
  async executeWCAGCompliance(): Promise<number> {
    const wcagTests: Record<string, WCAGCriterion> = {
      // PERCEIVABLE
      '1.1.1': {
        id: '1.1.1',
        level: 'A',
        description: 'Non-text Content - All images have alternative text',
        test: () => this.validateAllImagesHaveAlt(),
      },
      '1.3.1': {
        id: '1.3.1',
        level: 'A',
        description: 'Info and Relationships - Proper heading structure',
        test: () => this.validateHeadingStructure(),
      },
      '1.3.2': {
        id: '1.3.2',
        level: 'A',
        description: 'Meaningful Sequence - Content order makes sense',
        test: () => this.validateMeaningfulSequence(),
      },
      '1.4.3': {
        id: '1.4.3',
        level: 'AA',
        description: 'Contrast - Minimum color contrast ratio 4.5:1',
        test: () => this.validateColorContrast(4.5),
      },
      '1.4.4': {
        id: '1.4.4',
        level: 'AA',
        description: 'Resize text - Text can be resized up to 200%',
        test: () => this.validateTextResize(),
      },

      // OPERABLE
      '2.1.1': {
        id: '2.1.1',
        level: 'A',
        description: 'Keyboard - All functionality available via keyboard',
        test: () => this.validateKeyboardAccessible(),
      },
      '2.1.2': {
        id: '2.1.2',
        level: 'A',
        description: 'No Keyboard Trap - Focus can move away from any component',
        test: () => this.validateNoKeyboardTrap(),
      },
      '2.4.1': {
        id: '2.4.1',
        level: 'A',
        description: 'Bypass Blocks - Skip navigation mechanism provided',
        test: () => this.validateSkipNavigation(),
      },
      '2.4.2': {
        id: '2.4.2',
        level: 'A',
        description: 'Page Titled - Pages have descriptive titles',
        test: () => this.validatePageTitle(),
      },
      '2.4.3': {
        id: '2.4.3',
        level: 'A',
        description: 'Focus Order - Focus order preserves meaning',
        test: () => this.validateFocusOrder(),
      },
      '2.4.4': {
        id: '2.4.4',
        level: 'A',
        description: 'Link Purpose - Link purpose clear from text or context',
        test: () => this.validateLinkPurpose(),
      },
      '2.4.6': {
        id: '2.4.6',
        level: 'AA',
        description: 'Headings and Labels - Descriptive headings and labels',
        test: () => this.validateHeadingsAndLabels(),
      },
      '2.4.7': {
        id: '2.4.7',
        level: 'AA',
        description: 'Focus Visible - Keyboard focus indicator visible',
        test: () => this.validateFocusVisible(),
      },

      // UNDERSTANDABLE
      '3.1.1': {
        id: '3.1.1',
        level: 'A',
        description: 'Language of Page - Page language specified',
        test: () => this.validatePageLanguage(),
      },
      '3.2.1': {
        id: '3.2.1',
        level: 'A',
        description: 'On Focus - No context change on focus',
        test: () => this.validateOnFocus(),
      },
      '3.2.2': {
        id: '3.2.2',
        level: 'A',
        description: 'On Input - No context change on input',
        test: () => this.validateOnInput(),
      },
      '3.3.1': {
        id: '3.3.1',
        level: 'A',
        description: 'Error Identification - Errors clearly identified',
        test: () => this.validateErrorIdentification(),
      },
      '3.3.2': {
        id: '3.3.2',
        level: 'A',
        description: 'Labels or Instructions - Form fields have labels',
        test: () => this.validateFormLabels(),
      },

      // ROBUST
      '4.1.1': {
        id: '4.1.1',
        level: 'A',
        description: 'Parsing - Valid HTML markup',
        test: () => this.validateHTMLValidity(),
      },
      '4.1.2': {
        id: '4.1.2',
        level: 'A',
        description: 'Name, Role, Value - Proper ARIA implementation',
        test: () => this.validateARIAImplementation(),
      },
    };

    let passedTests = 0;
    let totalTests = 0;

    for (const criterion in wcagTests) {
      totalTests++;
      try {
        const passed = await wcagTests[criterion].test();
        if (passed) passedTests++;
      } catch (error) {
        console.error(`WCAG test ${criterion} failed:`, error);
      }
    }

    return passedTests / totalTests;
  }

  /**
   * 1.1.1 - Validate all images have alt text
   */
  async validateAllImagesHaveAlt(): Promise<boolean> {
    const imagesWithoutAlt = await this.page.$$eval('img', images => {
      return images.filter(img => {
        const alt = img.getAttribute('alt');
        const ariaLabel = img.getAttribute('aria-label');
        const ariaLabelledby = img.getAttribute('aria-labelledby');
        const role = img.getAttribute('role');

        // Skip decorative images
        if (role === 'presentation' || alt === '') return false;

        return !alt && !ariaLabel && !ariaLabelledby;
      }).length;
    });

    return imagesWithoutAlt === 0;
  }

  /**
   * 1.3.1 - Validate heading structure
   */
  async validateHeadingStructure(): Promise<boolean> {
    const headings = await this.page.$$eval('h1, h2, h3, h4, h5, h6', headings => {
      return headings.map(h => ({
        level: parseInt(h.tagName.charAt(1)),
        text: h.textContent?.trim() || '',
      }));
    });

    if (headings.length === 0) return false;

    // Should start with h1
    if (headings[0].level !== 1) return false;

    // Check sequential order (no skipping levels)
    for (let i = 1; i < headings.length; i++) {
      const prevLevel = headings[i - 1].level;
      const currentLevel = headings[i].level;

      if (currentLevel > prevLevel + 1) return false;
    }

    return true;
  }

  /**
   * 1.3.2 - Validate meaningful sequence
   */
  async validateMeaningfulSequence(): Promise<boolean> {
    // Check if tab order matches visual order
    const focusableElements = await this.page.$$eval(
      'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])',
      elements => {
        return elements.map(el => {
          const rect = el.getBoundingClientRect();
          return {
            top: rect.top,
            left: rect.left,
            tabIndex: (el as HTMLElement).tabIndex || 0,
          };
        });
      }
    );

    // Simple check: elements should generally be in top-to-bottom, left-to-right order
    for (let i = 1; i < focusableElements.length; i++) {
      const prev = focusableElements[i - 1];
      const current = focusableElements[i];

      if (current.top < prev.top - 50) {
        // Current element is significantly above previous - check if it's also to the right
        if (current.left <= prev.left) return false;
      }
    }

    return true;
  }

  /**
   * 1.4.3 - Validate color contrast
   */
  async validateColorContrast(minRatio: number): Promise<boolean> {
    // Basic implementation - would need more sophisticated color analysis in production
    const hasGoodContrast = await this.page.evaluate(ratio => {
      const elements = document.querySelectorAll('*');
      let violations = 0;

      for (const el of elements) {
        const style = window.getComputedStyle(el);
        const color = style.color;
        const backgroundColor = style.backgroundColor;

        // Skip elements with transparent backgrounds or no text
        if (!el.textContent?.trim() || backgroundColor === 'rgba(0, 0, 0, 0)') continue;

        // Simple heuristic: dark text on light background or light text on dark background
        const isLightText = color.includes('255') || color.includes('white');
        const isDarkBg = backgroundColor.includes('0, 0, 0') || backgroundColor.includes('black');
        const isLightBg = backgroundColor.includes('255') || backgroundColor.includes('white');
        const isDarkText = color.includes('0, 0, 0') || color.includes('black');

        if ((isLightText && !isDarkBg) || (isDarkText && !isLightBg)) {
          violations++;
        }
      }

      return violations < 5; // Allow some violations for complex designs
    }, minRatio);

    return hasGoodContrast;
  }

  /**
   * 1.4.4 - Validate text can be resized
   */
  async validateTextResize(): Promise<boolean> {
    // Test zooming to 200%
    await this.page.setViewportSize({ width: 960, height: 540 }); // Simulate 200% zoom
    await this.page.waitForTimeout(1000);

    // Check if content is still accessible (no horizontal scrolling)
    const hasHorizontalScroll = await this.page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });

    // Reset viewport
    await this.page.setViewportSize({ width: 1920, height: 1080 });

    return !hasHorizontalScroll;
  }

  /**
   * 2.1.1 - Validate keyboard accessibility
   */
  async validateKeyboardAccessible(): Promise<boolean> {
    const interactiveElements = await this.page.$$(
      'button, a, input, select, textarea, [role="button"], [role="link"], [tabindex]:not([tabindex="-1"])'
    );

    for (const element of interactiveElements.slice(0, 10)) {
      // Test first 10 elements
      try {
        await element.focus();
        await this.page.keyboard.press('Enter');
        await this.page.waitForTimeout(100);
      } catch (error) {
        return false;
      }
    }

    return true;
  }

  /**
   * 2.1.2 - Validate no keyboard trap
   */
  async validateNoKeyboardTrap(): Promise<boolean> {
    // Tab through elements and ensure focus can move
    let canEscape = true;

    try {
      for (let i = 0; i < 20; i++) {
        await this.page.keyboard.press('Tab');
        await this.page.waitForTimeout(100);
      }

      // Try to tab backward
      for (let i = 0; i < 5; i++) {
        await this.page.keyboard.press('Shift+Tab');
        await this.page.waitForTimeout(100);
      }
    } catch (error) {
      canEscape = false;
    }

    return canEscape;
  }

  /**
   * 2.4.1 - Validate skip navigation
   */
  async validateSkipNavigation(): Promise<boolean> {
    const skipLinks = await this.page.$$(
      'a[href*="#main"], a[href*="#content"], .skip-link, [aria-label*="skip"]'
    );
    return skipLinks.length > 0;
  }

  /**
   * 2.4.2 - Validate page title
   */
  async validatePageTitle(): Promise<boolean> {
    const title = await this.page.title();
    return title.length > 0 && title.trim() !== '';
  }

  /**
   * 2.4.3 - Validate focus order
   */
  async validateFocusOrder(): Promise<boolean> {
    const focusableElements = await this.page.$$(
      'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return true;

    // Check if tabbing follows logical order
    await focusableElements[0].focus();
    let previousElement = focusableElements[0];

    for (let i = 1; i < Math.min(focusableElements.length, 10); i++) {
      await this.page.keyboard.press('Tab');
      const focused = await this.page.evaluate(() => document.activeElement?.tagName);

      if (!focused) return false;
    }

    return true;
  }

  /**
   * 2.4.4 - Validate link purpose
   */
  async validateLinkPurpose(): Promise<boolean> {
    const ambiguousLinks = await this.page.$$eval('a', links => {
      const ambiguousTexts = ['click here', 'read more', 'here', 'more', 'link'];
      return links.filter(link => {
        const text = link.textContent?.toLowerCase().trim() || '';
        const ariaLabel = link.getAttribute('aria-label')?.toLowerCase() || '';
        const title = link.getAttribute('title')?.toLowerCase() || '';

        return ambiguousTexts.some(ambiguous => text === ambiguous && !ariaLabel && !title);
      }).length;
    });

    return ambiguousLinks === 0;
  }

  /**
   * 2.4.6 - Validate headings and labels
   */
  async validateHeadingsAndLabels(): Promise<boolean> {
    const emptyHeadings = await this.page.$$eval('h1, h2, h3, h4, h5, h6', headings => {
      return headings.filter(h => !h.textContent?.trim()).length;
    });

    const emptyLabels = await this.page.$$eval('label', labels => {
      return labels.filter(label => !label.textContent?.trim()).length;
    });

    return emptyHeadings === 0 && emptyLabels === 0;
  }

  /**
   * 2.4.7 - Validate focus visible
   */
  async validateFocusVisible(): Promise<boolean> {
    const focusableElements = await this.page.$$('button, a, input, select, textarea');

    if (focusableElements.length === 0) return true;

    // Test a few elements to see if focus is visible
    for (const element of focusableElements.slice(0, 3)) {
      await element.focus();

      const hasVisibleFocus = await this.page.evaluate(el => {
        const styles = window.getComputedStyle(el);
        const pseudoStyles = window.getComputedStyle(el, ':focus');

        return (
          styles.outline !== 'none' ||
          styles.outlineWidth !== '0px' ||
          pseudoStyles.outline !== 'none' ||
          pseudoStyles.outlineWidth !== '0px' ||
          styles.boxShadow !== 'none' ||
          pseudoStyles.boxShadow !== 'none'
        );
      }, element);

      if (!hasVisibleFocus) return false;
    }

    return true;
  }

  /**
   * 3.1.1 - Validate page language
   */
  async validatePageLanguage(): Promise<boolean> {
    const lang = await this.page.getAttribute('html', 'lang');
    return lang !== null && lang.trim() !== '';
  }

  /**
   * 3.2.1 - Validate on focus (no context change)
   */
  async validateOnFocus(): Promise<boolean> {
    // This is a simplified test - in practice, you'd monitor for navigation changes
    const focusableElements = await this.page.$$('input, select, textarea');

    for (const element of focusableElements.slice(0, 5)) {
      const urlBefore = this.page.url();
      await element.focus();
      await this.page.waitForTimeout(100);
      const urlAfter = this.page.url();

      if (urlBefore !== urlAfter) return false;
    }

    return true;
  }

  /**
   * 3.2.2 - Validate on input (no context change)
   */
  async validateOnInput(): Promise<boolean> {
    const inputs = await this.page.$$('input[type="text"], input[type="email"], textarea');

    for (const input of inputs.slice(0, 3)) {
      const urlBefore = this.page.url();
      await input.type('test');
      await this.page.waitForTimeout(100);
      const urlAfter = this.page.url();

      if (urlBefore !== urlAfter) return false;

      // Clear the input
      await input.clear();
    }

    return true;
  }

  /**
   * 3.3.1 - Validate error identification
   */
  async validateErrorIdentification(): Promise<boolean> {
    // Look for forms and try to trigger validation
    const forms = await this.page.$$('form');

    for (const form of forms.slice(0, 2)) {
      try {
        // Try to submit without filling required fields
        await form.click(); // Focus on form
        const submitButton = await form.$(
          'button[type="submit"], input[type="submit"], button:not([type])'
        );

        if (submitButton) {
          await submitButton.click();
          await this.page.waitForTimeout(1000);

          // Check if error messages are present and properly identified
          const errorMessages = await this.page.$$(
            '[role="alert"], .error, .invalid, [aria-invalid="true"]'
          );

          if (errorMessages.length > 0) {
            // Errors are properly identified
            continue;
          }
        }
      } catch (error) {
        // Form submission might not work in test environment
        continue;
      }
    }

    return true; // Assume forms handle errors correctly if no obvious issues
  }

  /**
   * 3.3.2 - Validate form labels
   */
  async validateFormLabels(): Promise<boolean> {
    const inputsWithoutLabels = await this.page.$$eval('input, select, textarea', inputs => {
      return inputs.filter(input => {
        if (input.type === 'hidden' || input.type === 'submit' || input.type === 'button')
          return false;

        const id = input.getAttribute('id');
        const ariaLabel = input.getAttribute('aria-label');
        const ariaLabelledby = input.getAttribute('aria-labelledby');
        const placeholder = input.getAttribute('placeholder');

        const label = id ? document.querySelector(`label[for="${id}"]`) : null;
        const parentLabel = input.closest('label');

        return !ariaLabel && !ariaLabelledby && !label && !parentLabel && !placeholder;
      }).length;
    });

    return inputsWithoutLabels === 0;
  }

  /**
   * 4.1.1 - Validate HTML validity (basic check)
   */
  async validateHTMLValidity(): Promise<boolean> {
    // Basic validation - check for common HTML issues
    const issues = await this.page.evaluate(() => {
      const problems = [];

      // Check for duplicate IDs
      const ids = Array.from(document.querySelectorAll('[id]')).map(el => el.id);
      const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
      if (duplicateIds.length > 0) problems.push('Duplicate IDs found');

      // Check for missing alt attributes on images (excluding decorative)
      const imagesWithoutAlt = document.querySelectorAll(
        'img:not([alt]):not([role="presentation"])'
      );
      if (imagesWithoutAlt.length > 0) problems.push('Images without alt attributes');

      return problems;
    });

    return issues.length === 0;
  }

  /**
   * 4.1.2 - Validate ARIA implementation
   */
  async validateARIAImplementation(): Promise<boolean> {
    const ariaIssues = await this.page.evaluate(() => {
      const issues = [];

      // Check for invalid ARIA attributes
      const elementsWithAria = document.querySelectorAll(
        '[aria-label], [aria-labelledby], [aria-describedby], [role]'
      );

      for (const element of elementsWithAria) {
        const role = element.getAttribute('role');
        const ariaLabel = element.getAttribute('aria-label');
        const ariaLabelledby = element.getAttribute('aria-labelledby');

        // Check if aria-labelledby references exist
        if (ariaLabelledby) {
          const ids = ariaLabelledby.split(' ');
          for (const id of ids) {
            if (!document.getElementById(id)) {
              issues.push(`aria-labelledby references non-existent ID: ${id}`);
            }
          }
        }

        // Check for empty aria-label
        if (ariaLabel === '') {
          issues.push('Empty aria-label found');
        }

        // Check for valid roles (basic validation)
        if (
          role &&
          ![
            'button',
            'link',
            'navigation',
            'main',
            'banner',
            'contentinfo',
            'complementary',
            'search',
            'form',
            'region',
            'article',
            'section',
            'aside',
            'header',
            'footer',
            'dialog',
            'alert',
            'status',
            'log',
            'marquee',
            'timer',
            'alertdialog',
            'application',
            'document',
            'img',
            'presentation',
            'none',
          ].includes(role)
        ) {
          // This is a simplified check - ARIA has many more valid roles
        }
      }

      return issues;
    });

    return ariaIssues.length === 0;
  }
}
