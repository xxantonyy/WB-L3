import { addElement } from '../../utils/helpers';
import { Component } from '../component';
import html from './homepage.tpl.html';

import { ProductList } from '../productList/productList';
import { userService } from '../../services/user.service';

class Homepage extends Component {
  popularProducts: ProductList;

  constructor(props: any) {
    super(props);

    this.popularProducts = new ProductList();
    this.popularProducts.attach(this.view.popular);
  }

  // Здесь мы вызываем напрямую init(), и тем самым обозначаем userId,
  // для корректного отображения в консоли, в терии этот метод излишен, но для того чтобы видеть работоспособность подходит

  async fetchData() {
    await userService.init();
    console.log('userID:', userService.getUserId());

    const response = await fetch('/api/getPopularProducts', {
      headers: {
        'x-userid': userService.getUserId() || '',
      },
    });
    const products = await response.json();
    this.popularProducts.update(products);
  }

  render() {
    this.fetchData();


    // При таком исполнении только в момет вызова и непосредственно поле обработки json можно получить id а не null.
    // Если мы хотим получить userID вне асинхронной функции то получим null.

    // fetch('/api/getPopularProducts', {
    //   headers: {
    //     'x-userid': userService.getUserId() || '',
    //   }
    // })
    //   .then((res) => res.json())
    //   .then((products) => {
    //     console.log('userID:', userService.getUserId());
    //     this.popularProducts.update(products);
    // });

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
