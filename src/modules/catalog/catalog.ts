import { Component } from '../component';
import html from './catalog.tpl.html';
import { ProductList } from '../productList/productList';
import localforage from 'localforage';
import { ID_DB } from '../../services/user.service';

class Catalog extends Component {
  productList: ProductList;

  constructor(props: any) {
    super(props);

    this.productList = new ProductList();
    this.productList.attach(this.view.products);
  }

  async render() {

    // доабвляем заголовок 'x-userid': userService.getUserId() || '', получаем userID когда переходим в каталог
    const productsResp = await fetch('/api/getProducts', {
      headers: {
        'x-userid': await localforage.getItem(ID_DB) as string || window.userId,
      }
    });
    const products = await productsResp.json();
    this.productList.update(products);
  }
}

export const catalogComp = new Catalog(html);
