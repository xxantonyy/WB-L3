import { Component } from '../component';
import { Product } from '../product/product';
import html from './checkout.tpl.html';
import { formatPrice, sendEvent } from '../../utils/helpers';
import { cartService } from '../../services/cart.service';
import { ProductData } from 'types';

class Checkout extends Component {
  products!: ProductData[];

  async render() {
    this.products = await cartService.get();

    if (this.products.length < 1) {
      this.view.root.classList.add('is__empty');
      return;
    }

    this.products.forEach((product) => {
      const productComp = new Product(product, { isHorizontal: true });
      productComp.render();
      productComp.attach(this.view.cart);
    });

    // переназначаем в переменную totalPrice для того чтобы передать в следилку
    const totalPrice = this.products.reduce((acc, product) => (acc += product.salePriceU), 0);
    this.view.price.innerText = formatPrice(totalPrice);

    this.view.btnOrder.onclick = this._makeOrder.bind(this, totalPrice);
  }

  private async _makeOrder(totalPrice: number) {
    // Отправляем ивент с заполнеными полями в случае заказа
    sendEvent('purchase', {
      orderId: 'новый_заказ',
      totalPrice: totalPrice,
      productIds: this.products.map((product) => product.id)
    });
    console.log('Заказ сделан!');

    await cartService.clear();
    fetch('/api/makeOrder', {
      method: 'POST',
      body: JSON.stringify(this.products)
    });
    window.location.href = '/?isSuccessOrder';
  }
}

export const checkoutComp = new Checkout(html);
