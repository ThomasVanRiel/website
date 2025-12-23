// SliderGenerator.ts - Utility class for generating customizable range sliders

export interface SliderConfig {
  name: string;
  min: number;
  max: number;
  step?: number;
  defaultValue?: number;
  displayPrecision?: number;
  label?: string;
  containerClass?: string;
  labelClass?: string;
  sliderClass?: string;
  valueDisplayClass?: string;
  unit?: string;
  onUpdate?: (value: number) => void;
}

export interface SliderElements {
  container: HTMLDivElement;
  label: HTMLLabelElement;
  slider: HTMLInputElement;
  valueDisplay: HTMLSpanElement;
}

export class SliderGenerator {
  private sliders: Map<string, SliderElements> = new Map();

  /**
   * Creates a complete slider HTML structure with label and value display
   */
  createSlider(config: SliderConfig): SliderElements {
    const {
      name,
      min,
      max,
      step = 0.01,
      defaultValue = min,
      displayPrecision = 2,
      label = name,
      containerClass = '',
      labelClass = 'inline-block text-sm font-medium text-gray-700 mb-2',
      sliderClass = 'w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer',
      valueDisplayClass = 'font-mono',
      unit = '',
      onUpdate
    } = config;

    // Create container
    const container = document.createElement('div');
    container.className = containerClass;

    // Create label
    const labelElement = document.createElement('label');
    labelElement.setAttribute('for', `${name}-slider`);
    labelElement.className = labelClass;

    // Create value display span
    const valueDisplay = document.createElement('span');
    valueDisplay.id = `${name}-value`;
    valueDisplay.className = valueDisplayClass;
    valueDisplay.textContent = defaultValue.toFixed(displayPrecision) + unit;

    // Set label text with value display
    labelElement.innerHTML = `${label}: `;
    labelElement.appendChild(valueDisplay);

    // Create slider input
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.id = `${name}-slider`;
    slider.min = min.toString();
    slider.max = max.toString();
    slider.step = step.toString();
    slider.value = defaultValue.toString();
    slider.className = sliderClass;

    // Add event listener
    slider.addEventListener('input', (event) => {
      const target = event.target as HTMLInputElement;
      const value = parseFloat(target.value);
      valueDisplay.textContent = value.toFixed(displayPrecision) + unit;
      
      if (onUpdate) {
        onUpdate(value);
      }
    });

    // Assemble the structure
    container.appendChild(labelElement);
    container.appendChild(slider);

    const elements: SliderElements = {
      container,
      label: labelElement,
      slider,
      valueDisplay
    };

    // Store reference
    this.sliders.set(name, elements);

    return elements;
  }

  /**
   * Creates just the HTML string for a slider (useful for Astro templates)
   */
  createSliderHTML(config: SliderConfig): string {
    const {
      name,
      min,
      max,
      step = 0.01,
      defaultValue = min,
      displayPrecision = 2,
      label = name,
      containerClass = '',
      labelClass = 'inline-block text-sm font-medium text-gray-700 mb-2',
      sliderClass = 'w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer',
      valueDisplayClass = 'font-mono',
      unit = ''
    } = config;

    return `
      <div class="${containerClass}">
        <label for="${name}-slider" class="${labelClass}">
          ${label}: <span id="${name}-value" class="${valueDisplayClass}">${defaultValue.toFixed(displayPrecision)}${unit}</span>
        </label>
        <input 
          type="range" 
          id="${name}-slider" 
          min="${min}" 
          max="${max}" 
          step="${step}" 
          value="${defaultValue}"
          class="${sliderClass}"
        />
      </div>
    `;
  }

  /**
   * Attaches event listeners to sliders created via HTML
   */
  attachSliderListeners(configs: SliderConfig[]): void {
    configs.forEach(config => {
      const slider = document.getElementById(`${config.name}-slider`) as HTMLInputElement;
      const valueDisplay = document.getElementById(`${config.name}-value`);
      
      if (slider && valueDisplay) {
        slider.addEventListener('input', (event) => {
          const target = event.target as HTMLInputElement;
          const value = parseFloat(target.value);
          const precision = config.displayPrecision || 2;
          const unit = config.unit || '';
          
          valueDisplay.textContent = value.toFixed(precision) + unit;
          
          if (config.onUpdate) {
            config.onUpdate(value);
          }
        });
      }
    });
  }

  /**
   * Gets the current value of a slider
   */
  getValue(name: string): number | null {
    const elements = this.sliders.get(name);
    if (elements) {
      return parseFloat(elements.slider.value);
    }
    
    // Fallback: try to find in DOM
    const slider = document.getElementById(`${name}-slider`) as HTMLInputElement;
    return slider ? parseFloat(slider.value) : null;
  }

  /**
   * Sets the value of a slider
   */
  setValue(name: string, value: number, triggerUpdate = true): boolean {
    const elements = this.sliders.get(name);
    if (elements) {
      elements.slider.value = value.toString();
      const precision = 2; // Default precision
      const unit = ''; // Default unit
      elements.valueDisplay.textContent = value.toFixed(precision) + unit;
      
      if (triggerUpdate) {
        elements.slider.dispatchEvent(new Event('input'));
      }
      return true;
    }
    
    // Fallback: try to find in DOM
    const slider = document.getElementById(`${name}-slider`) as HTMLInputElement;
    const valueDisplay = document.getElementById(`${name}-value`);
    
    if (slider && valueDisplay) {
      slider.value = value.toString();
      valueDisplay.textContent = value.toFixed(2);
      
      if (triggerUpdate) {
        slider.dispatchEvent(new Event('input'));
      }
      return true;
    }
    
    return false;
  }

  /**
   * Removes a slider from the DOM and internal tracking
   */
  removeSlider(name: string): boolean {
    const elements = this.sliders.get(name);
    if (elements && elements.container.parentNode) {
      elements.container.parentNode.removeChild(elements.container);
      this.sliders.delete(name);
      return true;
    }
    return false;
  }

  /**
   * Gets all current slider values as an object
   */
  getAllValues(): Record<string, number> {
    const values: Record<string, number> = {};
    
    this.sliders.forEach((elements, name) => {
      values[name] = parseFloat(elements.slider.value);
    });
    
    return values;
  }
}

// Utility functions for direct use
export function createSlider(config: SliderConfig): SliderElements {
  const generator = new SliderGenerator();
  return generator.createSlider(config);
}

export function createSliderHTML(config: SliderConfig): string {
  const generator = new SliderGenerator();
  return generator.createSliderHTML(config);
}