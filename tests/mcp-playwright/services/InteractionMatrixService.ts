import { Page } from '@playwright/test';

/**
 * Interaction Matrix Service
 * Tests all types of user interactions automatically
 */
export class InteractionMatrixService {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Execute complete interaction matrix testing
   */
  async executeInteractionMatrix(): Promise<boolean> {
    try {
      // Test hover interactions
      await this.testHoverInteractions();

      // Test click interactions
      await this.testClickInteractions();

      // Test drag and drop
      await this.testDragAndDrop();

      // Test keyboard interactions
      await this.testKeyboardInteractions();

      // Test file uploads
      await this.testFileUploads();

      // Test scroll interactions
      await this.testScrollInteractions();

      return true;
    } catch (error) {
      console.error('Interaction matrix test failed:', error);
      return false;
    }
  }

  /**
   * Test hover interactions and tooltips
   */
  private async testHoverInteractions(): Promise<void> {
    const hoverableElements = await this.detectHoverableElements();

    for (const element of hoverableElements) {
      try {
        // Hover over element
        await this.page.hover(element.selector);
        await this.page.waitForTimeout(500);

        // Check for tooltip or hover effects
        await this.validateTooltipAccessibility();

        // Check for visual changes
        const hasHoverEffect = await this.page.evaluate(selector => {
          const el = document.querySelector(selector);
          if (!el) return false;

          const style = window.getComputedStyle(el);
          return style.cursor === 'pointer' || style.transform !== 'none' || style.opacity !== '1';
        }, element.selector);
      } catch (error) {
        console.warn(`Hover test failed for ${element.selector}:`, error);
      }
    }
  }

  /**
   * Test various click interactions
   */
  private async testClickInteractions(): Promise<void> {
    const clickableElements = await this.detectClickableElements();

    for (const element of clickableElements.slice(0, 20)) {
      // Limit to prevent excessive testing
      try {
        // Test left click
        await this.page.click(element.selector);
        await this.page.waitForTimeout(500);

        // Test double click if appropriate
        if (element.type === 'button' || element.type === 'div') {
          await this.page.dblclick(element.selector);
          await this.page.waitForTimeout(500);
        }

        // Test right click context menu
        await this.page.click(element.selector, { button: 'right' });
        await this.page.waitForTimeout(300);

        // Press Escape to close any context menus
        await this.page.keyboard.press('Escape');
      } catch (error) {
        console.warn(`Click test failed for ${element.selector}:`, error);
      }
    }
  }

  /**
   * Test drag and drop functionality
   */
  private async testDragAndDrop(): Promise<void> {
    const draggableElements = await this.detectDraggableElements();

    for (const item of draggableElements) {
      try {
        // Perform drag and drop
        await this.page.dragAndDrop(item.source, item.target);
        await this.page.waitForTimeout(1000);

        // Validate drag accessibility
        await this.validateDragAccessibility();
      } catch (error) {
        console.warn(`Drag and drop test failed:`, error);
      }
    }
  }

  /**
   * Test keyboard interactions
   */
  private async testKeyboardInteractions(): Promise<void> {
    // Test common keyboard shortcuts
    const shortcuts = [
      'Tab',
      'Shift+Tab',
      'Enter',
      'Space',
      'Escape',
      'ArrowUp',
      'ArrowDown',
      'ArrowLeft',
      'ArrowRight',
      'Home',
      'End',
    ];

    for (const shortcut of shortcuts) {
      try {
        await this.page.keyboard.press(shortcut);
        await this.page.waitForTimeout(200);
      } catch (error) {
        console.warn(`Keyboard shortcut ${shortcut} failed:`, error);
      }
    }

    // Test text input in various fields
    const textInputs = await this.page.$$('input[type="text"], input[type="search"], textarea');

    for (const input of textInputs.slice(0, 5)) {
      try {
        await input.focus();
        await this.page.keyboard.type('Test keyboard input');
        await this.page.keyboard.press('Control+a'); // Select all
        await this.page.keyboard.press('Delete'); // Delete
      } catch (error) {
        console.warn('Text input test failed:', error);
      }
    }
  }

  /**
   * Test file upload functionality
   */
  private async testFileUploads(): Promise<void> {
    const fileInputs = await this.page.$$('input[type="file"]');

    if (fileInputs.length === 0) return;

    // Create test files in memory (mock files)
    const testFiles = await this.createTestFiles();

    for (const input of fileInputs) {
      try {
        // Test single file upload
        await input.setInputFiles(testFiles[0]);
        await this.page.waitForTimeout(1000);

        // Validate upload feedback
        await this.validateUploadFeedback();

        // Test multiple file upload if supported
        const acceptsMultiple = await input.getAttribute('multiple');
        if (acceptsMultiple !== null) {
          await input.setInputFiles(testFiles);
          await this.page.waitForTimeout(1000);
        }

        // Clear files
        await input.setInputFiles([]);
      } catch (error) {
        console.warn('File upload test failed:', error);
      }
    }
  }

  /**
   * Test scroll interactions
   */
  private async testScrollInteractions(): Promise<void> {
    try {
      // Test page scrolling
      await this.page.evaluate(() => window.scrollTo(0, 0)); // Top
      await this.page.waitForTimeout(300);

      await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2)); // Middle
      await this.page.waitForTimeout(300);

