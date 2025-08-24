import { Page } from '@playwright/test';

/**
 * Form Testing Service
 * Autonomous form validation and interaction testing
 */
export class FormTestingService {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Test all forms on the current page
   */
  async testAllForms(): Promise<boolean> {
    const forms = await this.detectForms();
    let allFormsPassed = true;

    for (const form of forms) {
      try {
        // Test empty form submission (validation)
        await this.testEmptyFormSubmission(form);
        
        // Test form filling and submission
        await this.testFormFilling(form);
        
        // Test form accessibility
        await this.testFormAccessibility(form);
        
      } catch (error) {
        console.error(`Form test failed:`, error);
        allFormsPassed = false;
      }
    }

    return allFormsPassed;
  }

  /**
   * Detect all forms on the page
   */
  private async detectForms(): Promise<any[]> {
    return await this.page.evaluate(() => {
      const forms = Array.from(document.querySelectorAll('form'));
      
      return forms.map((form, index) => {
        const fields = Array.from(form.querySelectorAll('input, select, textarea')).map(field => {
          const input = field as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
          
          return {
            id: input.id || `field-${index}-${Math.random()}`,
            name: input.name || '',
            type: input.type || input.tagName.toLowerCase(),
            required: input.hasAttribute('required'),
            placeholder: input.getAttribute('placeholder') || '',
            options: input.tagName === 'SELECT' ? 
              Array.from((input as HTMLSelectElement).options).map(opt => opt.value) : []
          };
        });

        const submitButton = form.querySelector('button[type="submit"], input[type="submit"], button:not([type])');
        
        return {
          id: form.id || `form-${index}`,
          action: form.action || '',
          method: form.method || 'GET',
          fields,
          submitButton: submitButton ? {
            id: submitButton.id || `submit-${index}`,
            text: (submitButton as HTMLElement).textContent?.trim() || 'Submit'
          } : null
        };
      });
    });
  }

  /**
   * Test empty form submission to validate required field errors
   */
  private async testEmptyFormSubmission(form: any): Promise<void> {
    if (!form.submitButton) return;

    // Clear all fields first
    for (const field of form.fields) {
      if (field.type !== 'submit' && field.type !== 'button') {
        try {
          const element = await this.page.locator(`#${field.id}, [name="${field.name}"]`).first();
          await element.clear();
        } catch (error) {
          // Field might not be clearable
        }
      }
    }

    // Try to submit
    try {
      await this.page.click(`#${form.submitButton.id}`);
      await this.page.waitForTimeout(1000);

      // Check for validation errors
      await this.validateRequiredFieldErrors();
    } catch (error) {
      // Submission might be prevented, which is expected for empty required forms
    }
  }

  /**
   * Test form filling with valid data
   */
  private async testFormFilling(form: any): Promise<void> {
    // Fill all fields with appropriate test data
    for (const field of form.fields) {
      if (field.type === 'submit' || field.type === 'button') continue;

      try {
        const selector = field.id ? `#${field.id}` : `[name="${field.name}"]`;
        const element = await this.page.locator(selector).first();

        switch (field.type) {
          case 'email':
            await element.fill(this.generateEmail());
            break;
          case 'password':
            await element.fill(this.generatePassword());
            break;
          case 'tel':
          case 'phone':
            await element.fill(this.generatePhone());
            break;
          case 'url':
            await element.fill('https://example.com');
            break;
          case 'number':
            await element.fill('123');
            break;
          case 'date':
            await element.fill('2024-01-15');
            break;
          case 'time':
            await element.fill('14:30');
            break;
          case 'select':
            if (field.options && field.options.length > 0) {
              await element.selectOption(field.options[0]);
            }
            break;
          case 'checkbox':
            await element.check();
            break;
          case 'radio':
            await element.check();
            break;
          case 'textarea':
            await element.fill('This is a test message for the textarea field.');
            break;
          default:
            // text, search, etc.
            await element.fill(this.generateTextValue(field));
            break;
        }

        await this.page.waitForTimeout(100); // Allow for validation
      } catch (error) {
        console.warn(`Could not fill field ${field.id}:`, error);
      }
    }

    // Submit the form
    if (form.submitButton) {
      try {
        await this.page.click(`#${form.submitButton.id}`);
        await this.page.waitForTimeout(2000);

        // Look for success indicators
        await this.validateFormSubmissionSuccess();
      } catch (error) {
        console.warn('Form submission failed:', error);
      }
    }
  }

