import { Component } from '../component';
import './_favorite.scss';
import { ProductList } from '../productList/productList';
import html from './favorite.tpl.html';
import { ProductData } from 'types';
import { cartService } from '../../services/cart.service';

class Favorite extends Component {
  productList: ProductList;
  products: ProductData[];

  constructor(props: any) {
    super(props);

    this.products = [];
    this.productList = new ProductList();
    this.productList.attach(this.view.products);
  }

  async render() {
   if(!this.products) return

    this.products = await cartService.getFavorites();
    this.productList.update(this.products);
  }
}

export const favoriteComp = new Favorite(html);