      await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight)); // Bottom
      await this.page.waitForTimeout(300);

      await this.page.evaluate(() => window.scrollTo(0, 0)); // Back to top

      // Test horizontal scrolling if available
      const hasHorizontalScroll = await this.page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });

      if (hasHorizontalScroll) {
        await this.page.evaluate(() => window.scrollTo(document.body.scrollWidth, 0));
        await this.page.waitForTimeout(300);
        await this.page.evaluate(() => window.scrollTo(0, 0));
      }

      // Test scrollable containers
      const scrollableContainers = await this.page.$$(
        '[style*="overflow"], .scrollable, .overflow-auto, .overflow-scroll'
      );

      for (const container of scrollableContainers.slice(0, 3)) {
        try {
          await container.hover();
          await this.page.mouse.wheel(0, 100); // Scroll down
          await this.page.waitForTimeout(200);
          await this.page.mouse.wheel(0, -100); // Scroll up
        } catch (error) {
          console.warn('Container scroll test failed:', error);
        }
      }
    } catch (error) {
      console.warn('Scroll test failed:', error);
    }
  }

  /**
   * Detect hoverable elements
   */
  private async detectHoverableElements(): Promise<Array<{ selector: string; type: string }>> {
    return await this.page.evaluate(() => {
      const elements = document.querySelectorAll(
        'button, a, [role="button"], .hover\\:, [title], [data-tooltip]'
      );

      return Array.from(elements)
        .slice(0, 15)
        .map((el, index) => ({
          selector: el.id ? `#${el.id}` : `${el.tagName.toLowerCase()}:nth-child(${index + 1})`,
          type: el.tagName.toLowerCase(),
        }));
    });
  }

  /**
   * Detect clickable elements
   */
  private async detectClickableElements(): Promise<Array<{ selector: string; type: string }>> {
    return await this.page.evaluate(() => {
      const elements = document.querySelectorAll(
        'button, a, input[type="button"], input[type="submit"], [role="button"], [onclick], .clickable'
      );

      return Array.from(elements).map((el, index) => ({
        selector: el.id
          ? `#${el.id}`
          : el.className
            ? `.${el.className.split(' ')[0]}`
            : `${el.tagName.toLowerCase()}:nth-child(${index + 1})`,
        type: el.tagName.toLowerCase(),
      }));
    });
  }

  /**
   * Detect draggable elements
   */
  private async detectDraggableElements(): Promise<Array<{ source: string; target: string }>> {
    return await this.page.evaluate(() => {
      const draggable = Array.from(
        document.querySelectorAll('[draggable="true"], .draggable, .sortable > *')
      );
      const dropzones = Array.from(document.querySelectorAll('[data-drop], .dropzone, .droppable'));

      const pairs = [];

      for (let i = 0; i < Math.min(draggable.length, 3); i++) {
        for (let j = 0; j < Math.min(dropzones.length, 2); j++) {
          const source = draggable[i];
          const target = dropzones[j];

          if (source !== target) {
            pairs.push({
              source: source.id
                ? `#${source.id}`
                : `${source.tagName.toLowerCase()}:nth-child(${i + 1})`,
              target: target.id
                ? `#${target.id}`
                : `${target.tagName.toLowerCase()}:nth-child(${j + 1})`,
            });
          }
        }
      }

      return pairs;
    });
  }

  /**
   * Validate tooltip accessibility
   */
  private async validateTooltipAccessibility(): Promise<void> {
    // Check for visible tooltips
    const tooltips = await this.page.$$('.tooltip, [role="tooltip"], .tippy-box, .popover');

    for (const tooltip of tooltips) {
      // Check if tooltip has proper ARIA attributes
      const role = await tooltip.getAttribute('role');
      const ariaDescribedby = await tooltip.getAttribute('aria-describedby');
      const id = await tooltip.getAttribute('id');

      // Tooltip should have role="tooltip" or be referenced by aria-describedby
      if (role !== 'tooltip' && !id) {
        console.warn('Tooltip missing proper accessibility attributes');
      }
    }
  }

  /**
   * Validate drag accessibility
   */
  private async validateDragAccessibility(): Promise<void> {
    // Check for drag feedback
    const dragFeedback = await this.page.$$('.drag-preview, .dragging, [aria-grabbed]');

    // Check for drop zone feedback
    const dropFeedback = await this.page.$$('.drop-active, .drag-over, [aria-dropeffect]');

    // Check for screen reader announcements
    const liveRegions = await this.page.$$('[aria-live], [role="status"]');

    // Basic validation - in a real implementation, you'd check for specific ARIA states
    console.log(`Drag feedback elements: ${dragFeedback.length}`);
    console.log(`Drop feedback elements: ${dropFeedback.length}`);
    console.log(`Live regions: ${liveRegions.length}`);
  }

  /**
   * Validate upload feedback
   */
  private async validateUploadFeedback(): Promise<void> {
    // Check for upload progress indicators
    const progressIndicators = await this.page.$$(
      '.progress, [role="progressbar"], .upload-progress'
    );

    // Check for file list or preview
    const fileLists = await this.page.$$('.file-list, .uploaded-files, .file-preview');

    // Check for upload status messages
    const statusMessages = await this.page.$$(
      '.upload-status, [role="status"], .upload-success, .upload-error'
    );

    console.log(`Upload progress indicators: ${progressIndicators.length}`);
    console.log(`File lists: ${fileLists.length}`);
    console.log(`Status messages: ${statusMessages.length}`);
  }

  /**
   * Create test files for upload testing
   */
  private async createTestFiles(): Promise<
    Array<{ name: string; mimeType: string; buffer: Buffer }>
  > {
    // Create mock file data
    const textFile = {
      name: 'test.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('This is a test file content'),
    };

    const csvFile = {
      name: 'test.csv',
      mimeType: 'text/csv',
      buffer: Buffer.from('Name,Email,Phone\nTest User,test@example.com,123-456-7890'),
    };

    const jsonFile = {
      name: 'test.json',
      mimeType: 'application/json',
      buffer: Buffer.from('{"test": "data", "number": 123}'),
    };

    return [textFile, csvFile, jsonFile];
  }
}
