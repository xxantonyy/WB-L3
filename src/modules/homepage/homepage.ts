import { addElement } from '../../utils/helpers';
import { Component } from '../component';
import html from './homepage.tpl.html';
import { ProductList } from '../productList/productList';
import { SearchSuggestions, SearchTip } from '../searchSuggestions/searchSuggestions';
import localforage from 'localforage';
import { ID_DB } from '../../services/user.service';


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
    const response = await fetch('/api/getPopularProducts', {
      headers: {
        'x-userid': await localforage.getItem(ID_DB) as string || window.userId,
      }
    });

    // // Запрос когда нужно протесчтировать на данных
    // const suggestions_response= await fetch('/api/getSearchSeggestions');
    // const suggestions = await suggestions_response.json();

    // Мокнутые данные для теста
    const product_test: SearchTip[] = [
      { title: 'чехол iphone 13 pro', href: '/' },
      { title: 'коляски agex', href: '/' },
      { title: 'яндекс станция 2', href: '/' },
      { title: 'яндекс станция 3', href: '/' },
      { title: 'яндекс станция 4', href: '/' },
    ]

    // Флаг для переключения входных данных
    let flag = true;


    if (flag) {
      this.searchSuggestions.update(product_test || []);
    } else {
      // this.searchSuggestions.update(suggestions || []);
    }
    this.view.suggestion.classList.remove('load');

    const products = await response.json();
    this.popularProducts.update(products);
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
