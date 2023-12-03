import { Component } from '../component';
import html from './catalog.tpl.html';

import { ProductList } from '../productList/productList';
import { ID_DB } from '../../services/user.service';
import localforage from 'localforage';

class Catalog extends Component {
  productList: ProductList;

  constructor(props: any) {
    super(props);

    this.productList = new ProductList();
    this.productList.attach(this.view.products);
  }

  async render() {

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
