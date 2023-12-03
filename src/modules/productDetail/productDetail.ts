import { Component } from '../component';
import { ProductList } from '../productList/productList';
import { formatPrice, sendEvent } from '../../utils/helpers';
import { ProductData } from 'types';
import html from './productDetail.tpl.html';
import { cartService } from '../../services/cart.service';

class ProductDetail extends Component {
  more: ProductList;
  product?: ProductData;

  constructor(props: any) {
    super(props);

    this.more = new ProductList();
    this.more.attach(this.view.more);
  }
    // Сделал кнопку видимой и нажимаемой
  attach($root: HTMLElement) {
    super.attach($root);
    this.view.btnFav = this.view.root.querySelector('.btnFav');
  }

  async render() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = Number(urlParams.get('id'));

    const productResp = await fetch(`/api/getProduct?id=${productId}`);
    this.product = await productResp.json();

    if (!this.product) return;

    const { id, src, name, description, salePriceU } = this.product;

    this.view.photo.setAttribute('src', src);
    this.view.title.innerText = name;
    this.view.description.innerText = description;
    this.view.price.innerText = formatPrice(salePriceU);
    this.view.btnBuy.onclick = this._addToCart.bind(this);

    // Добавил слушатель на кнопку избранного
    this.view.btnFav.onclick = this._toggleFavorite.bind(this);

    const isInCart = await cartService.isInCart(this.product);
    const isFavorite = await cartService.isFavorite(this.product);

    if (isInCart) this._setInCart();
    if (isFavorite) this._setFavorite();

    fetch(`/api/getProductSecretKey?id=${id}`)
      .then((res) => res.json())
      .then((secretKey) => {
        this.view.secretKey.setAttribute('content', secretKey);
      });
      // Добавляем заголовок, получаем userID, когда переходим в карточку товара
    fetch('/api/getPopularProducts')
      .then((res) => res.json())
      .then((products) => {
        this.more.update(products);
      });
  }

  private _addToCart() {
    if (!this.product) return;
    sendEvent('addToCard', this.product);
    console.log('Добавлено в корзину!');

    cartService.addProduct(this.product);
    this._setInCart();
  }

  private async _toggleFavorite() {
    if (!this.product) return;

    if (await cartService.isFavorite(this.product)) {
      cartService.removeFromFavorites(this.product);
      this._unsetFavorite();
    } else {
      cartService.addToFavorites(this.product);
      this._setFavorite();
    }
  }

  private _setInCart() {
    this.view.btnBuy.innerText = '✓ В корзине';
    this.view.btnBuy.disabled = true;
  }

  private _setFavorite() {
    this.view.btnFav.childNodes[1].classList.add('favireteIcon');
  }

  private _unsetFavorite() {
    this.view.btnFav.childNodes[1].classList.remove('favireteIcon');
  }
}

export const productDetailComp = new ProductDetail(html);
