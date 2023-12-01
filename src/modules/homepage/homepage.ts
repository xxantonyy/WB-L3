import { addElement } from '../../utils/helpers';
import { Component } from '../component';
import html from './homepage.tpl.html';
import { ProductList } from '../productList/productList';
import { userService } from '../../services/user.service';
import { SearchSuggestions } from '../searchSuggestions/searchSuggestions';

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
    await userService.init();
    console.log('userID:', userService.getUserId());

    const response = await fetch('/api/getPopularProducts', {
      headers: {
        'x-userid': userService.getUserId() || '',
      },
    });
    const product_test = [ 
      {id: 1, name:'чехол iphone 13 pro', link: '/'},
      {id: 2, name:'коляски agex', link: '/'},
      {id: 3, name:'яндекс станция 2', link: '/'},
    ]

    const products = await response.json();
    this.popularProducts.update(products);
    this.searchSuggestions.update(product_test);
    // this.searchSuggestions.update(products);
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
