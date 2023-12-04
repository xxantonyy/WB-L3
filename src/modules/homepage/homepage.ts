import { addElement } from '../../utils/helpers';
import { Component } from '../component';
import html from './homepage.tpl.html';
import { ProductList } from '../productList/productList';
import localforage from 'localforage';
import { ID_DB } from '../../services/user.service';


class Homepage extends Component {
  popularProducts: ProductList;

  constructor(props: any) {
    super(props);

    this.popularProducts = new ProductList();
    this.popularProducts.attach(this.view.popular);
  }
  
  async fetchData() {
    // await userService.init();

    const response = await fetch('/api/getPopularProducts', {
      headers: {
        'x-userid': await localforage.getItem(ID_DB) as string || window.userId,
      }
    });
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
