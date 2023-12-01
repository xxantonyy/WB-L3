import { View } from 'src/utils/view';
import html from './searchSuggestions.tpl.html';
import { ViewTemplate } from '../../utils/viewTemplate';

export interface SearchTip {
  id: number;
  name: string;
  link: string;
}

export class SearchSuggestions {
  private tips: SearchTip[] = [];
  private view: View;

  constructor() {
    this.tips = [];
    this.view = new ViewTemplate(html).cloneView();
  }

  attach($root: HTMLElement) {
    $root.innerHTML = '';
    $root.appendChild(this.view.root);
  }

  update(tips: SearchTip[]) {
    this.tips = tips.slice(0, 3);
    this.render();
  }

  render() {
    if(!this.view.querySelectorAll) return;
    const tipsElements = this.view.querySelectorAll('.tips__tip');
    tipsElements.forEach((tipElement, index) => {
      const tip = this.tips[index];
      const tipText = tipElement.querySelector('.tips__tip__text');
      if (!tipText) return;
      tipText.textContent = tip.name;
      tipElement.setAttribute('href', `${window.location.href}product?id=${tip.id}` || '/');
    });
  }
}
