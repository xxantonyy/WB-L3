import { addElement } from '../../utils/helpers';
import { Component } from '../component';
import html from './homepage.tpl.html';
import { ProductList } from '../productList/productList';
import { SearchSuggestions, SearchTip } from '../searchSuggestions/searchSuggestions';


class Homepage extends Component {
  popularProducts: ProductList;
  searchSuggestions: SearchSuggestions;

  constructor(props: any) {
    super(props);

    this.searchSuggestions = new SearchSuggestions;
    this.searchSuggestions.attach(this.view.suggestion)
    this.popularProducts = new ProductList();
    this.popularProducts.attach(this.view.popular);
  }

  async fetchData() {
    const response = await fetch('/api/getPopularProducts');


    const product_test: SearchTip[] = [
      { title: 'чехол iphone 13 pro', href: '/' },
      { title: 'коляски agex', href: '/' },
      { title: 'яндекс станция 2', href: '/' },
      { title: 'яндекс станция 3', href: '/' },
      { title: 'яндекс станция 4', href: '/' },
    ]

    const products = await response.json();
    this.popularProducts.update(products);
    this.searchSuggestions.update(product_test || []);
    this.view.suggestion.classList.remove('load');
  }

  render() {
    this.fetchData();

    const isSuccessOrder = new URLSearchParams(window.location.search).get('isSuccessOrder');
    if (isSuccessOrder != null) {
      const $notify = addElement(this.view.notifies, 'div', { className: 'notify' });
      addElement($notify, 'p', {
        innerText:
          'Заказ оформлен. Деньги спишутся с вашей карты, менеджер может позвонить, чтобы уточнить детали доставки',
      });
    }
  }
}

export const homepageComp = new Homepage(html);