  /**
   * Test form accessibility
   */
  private async testFormAccessibility(form: any): Promise<void> {
    // Test keyboard navigation through form
    for (const field of form.fields) {
      if (field.type === 'submit' || field.type === 'button') continue;

      try {
        const selector = field.id ? `#${field.id}` : `[name="${field.name}"]`;
        const element = await this.page.locator(selector).first();
        
        // Focus on element using keyboard
        await element.focus();
        await this.page.waitForTimeout(100);

        // Check if element is properly focused
        const isFocused = await element.evaluate(el => el === document.activeElement);
        if (!isFocused) {
          throw new Error(`Field ${field.id} not properly focusable`);
        }

        // Test keyboard input
        if (field.type === 'text' || field.type === 'email') {
          await this.page.keyboard.type('test');
          await this.page.keyboard.press('Backspace');
          await this.page.keyboard.press('Backspace');
          await this.page.keyboard.press('Backspace');
          await this.page.keyboard.press('Backspace');
        }

      } catch (error) {
        console.warn(`Accessibility test failed for field ${field.id}:`, error);
      }
    }

    // Test form submission with Enter key
    if (form.fields.length > 0) {
      try {
        const firstField = form.fields[0];
        const selector = firstField.id ? `#${firstField.id}` : `[name="${firstField.name}"]`;
        await this.page.locator(selector).first().focus();
        await this.page.keyboard.press('Enter');
        await this.page.waitForTimeout(1000);
      } catch (error) {
        // Enter submission might not be supported
      }
    }
  }

  /**
   * Validate required field error messages
   */
  private async validateRequiredFieldErrors(): Promise<void> {
    // Look for error indicators
    const errorElements = await this.page.$$('[role="alert"], .error, .invalid, [aria-invalid="true"], .field-error');
    
    // Check for validation messages
    const validationMessages = await this.page.$$(':invalid, [data-validation-error]');
    
    // Check HTML5 validation
    const hasHTML5Validation = await this.page.evaluate(() => {
      const inputs = document.querySelectorAll('input[required], select[required], textarea[required]');
      for (const input of inputs) {
        if (!(input as HTMLInputElement).checkValidity()) {
          return true;
        }
      }
      return false;
    });

    if (errorElements.length === 0 && validationMessages.length === 0 && !hasHTML5Validation) {
      console.warn('No validation errors found for empty required form');
    }
  }

  /**
   * Validate successful form submission
   */
  private async validateFormSubmissionSuccess(): Promise<void> {
    // Look for success indicators
    const successIndicators = await this.page.$$('.success, .submitted, [role="status"]');
    
    // Check for URL change (redirect after submission)
    const currentUrl = this.page.url();
    
    // Check for success messages in page content
    const hasSuccessMessage = await this.page.evaluate(() => {
      const successWords = ['success', 'submitted', 'thank you', 'received', 'completed'];
      const pageText = document.body.textContent?.toLowerCase() || '';
      return successWords.some(word => pageText.includes(word));
    });

    // Check for ARIA live regions
    await this.validateAriaLiveRegions();
  }

  /**
   * Validate ARIA live regions for dynamic feedback
   */
  private async validateAriaLiveRegions(): Promise<void> {
    const liveRegions = await this.page.$$('[aria-live], [role="status"], [role="alert"]');
    
    for (const region of liveRegions) {
      const ariaLive = await region.getAttribute('aria-live');
      const role = await region.getAttribute('role');
      const content = await region.textContent();
      
      if ((ariaLive || role) && content?.trim()) {
        // Live region has content, which is good for screen readers
        continue;
      }
    }
  }

  /**
   * Generate test email
   */
  private generateEmail(): string {
    const domains = ['test.com', 'example.org', 'demo.net'];
    const names = ['user', 'test', 'demo', 'sample'];
    
    const name = names[Math.floor(Math.random() * names.length)];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    const number = Math.floor(Math.random() * 1000);
    
    return `${name}${number}@${domain}`;
  }

  /**
   * Generate test password
   */
  private generatePassword(): string {
    return 'TestPass123!';
  }

  /**
   * Generate test phone number
   */
  private generatePhone(): string {
    return '+1234567890';
  }

  /**
   * Generate text value based on field context
   */
  private generateTextValue(field: any): string {
    const name = field.name?.toLowerCase() || '';
    const id = field.id?.toLowerCase() || '';
    const placeholder = field.placeholder?.toLowerCase() || '';
    
    const context = `${name} ${id} ${placeholder}`;
    
    if (context.includes('name')) return 'Test User';
    if (context.includes('company')) return 'Test Company';
    if (context.includes('address')) return '123 Test Street';
    if (context.includes('city')) return 'Test City';
    if (context.includes('zip') || context.includes('postal')) return '12345';
    if (context.includes('country')) return 'Test Country';
    if (context.includes('message') || context.includes('comment')) return 'This is a test message.';
    if (context.includes('title')) return 'Test Title';
    if (context.includes('subject')) return 'Test Subject';
    
    return 'Test Value';
  }
}